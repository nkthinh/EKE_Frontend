import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Modal,
} from 'react-native';

const { width } = Dimensions.get('window');

const TutorSignupScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        password: '',
        confirmPassword: '',
    });

    const [modalVisible, setModalVisible] = useState(false);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleRegister = () => {
        // TODO: Bạn có thể thêm validate form ở đây nếu muốn
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('PolicyScreen'); // Điều hướng sang trang chính sách
        }, 2000); // 2 giây
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo1.png')} style={styles.logo} />
            <Text style={styles.title}>Đăng Ký</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Họ Và Tên</Text>
                <TextInput
                    placeholder="John Doe"
                    style={styles.input}
                    value={form.name}
                    onChangeText={(text) => handleChange('name', text)}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="example@example.com"
                    keyboardType="email-address"
                    style={styles.input}
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                />

                <Text style={styles.label}>Số Điện Thoại</Text>
                <TextInput
                    placeholder="+ 123 456 789"
                    keyboardType="phone-pad"
                    style={styles.input}
                    value={form.phone}
                    onChangeText={(text) => handleChange('phone', text)}
                />

                <Text style={styles.label}>Năm Sinh</Text>
                <TextInput
                    placeholder="DD / MM / YYYY"
                    style={styles.input}
                    value={form.dob}
                    onChangeText={(text) => handleChange('dob', text)}
                />

                <Text style={styles.label}>Mật Khẩu</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        value={form.password}
                        onChangeText={(text) => handleChange('password', text)}
                    />
                    <Text style={styles.eyeIcon}>👁</Text>
                </View>

                <Text style={styles.label}>Nhập Lại Mật Khẩu</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        value={form.confirmPassword}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                    />
                    <Text style={styles.eyeIcon}>👁</Text>
                </View>
            </View>

            <Text style={styles.policy}>
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <Text style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
                <Text style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text>.
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Đăng Ký</Text>
            </TouchableOpacity>

            <Text style={styles.loginHint}>
                Bạn đã có tài khoản? <Text style={{ textDecorationLine: 'underline' }}>Đăng Nhập ngay</Text>
            </Text>

            {/* Modal Đăng ký thành công */}
            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Đăng Ký Thành Công!</Text>
                        <Text style={styles.modalIcon}>👤</Text>
                        <Text style={styles.modalMessage}>Đã đăng ký tài khoản thành công!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffefb',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 50,
    },
    logo: {
        width: width * 0.35,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        color: '#007bff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
    },
    label: {
        marginBottom: 6,
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    passwordWrapper: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 12,
        fontSize: 16,
    },
    policy: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        marginVertical: 12,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: '#31B7EC',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginHint: {
        fontSize: 13,
        color: '#333',
        marginTop: 10,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '75%',
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 15,
        marginTop: 10,
        color: '#444',
        textAlign: 'center',
    },
    modalIcon: {
        fontSize: 40,
        color: '#31B7EC',
    },
});

export default TutorSignupScreen;
