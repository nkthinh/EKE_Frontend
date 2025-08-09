import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import StudentLayout from "../../components/navigation/StudentLayout";
import { useFocusEffect } from "@react-navigation/native";
import { subscriptionService } from "../../services/features";
import { formatCurrency } from "../../utils/format";

const WalletScreen = ({ navigation }) => {
  const [plan, setPlan] = useState(null);

  const fetchPlan = async () => {
    try {
      // 1) Ưu tiên lấy từ API gói hiện tại của user
      const res = await subscriptionService.getCurrentSubscription();
      const current = res?.data || res || null;
      if (current) {
        setPlan(current);
        await AsyncStorage.setItem("subscriptionPlan", JSON.stringify(current));
        return;
      }
    } catch (e) {
      // Ignore and fallback to local
      console.warn("Fetch current subscription failed:", e?.message);
    }

    // 2) Fallback: lấy từ local storage
    const json = await AsyncStorage.getItem("subscriptionPlan");
    if (json) {
      const parsed = JSON.parse(json);

      if (!parsed.nextRenewalDate) {
        const nextDate = new Date(parsed.startDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        parsed.nextRenewalDate = nextDate.toISOString();
        await AsyncStorage.setItem("subscriptionPlan", JSON.stringify(parsed));
      }
      setPlan(parsed);
    } else {
      setPlan(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlan();
    }, [])
  );

  const isExpired = (nextDate) => {
    return new Date(nextDate) < new Date();
  };

  const getPrice = (planName) => {
    switch (planName) {
      case "Silver":
        return "50.000 đ";
      case "Gold":
        return "90.000 đ";
      case "Diamond":
        return "130.000 đ";
      default:
        return "---";
    }
  };

  const cancelAutoRenew = async () => {
    if (!plan?.id) {
      alert("Không xác định được gói để huỷ.");
      return;
    }
    Alert.alert("Huỷ đăng ký", "Bạn có chắc muốn huỷ gói hiện tại?", [
      { text: "Không" },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            await subscriptionService.cancelSubscription(plan.id);
            await AsyncStorage.removeItem("subscriptionPlan");
            setPlan(null);
            alert("Đã huỷ gói thành công.");
          } catch (e) {
            alert(e?.message || "Huỷ gói thất bại");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        onPress={() => navigation.navigate("StudentHome")}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Gói Đăng Ký</Text>

      {plan ? (
        <>
          <Text style={styles.total}>Tổng số gói đã đăng ký: 1</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Gói đang sử dụng:</Text>
            <Text style={styles.planName}>{plan.name}</Text>

            <Text style={styles.label}>Giá tiền:</Text>
            <Text style={styles.value}>
              {plan?.price != null
                ? formatCurrency(Number(plan.price))
                : getPrice(plan.name)}
            </Text>

            <Text style={styles.label}>Ngày đăng ký:</Text>
            <Text style={styles.value}>
              {new Date(plan.startDate).toLocaleDateString("vi-VN")}
            </Text>

            <Text style={styles.label}>Ngày gia hạn tiếp theo:</Text>
            <Text style={styles.value}>
              {new Date(plan.nextRenewalDate).toLocaleDateString("vi-VN")}
            </Text>

            <Text style={styles.label}>Tự động gia hạn:</Text>
            <Text
              style={[
                styles.value,
                { color: plan.autoRenew ? "green" : "red" },
              ]}
            >
              {plan.autoRenew ? "Bật" : "Đã tắt"}
            </Text>

            <Text style={styles.label}>Trạng thái:</Text>
            <Text
              style={[
                styles.value,
                { color: isExpired(plan.nextRenewalDate) ? "red" : "green" },
              ]}
            >
              {isExpired(plan.nextRenewalDate) ? "Hết hạn" : "Còn hiệu lực"}
            </Text>
          </View>

          {plan && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={cancelAutoRenew}
            >
              <Text style={styles.cancelText}>Huỷ đăng ký</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.noPlanWrapper}>
          <Text style={styles.noPlan}>Bạn chưa đăng ký gói nào.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("StudentPackage")}
            style={styles.upgradeButton}
          >
            <Text style={styles.upgradeText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      )}
      <StudentLayout navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#31B7EC",
  },
  total: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#f2faff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  planName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#31B7EC",
    marginBottom: 10,
    marginTop: 6,
  },
  cancelBtn: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 30,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  noPlanWrapper: {
    alignItems: "center",
    marginTop: 40,
  },
  noPlan: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: "#31B7EC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  upgradeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WalletScreen;
