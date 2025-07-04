import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Modal,
    Alert,
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

    const [errors, setErrors] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
        setErrors((prev) => ({ ...prev, [key]: null })); // clear error when editing
    };

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = 'Họ tên là bắt buộc';
        if (!form.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!form.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^\d{9,11}$/.test(form.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!form.dob.trim()) newErrors.dob = 'Ngày sinh là bắt buộc';
        if (!form.password.trim()) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (form.password.length < 6) {
            newErrors.password = 'Mật khẩu phải từ 6 ký tự';
        }

        if (!form.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        } else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = () => {
        if (!validate()) return;

        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('RoleSelection');
        }, 2000);
    };

    const renderInput = (label, key, placeholder, keyboardType = 'default', secure = false) => (
        <>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                style={[
                    styles.input,
                    errors[key] && { borderColor: 'red' },
                ]}
                keyboardType={keyboardType}
                secureTextEntry={secure}
                value={form[key]}
                onChangeText={(text) => handleChange(key, text)}
            />
            {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
        </>
    );

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo1.png')} style={styles.logo} />
            <Text style={styles.title}>Đăng Ký</Text>

            <View style={styles.inputContainer}>
                {renderInput('Họ Và Tên', 'name', 'Nguyễn Văn A')}
                {renderInput('Email', 'email', 'example@email.com', 'email-address')}
                {renderInput('Số Điện Thoại', 'phone', '0123456789', 'phone-pad')}
                {renderInput('Năm Sinh', 'dob', 'DD/MM/YYYY')}
                {renderInput('Mật Khẩu', 'password', 'Mật khẩu', 'default', true)}
                {renderInput('Nhập Lại Mật Khẩu', 'confirmPassword', 'Nhập lại mật khẩu', 'default', true)}
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
        marginBottom: 4,
    },
    error: {
        color: 'red',
        fontSize: 13,
        marginBottom: 8,
        paddingLeft: 10,
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
