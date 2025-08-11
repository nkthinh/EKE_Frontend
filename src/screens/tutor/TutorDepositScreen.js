import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import TeacherLayout from "../../components/navigation/TeacherLayout";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../hooks/useAuth";
import { walletService } from "../../services";
import { formatCurrency } from "../../utils/format";

const TutorDepositScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState(
    route?.params?.requiredAmount ? String(route.params.requiredAmount) : ""
  );
  const { userData } = useAuth();
  const [wallet, setWallet] = useState({ balance: 0 });

  useEffect(() => {
    const loadWallet = async () => {
      try {
        if (!userData?.id) return;
        const data = await walletService.getWallet(userData.id);
        const walletData = data?.data || data;
        setWallet(walletData || { balance: 0 });
      } catch (e) {
        console.warn("Load wallet failed:", e?.message);
      }
    };
    loadWallet();
  }, [userData?.id]);

  const handlePresetAmount = (value) => {
    setAmount(value);
  };

  return (
    <TeacherLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Icon
              name="notifications"
              size={24}
              color="#fff"
              style={styles.notificationIcon}
            />
          </View>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Số dư ví</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(Number(wallet?.balance || 0))}
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.depositButton}>
              <Text style={styles.depositText}>▲ Nạp Tiền vào ví</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.depositSection}>
            <Text style={styles.depositLabel}>Số tiền cần nạp</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0đ"
            />

            {/* QR Code section */}
            <View style={[styles.card, { alignItems: "center" }]}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                Quét QR để chuyển khoản
              </Text>
              <Image
                source={require("../../assets/qrcode.png")}
                style={{ width: 260, height: 260, resizeMode: "contain" }}
              />
              <Text style={{ marginTop: 8, color: "#555" }}>
                Nội dung chuyển khoản: SĐT + Họ tên
              </Text>
            </View>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Nạp Tiền</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TeacherLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  header: {
    height: 250,
    backgroundColor: "#31B7EC",
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 24,
    color: "#fff",
  },
  notificationIcon: {
    marginLeft: 20,
  },
  profile: {
    display: "none",
  },
  balanceSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 20,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  profileImage: {},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  depositButton: {
    backgroundColor: "#FFCA28",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "70%",
  },
  depositText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  depositSection: {
    marginTop: 20,
  },
  depositLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  amountInput: {
    width: "90%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: "left",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  presetButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  presetButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "30%",
  },
  presetButtonText: {
    fontSize: 12,
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#2CC569",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 80,
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default TutorDepositScreen;
