import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenuAdmin from '../components/BottomMenuAdmin';

const notifications = [
    {
        title: 'Tài khoản mới được tạo',
        time: 'Hôm nay - 09:30 AM',
        icon: 'account-plus',
        color: '#4CAF50',
        section: 'Hôm nay',
    },
    {
        title: 'Cập nhật gói thành công',
        time: 'Hôm nay - 08:00 AM',
        icon: 'check-decagram',
        color: '#03A9F4',
        section: 'Hôm nay',
    },
    {
        title: 'Gia sư Huỳnh T đăng ký gói Diamond',
        time: 'Hôm qua - 06:45 PM',
        icon: 'account-star',
        color: '#FFD54F',
        section: 'Hôm qua',
    },
    {
        title: 'Doanh thu đạt 2.5 triệu',
        time: 'Hôm qua - 03:30 PM',
        icon: 'cash-multiple',
        color: '#FF7043',
        section: 'Hôm qua',
    },
];

const AdminNotificationScreen = ({ navigation }) => {
    const grouped = notifications.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🔔 Thông Báo</Text>
                <View style={{ width: 28 }} /> {/* Placeholder to balance layout */}
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.content}>
                {Object.keys(grouped).map((section, index) => (
                    <View key={index}>
                        <Text style={styles.section}>{section}</Text>
                        {grouped[section].map((n, i) => (
                            <View key={i} style={styles.card}>
                                <View style={[styles.iconWrapper, { backgroundColor: n.color }]}>
                                    <Icon name={n.icon} size={24} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{n.title}</Text>
                                    <Text style={styles.time}>{n.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* Admin Bottom Menu */}
            <BottomMenuAdmin navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    section: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginVertical: 14,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
    },
    iconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    time: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
});

export default AdminNotificationScreen;
