import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenuAdmin from '../components/BottomMenuAdmin';
const AdminHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Xin chào,</Text>
                    <Text style={styles.adminText}>Admin</Text>
                </View>
                <TouchableOpacity style={styles.avatarWrapper}>
                    <View style={styles.avatarCircle}>
                        <Icon name="account" size={35} color="#00AEEF" />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Nội dung thống kê */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.cardRow}>
                    <View style={[styles.card, { backgroundColor: '#b3e5fc' }]}>
                        <Text style={styles.cardNumber}>70</Text>
                        <Text style={styles.cardLabel}>Tài khoản phụ huynh/học viên</Text>
                        <Icon name="account-group" size={24} color="#000" />
                        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('AdminUserListScreen')}
                        >
                            <Text style={styles.cardBtnText}>Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.card, { backgroundColor: '#c8e6c9' }]}>
                        <Text style={styles.cardNumber}>40</Text>
                        <Text style={styles.cardLabel}>Tài khoản gia sư</Text>
                        <Icon name="school-outline" size={24} color="#000" />
                        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('AdminTutorListScreen')}>
                            <Text style={styles.cardBtnText}>Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.cardRow}>
                    <View style={[styles.card, { backgroundColor: '#ffe082' }]}>
                        <Text style={styles.cardNumber}>150</Text>
                        <Text style={styles.cardLabel}>Số buổi học đã hoàn thành</Text>
                        <Icon name="calendar-check-outline" size={24} color="#000" />
                        <TouchableOpacity style={styles.cardButton}>
                            <Text style={styles.cardBtnText}>Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.card, { backgroundColor: '#ffab91' }]}>
                        <Text style={styles.cardNumber}>2,500,000</Text>
                        <Text style={styles.cardLabel}>Doanh thu</Text>
                        <Icon name="cash-multiple" size={24} color="#000" />
                        <TouchableOpacity style={styles.cardButton}>
                            <Text style={styles.cardBtnText}>Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <BottomMenuAdmin navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF6FF',
    },
    header: {
        backgroundColor: '#00AEEF',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
    },
    welcome: {
        fontSize: 25,
        color: '#fff',
    },
    adminText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
    },
    avatarWrapper: {
        alignItems: 'center',
    },
    avatarCircle: {
        marginTop: 8,
        backgroundColor: '#fff',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        padding: 20,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    cardLabel: {
        fontSize: 14,
        marginVertical: 4,
        color: '#333',
    },
    cardButton: {
        marginTop: 6,
        paddingVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    cardBtnText: {
        color: '#007bff',
        fontWeight: '600',
    },
});

export default AdminHomeScreen;
