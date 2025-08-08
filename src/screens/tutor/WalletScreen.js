import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BottomMenu from "../../components/common/BottomMenu";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";

const WalletScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [plan, setPlan] = useState(null);

  const fetchPlan = async () => {
    const json = await AsyncStorage.getItem("subscriptionPlan");
    if (json) {
      const parsed = JSON.parse(json);

      // Bổ sung ngày gia hạn nếu chưa có
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
    Alert.alert(
      "Huỷ tự động gia hạn",
      "Bạn có chắc muốn huỷ tự động gia hạn gói này?",
      [
        { text: "Không" },
        {
          text: "Đồng ý",
          onPress: async () => {
            const updated = { ...plan, autoRenew: false };
            await AsyncStorage.setItem(
              "subscriptionPlan",
              JSON.stringify(updated)
            );
            setPlan(updated);
            alert("Đã huỷ tự động gia hạn.");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        onPress={() => navigation.navigate("TutorProfile")}
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
            <Text style={styles.value}>{getPrice(plan.name)}</Text>

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

          {plan.autoRenew && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={cancelAutoRenew}
            >
              <Text style={styles.cancelText}>Huỷ Tự Động Gia Hạn</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.noPlanWrapper}>
          <Text style={styles.noPlan}>Bạn chưa đăng ký gói nào.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("UpgradeScreen")}
            style={styles.upgradeButton}
          >
            <Text style={styles.upgradeText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomMenu navigation={navigation} userRole={userData?.role} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
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
