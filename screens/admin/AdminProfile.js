import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Tooltip } from 'react-native-paper';
import BottomMenuAdmin from '../components/BottomMenuAdmin';
import avatarImage from '../../assets/avatar.png';

const AdminProfile = ({ navigation }) => {
    const [username, setUsername] = useState('Admin');
    const [password, setPassword] = useState('123456');
    const [phone, setPhone] = useState('+84987654321');
    const [city, setCity] = useState('Thành Phố Hồ Chí Minh');
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleLogout = () => {
        navigation.navigate('TutorRegister');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Nút quay lại */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={28} color="#000" />
                </TouchableOpacity>

                <Text style={styles.title}>Cập Nhật Hồ Sơ</Text>

                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                    <Image source={avatarImage} style={styles.avatar} />
                    <TouchableOpacity style={styles.editIcon}>
                        <Icon name="camera" size={20} color="#555" />
                    </TouchableOpacity>
                </View>

                {/* Form thông tin */}
                <View style={styles.form}>
                    <Text style={styles.label}>Tài khoản</Text>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} />

                    <Text style={styles.label}>Mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        keyboardType="phone-pad"
                        onChangeText={setPhone}
                    />

                    <Text style={styles.label}>Tỉnh/Thành Phố</Text>
                    <TextInput style={styles.input} value={city} onChangeText={setCity} />
                </View>


                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>


                <View style={styles.logoutWrapper}>
                    <Tooltip
                        visible={tooltipVisible}
                        onDismiss={() => setTooltipVisible(false)}
                        title="Đăng xuất khỏi tài khoản"
                        enterTouchDelay={300}
                        contentStyle={{ backgroundColor: '#333' }}
                    >
                        <TouchableOpacity
                            style={styles.logoutButtonCircle}
                            onPress={handleLogout}
                            onLongPress={() => setTooltipVisible(true)}
                        >
                            <Icon name="logout" size={24} color="#fff" />
                        </TouchableOpacity>
                    </Tooltip>
                </View>
            </ScrollView>

            <BottomMenuAdmin navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40
    },
    content: {
        padding: 24,
        paddingBottom: 120,
    },
    backButton: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    avatarWrapper: {
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
    },
    editIcon: {
        position: 'absolute',
        right: 110,
        bottom: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 4,
        elevation: 3,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        backgroundColor: '#31B7EC',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutWrapper: {
        alignItems: 'flex-end',
        paddingRight: 8,
        marginBottom: 32,
    },
    logoutButtonCircle: {
        backgroundColor: '#F44336',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default AdminProfile;
