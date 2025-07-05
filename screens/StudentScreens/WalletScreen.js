import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import StudentLayout from "../../layout/StudentLayout";
import Icon from "react-native-vector-icons/Ionicons";

const WalletScreen = ({ navigation }) => {
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
        <View style={{ paddingInline: 20 }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.depositButton} onPress={() => navigation.navigate("StudentDepositScreen")}>
              <Text style={styles.depositText}>▲ Nạp Tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawText}>▼ Rút Tiền</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionSection}>
            <Text style={styles.transactionTitle}>Lịch Sử Giao Dịch</Text>
            <View style={styles.transactionItem}>
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>$</Text>
              </View>
              <Icon name="arrow-up" size={20} color="#fff" style={styles.arrow} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>Nạp tiền vào ví</Text>
                <Text style={styles.transactionDate}>Oct 14, 10:24 AM</Text>
              </View>
              <Text style={styles.transactionAmount}>+1,000,000đ</Text>
            </View>
            <View style={styles.transactionItem}>
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>$</Text>
              </View>
              <Icon name="arrow-down" size={20} color="#fff" style={styles.arrow} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>Thanh toán học phí</Text>
                <Text style={styles.transactionDate}>Oct 12, 02:13 PM</Text>
              </View>
              <Text style={styles.transactionAmount}>-800,000đ</Text>
            </View>
            <View style={styles.transactionItem}>
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>$</Text>
              </View>
              <Icon name="arrow-down" size={20} color="#fff" style={styles.arrow} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>Thanh toán học phí</Text>
                <Text style={styles.transactionDate}>Oct 11, 01:19 AM</Text>
              </View>
              <Text style={styles.transactionAmount}>-200,000đ</Text>
            </View>
            <View style={styles.transactionItem}>
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>$</Text>
              </View>
              <Icon name="arrow-up" size={20} color="#fff" style={styles.arrow} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>Nạp tiền vào ví</Text>
                <Text style={styles.transactionDate}>Oct 07, 09:10 PM</Text>
              </View>
              <Text style={styles.transactionAmount}>+2,000,000đ</Text>
            </View>
            <View style={styles.transactionItem}>
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>$</Text>
              </View>
              <Icon name="arrow-down" size={20} color="#fff" style={styles.arrow} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>Thanh toán học phí</Text>
                <Text style={styles.transactionDate}>Oct 04, 05:45 AM</Text>
              </View>
              <Text style={styles.transactionAmount}>-1,000,000đ</Text>
            </View>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  depositText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  withdrawButton: {
    backgroundColor: "#31B7EC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  withdrawText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionSection: {},
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    backgroundColor: "#00C853",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  iconText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  arrow: {
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
    flexDirection: "column",
  },
  transactionDescription: {
    fontSize: 14,
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
  },
  transactionAmount: {
    fontWeight: "bold",
    minWidth: 80,
    textAlign: "right",
  },
});

export default WalletScreen;