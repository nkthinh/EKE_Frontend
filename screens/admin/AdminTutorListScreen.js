import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenuAdmin from '../components/BottomMenuAdmin';

const mockData = {
    approved: ['User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6'],
    pending: ['User A', 'User B', 'User C']
};

const reasons = [
    'Sai thông tin hồ sơ',
    'Vi phạm chính sách',
    'Tài khoản giả mạo',
    'Khác'
];

const AdminTutorListScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('approved');

    const handleDelete = (user) => {
        Alert.alert(
            'Xóa tài khoản',
            `Vì sao bạn muốn xóa ${user}?`,
            reasons.map(reason => ({
                text: reason,
                onPress: () => Alert.alert('Đã xóa', `${user} đã bị xóa vì: ${reason}`)
            })).concat({ text: 'Hủy', style: 'cancel' })
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Danh sách tài khoản gia sư</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>Tổng số Tài khoản: {mockData[activeTab].length}</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setActiveTab('approved')}>
                    <Text style={[styles.tab, activeTab === 'approved' && styles.activeTab]}>
                        Đã Xét Duyệt
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('pending')}>
                    <Text style={[styles.tab, activeTab === 'pending' && styles.activeTab]}>
                        Đang Chờ Xét Duyệt
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchBox}>
                <Icon name="magnify" size={22} color="#999" style={{ marginRight: 6 }} />
                <TextInput placeholder="Tìm Kiếm" style={{ flex: 1 }} />
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {mockData[activeTab].map((user, index) => (
                    <View key={index} style={styles.card}>
                        <Icon name="account" size={36} color="#00AEEF" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.username}>{user}</Text>
                            <Text style={styles.role}>Tài khoản gia sư</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(user)}>
                            <Icon name="trash-can-outline" size={28} color="#E53935" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Menu */}
            <BottomMenuAdmin navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5ffff' },
    header: {
        padding: 16,
        paddingTop: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    countBadge: {
        backgroundColor: '#00CFFF',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 6,
    },
    countText: { color: '#fff', fontWeight: '600' },

    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tab: {
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
    },
    activeTab: {
        color: '#00AEEF',
        borderBottomWidth: 2,
        borderColor: '#00AEEF',
        paddingBottom: 6,
    },

    searchBox: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        margin: 16,
        borderRadius: 24,
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        padding: 14,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
    },
    username: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    role: {
        fontSize: 14,
        color: '#666',
    },
});

export default AdminTutorListScreen;
