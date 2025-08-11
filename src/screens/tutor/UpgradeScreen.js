import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { subscriptionService } from "../../services/features";
import { walletService } from "../../services";
import { useAuth } from "../../hooks/useAuth";

const UpgradeScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0 });
  const { userData } = useAuth();

  // Gói cơ bản mặc định khi không có dữ liệu từ API
  const defaultPlans = [
    {
      id: "basic",
      name: "Gói Cơ Bản",
      price: 50000,
      description: "Gói đăng ký cơ bản cho gia sư",
      hasPriorityMatching: false,
      hasAssistant: false,
      noAds: false,
    },
    {
      id: "premium",
      name: "Gói Premium",
      price: 90000,
      description: "Gói đăng ký cao cấp với nhiều tính năng",
      hasPriorityMatching: true,
      hasAssistant: true,
      noAds: true,
    },
    {
      id: "vip",
      name: "Gói VIP",
      price: 130000,
      description: "Gói đăng ký VIP với tất cả tính năng",
      hasPriorityMatching: true,
      hasAssistant: true,
      noAds: true,
    },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await subscriptionService.getSubscriptions();
        const list = Array.isArray(res) ? res : res?.data || [];

        // Nếu có dữ liệu từ API, sử dụng dữ liệu đó
        if (list && list.length > 0) {
          setPlans(list);
          setSelectedId(list[0].id);
        } else {
          // Nếu không có dữ liệu, sử dụng gói cơ bản mặc định
          console.log(
            "⚠️ Không có dữ liệu gói từ API, sử dụng gói cơ bản mặc định"
          );
          setPlans(defaultPlans);
          setSelectedId(defaultPlans[0].id);
        }
      } catch (e) {
        console.warn("Không thể tải danh sách gói:", e);
        setError("Không thể tải danh sách gói");
        // Sử dụng gói cơ bản khi có lỗi
        setPlans(defaultPlans);
        setSelectedId(defaultPlans[0].id);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        if (!userData?.id) return;
        const data = await walletService.getWallet(userData.id);
        const walletData = data?.data || data;
        setWallet(walletData || { balance: 0 });
      } catch (e) {
        console.warn("Không thể tải số dư ví:", e?.message);
      }
    };
    loadWallet();
  }, [userData?.id]);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedId) || null,
    [plans, selectedId]
  );

  const featuresForSelected = useMemo(() => {
    if (!selectedPlan) return [];
    const features = [];
    if (selectedPlan.hasPriorityMatching)
      features.push("Ưu tiên hiển thị khi tìm kiếm");
    if (selectedPlan.hasAssistant)
      features.push("Có trợ lý hỗ trợ lựa chọn gia sư");
    if (selectedPlan.noAds) features.push("Không quảng cáo");
    if (selectedPlan.description) features.push(selectedPlan.description);
    return features.length ? features : ["Gói đăng ký"];
  }, [selectedPlan]);

  const handleRegister = async () => {
    if (!selectedPlan) return;

    // Ensure wallet is up to date before comparing
    try {
      if (userData?.id) {
        const data = await walletService.getWallet(userData.id);
        const walletData = data?.data || data;
        setWallet(walletData || { balance: 0 });
      }
    } catch {}

    const balance = Number(wallet?.balance || 0);
    const price = Number(selectedPlan?.price || 0);

    if (balance < price) {
      const needAmount = Math.max(price - balance, 0);
      Alert.alert(
        "Số dư không đủ",
        `Bạn cần nạp thêm ${needAmount.toLocaleString()} đ để đăng ký gói này.`,
        [
          {
            text: "Nạp tiền",
            onPress: () =>
              navigation.navigate("TutorDeposit", {
                requiredAmount: needAmount,
              }),
          },
          { text: "Đóng" },
        ]
      );
      return;
    }

    // Nếu là gói mặc định (không có API), chỉ lưu local
    if (
      selectedPlan.id === "basic" ||
      selectedPlan.id === "premium" ||
      selectedPlan.id === "vip"
    ) {
      try {
        setLoading(true);
        const today = new Date().toISOString();
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 1);
        const planToStore = {
          id: selectedPlan.id,
          name: selectedPlan.name,
          startDate: today,
          nextRenewalDate: nextDate.toISOString(),
          autoRenew: true,
        };
        await AsyncStorage.setItem(
          "subscriptionPlan",
          JSON.stringify(planToStore)
        );

        Alert.alert("✅ Thành công", "Đăng ký gói thành công!");
        navigation.navigate("TutorWallet");
      } catch (e) {
        Alert.alert("❌ Lỗi", "Không thể lưu gói đăng ký");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Enough balance: call purchase API for real packages
    try {
      setLoading(true);
      console.log("🛒 Purchasing subscription for packageId:", selectedPlan.id);
      const purchaseRes = await subscriptionService.purchaseSubscription(
        selectedPlan.id
      );
      console.log("🛒 Purchase API raw result:", purchaseRes);
      const purchased = purchaseRes?.data || purchaseRes;

      // Persist minimal plan info locally
      const today = new Date().toISOString();
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);
      const planToStore = {
        id: selectedPlan.id,
        name: selectedPlan.name,
        startDate: purchased?.createdAt || today,
        nextRenewalDate: purchased?.nextRenewalDate || nextDate.toISOString(),
        autoRenew: true,
      };
      await AsyncStorage.setItem(
        "subscriptionPlan",
        JSON.stringify(planToStore)
      );

      Alert.alert("✅ Thành công", "Đăng ký gói thành công!");
      navigation.navigate("TutorWallet");
    } catch (e) {
      Alert.alert("❌ Lỗi", e?.message || "Mua gói thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={30} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nâng Cấp Tài Khoản</Text>
        <Text style={styles.subTitle}>Chọn gói đăng ký dành cho Gia Sư</Text>

        {loading && (
          <Text
            style={{ textAlign: "center", color: "#888", marginBottom: 10 }}
          >
            Đang tải danh sách gói...
          </Text>
        )}
        {error && (
          <Text style={{ textAlign: "center", color: "red", marginBottom: 10 }}>
            {error}
          </Text>
        )}

        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.option,
              selectedId === plan.id && styles.optionSelected,
            ]}
            onPress={() => setSelectedId(plan.id)}
          >
            <View>
              <Text style={styles.optionTitle}>{plan.name}</Text>
              <Text style={styles.optionDesc}>Thanh toán hàng tháng</Text>
            </View>
            <Text style={styles.price}>
              {parseInt(plan.price || 0).toLocaleString()} đ
            </Text>
            <Icon
              name={
                selectedId === plan.id ? "check-circle" : "check-circle-outline"
              }
              size={30}
              color={selectedId === plan.id ? "#3C90EF" : "#ccc"}
            />
          </TouchableOpacity>
        ))}

        {selectedPlan && (
          <>
            <Text style={styles.featureHeader}>
              Tính Năng Gói {selectedPlan.name}
            </Text>
            {featuresForSelected.map((text, i) => (
              <View key={i} style={styles.feature}>
                <Text style={styles.featureText}>{text}</Text>
                <Icon name="check-circle" size={24} color="green" />
              </View>
            ))}
          </>
        )}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Đăng Ký</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24, paddingBottom: 100, paddingTop: 100 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subTitle: {
    textAlign: "center",
    color: "#888",
    fontSize: 18,
    marginBottom: 24,
  },
  option: {
    backgroundColor: "#e7f3ff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  optionSelected: {
    backgroundColor: "#cde8ff",
    borderWidth: 1.5,
    borderColor: "#3C90EF",
  },
  optionTitle: { fontSize: 20, fontWeight: "bold" },
  optionDesc: { fontSize: 16, color: "#555", marginTop: 2 },
  price: { fontSize: 18, fontWeight: "bold", marginHorizontal: 12 },
  featureHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 14,
  },
  feature: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5faff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: { fontSize: 18, color: "#333", flex: 1, paddingRight: 10 },
  registerButton: {
    backgroundColor: "#31B7EC",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  registerText: { fontSize: 22, color: "#fff", fontWeight: "bold" },
});

export default UpgradeScreen;
