import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import StudentLayout from "../../components/navigation/StudentLayout";
import Icon from "react-native-vector-icons/Ionicons";

const DepositScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");

  const handlePresetAmount = (value) => {
    setAmount(value);
  };

  return (
    <StudentLayout navigation={navigation}>
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
          <View style={styles.profile}>
            <Image
              source={require("../../assets/girl.jpg")}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Số dư ví</Text>
            <Text style={styles.balanceAmount}>800,000đ</Text>
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
            <View style={styles.card}>
              <View style={styles.presetButtons}>
                <TouchableOpacity
                  style={[styles.presetButton, styles.shadow]}
                  onPress={() => handlePresetAmount("50,000đ")}
                >
                  <Text style={styles.presetButtonText}>50,000đ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetButton, styles.shadow]}
                  onPress={() => handlePresetAmount("100,000đ")}
                >
                  <Text style={styles.presetButtonText}>100,000đ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetButton, styles.shadow]}
                  onPress={() => handlePresetAmount("200,000đ")}
                >
                  <Text style={styles.presetButtonText}>200,000đ</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.presetButtons}>
                <TouchableOpacity
                  style={[styles.presetButton, styles.shadow]}
                  onPress={() => handlePresetAmount("500,000đ")}
                >
                  <Text style={styles.presetButtonText}>500,000đ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetButton, styles.shadow]}
                  onPress={() => handlePresetAmount("1,000,000đ")}
                >
                  <Text style={styles.presetButtonText}>1,000,000đ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetButton, styles.shadow]}
                  onPress={() => handlePresetAmount("2,000,000đ")}
                >
                  <Text style={styles.presetButtonText}>2,000,000đ</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Nạp Tiền</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </StudentLayout>
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
    flex: 1,
    alignItems: "flex-end",
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
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

export default DepositScreen;
