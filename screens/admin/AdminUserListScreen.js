import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenuAdmin from '../components/BottomMenuAdmin';

const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
    { id: 6, name: 'User 6' },
];

const reasons = [
    'Vi phạm nội quy',
    'Hành vi không phù hợp',
    'Spam / lạm dụng hệ thống',
    'Tài khoản không xác thực',
];

const AdminStudentListScreen = ({ navigation }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');

    const handleDeletePress = (user) => {
        setSelectedUser(user);
        setSelectedReason('');
        setModalVisible(true);
    };

    const confirmBan = () => {
        if (!selectedReason) {
            Alert.alert('Chọn lý do', 'Vui lòng chọn lý do ban tài khoản');
            return;
        }

        Alert.alert(
            'Xác nhận',
            `Bạn có chắc muốn ban ${selectedUser.name} vì: "${selectedReason}"?`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    style: 'destructive',
                    onPress: () => {
                        console.log(`Banned: ${selectedUser.name} vì "${selectedReason}"`);
                        setModalVisible(false);
                        setSelectedUser(null);
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danh sách tài khoản phụ huynh/ học viên</Text>
                <View style={styles.counterCircle}>
                    <Text style={styles.counterText}>Tổng số Tài khoản: {users.length}</Text>
                </View>
            </View>

            <TextInput placeholder="Tìm Kiếm" style={styles.searchBox} />

            {/* List */}
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Icon name="account-circle" size={40} color="#00AEEF" style={{ marginRight: 12 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.desc}>Tài khoản phụ huynh/ học viên</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeletePress(item)}>
                            <Icon name="delete" size={28} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Modal chọn lý do */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Chọn lý do ban</Text>
                        {reasons.map((reason, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setSelectedReason(reason)}
                                style={[
                                    styles.reasonItem,
                                    selectedReason === reason && styles.reasonSelected,
                                ]}
                            >
                                <Text style={{ fontSize: 16 }}>{reason}</Text>
                                {selectedReason === reason && (
                                    <Icon name="check" size={20} color="green" />
                                )}
                            </TouchableOpacity>
                        ))}

                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmBan} style={styles.confirmBtn}>
                                <Text style={{ color: '#fff' }}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomMenuAdmin navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5faff'
    },
    header: {
        paddingTop: 80,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        color: '#333'
    },
    counterCircle: {
        alignSelf: 'center',
        backgroundColor: '#00AEEF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 30,
        marginTop: 12,
    },
    counterText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    searchBox: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    item: {
        backgroundColor: '#e0f7fa',
        marginHorizontal: 16,
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 16,
        color: '#555'
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 14,
        textAlign: 'center',
    },
    reasonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    reasonSelected: {
        backgroundColor: '#f1faff',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    cancelBtn: {
        padding: 10,
        marginRight: 12,
    },
    confirmBtn: {
        backgroundColor: '#31B7EC',
        padding: 10,
        borderRadius: 6,
    },
});

export default AdminStudentListScreen;
