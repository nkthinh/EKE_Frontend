import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Alert,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { authService } from '../../services';

const { width } = Dimensions.get('window');

const StudentRegisterScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        schoolName: '',
        gradeLevel: '',
        learningGoals: '',
        budgetMin: '',
        budgetMax: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
        setErrors((prev) => ({ ...prev, [key]: null }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.fullName.trim()) newErrors.fullName = 'Họ tên là bắt buộc';
        if (!form.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (form.phone && !/^\d{9,11}$/.test(form.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }
        if (!form.password.trim()) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (form.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (form.budgetMin && (isNaN(form.budgetMin) || form.budgetMin < 0)) {
            newErrors.budgetMin = 'Ngân sách tối thiểu không hợp lệ';
        }
        if (form.budgetMax && (isNaN(form.budgetMax) || form.budgetMax < 0)) {
            newErrors.budgetMax = 'Ngân sách tối đa không hợp lệ';
        }
        if (form.budgetMin && form.budgetMax && parseFloat(form.budgetMin) > parseFloat(form.budgetMax)) {
            newErrors.budgetMax = 'Ngân sách tối đa phải lớn hơn ngân sách tối thiểu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const studentData = {
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                phone: form.phone || null,
                dateOfBirth: "2025-07-27T13:18:29.486Z",
                schoolName: form.schoolName || null,
                gradeLevel: form.gradeLevel || null,
                learningGoals: form.learningGoals || null,
                budgetMin: form.budgetMin ? parseFloat(form.budgetMin) : 0,
                budgetMax: form.budgetMax ? parseFloat(form.budgetMax) : 0,
            };

            await authService.registerStudent(studentData);
            navigation.navigate('StudentLogin');
        } catch (error) {
            console.error('Register error:', error);
            Alert.alert('Lỗi đăng ký', error.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/logo1.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Đăng Ký Học Viên</Text>
                <Text style={styles.subtitle}>Tạo tài khoản học viên của bạn</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Họ và Tên *</Text>
                <TextInput
                    style={[styles.input, errors.fullName && styles.errorInput]}
                    value={form.fullName}
                    onChangeText={(text) => handleChange('fullName', text)}
                    placeholder="Nhập họ và tên"
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={[styles.input, errors.email && styles.errorInput]}
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                    placeholder="example@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={[styles.input, errors.phone && styles.errorInput]}
                    value={form.phone}
                    onChangeText={(text) => handleChange('phone', text)}
                    placeholder="0123456789"
                    keyboardType="phone-pad"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                <Text style={styles.label}>Ngày sinh</Text>
                <TextInput
                    style={[styles.input, errors.dateOfBirth && styles.errorInput]}
                    value={form.dateOfBirth}
                    onChangeText={(text) => handleChange('dateOfBirth', text)}
                    placeholder="DD/MM/YYYY"
                />
                {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

                <Text style={styles.label}>Tên trường</Text>
                <TextInput
                    style={[styles.input, errors.schoolName && styles.errorInput]}
                    value={form.schoolName}
                    onChangeText={(text) => handleChange('schoolName', text)}
                    placeholder="Nhập tên trường"
                />
                {errors.schoolName && <Text style={styles.errorText}>{errors.schoolName}</Text>}

                <Text style={styles.label}>Lớp học</Text>
                <View style={[styles.pickerWrapper, errors.gradeLevel && styles.errorInput]}>
                    <Picker
                        selectedValue={form.gradeLevel}
                        onValueChange={(value) => handleChange('gradeLevel', value)}
                    >
                        <Picker.Item label="Chọn lớp học" value="" />
                        <Picker.Item label="Lớp 1" value="1" />
                        <Picker.Item label="Lớp 2" value="2" />
                        <Picker.Item label="Lớp 3" value="3" />
                        <Picker.Item label="Lớp 4" value="4" />
                        <Picker.Item label="Lớp 5" value="5" />
                        <Picker.Item label="Lớp 6" value="6" />
                        <Picker.Item label="Lớp 7" value="7" />
                        <Picker.Item label="Lớp 8" value="8" />
                        <Picker.Item label="Lớp 9" value="9" />
                        <Picker.Item label="Lớp 10" value="10" />
                        <Picker.Item label="Lớp 11" value="11" />
                        <Picker.Item label="Lớp 12" value="12" />
                        <Picker.Item label="Đại học" value="University" />
                    </Picker>
                </View>
                {errors.gradeLevel && <Text style={styles.errorText}>{errors.gradeLevel}</Text>}

                <Text style={styles.label}>Mục tiêu học tập</Text>
                <TextInput
                    style={[styles.input, errors.learningGoals && styles.errorInput]}
                    value={form.learningGoals}
                    onChangeText={(text) => handleChange('learningGoals', text)}
                    placeholder="Mô tả mục tiêu học tập của bạn"
                    multiline
                    numberOfLines={3}
                />
                {errors.learningGoals && <Text style={styles.errorText}>{errors.learningGoals}</Text>}

                <Text style={styles.label}>Ngân sách tối thiểu (VNĐ/giờ)</Text>
                <TextInput
                    style={[styles.input, errors.budgetMin && styles.errorInput]}
                    value={form.budgetMin}
                    onChangeText={(text) => handleChange('budgetMin', text)}
                    placeholder="50000"
                    keyboardType="numeric"
                />
                {errors.budgetMin && <Text style={styles.errorText}>{errors.budgetMin}</Text>}

                <Text style={styles.label}>Ngân sách tối đa (VNĐ/giờ)</Text>
                <TextInput
                    style={[styles.input, errors.budgetMax && styles.errorInput]}
                    value={form.budgetMax}
                    onChangeText={(text) => handleChange('budgetMax', text)}
                    placeholder="200000"
                    keyboardType="numeric"
                />
                {errors.budgetMax && <Text style={styles.errorText}>{errors.budgetMax}</Text>}

                <Text style={styles.label}>Mật khẩu *</Text>
                <TextInput
                    style={[styles.input, errors.password && styles.errorInput]}
                    value={form.password}
                    onChangeText={(text) => handleChange('password', text)}
                    placeholder="Nhập mật khẩu"
                    secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <Text style={styles.label}>Xác nhận mật khẩu *</Text>
                <TextInput
                    style={[styles.input, errors.confirmPassword && styles.errorInput]}
                    value={form.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                    placeholder="Nhập lại mật khẩu"
                    secureTextEntry
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('StudentLogin')}
            >
                <Text style={styles.linkText}>
                    Đã có tài khoản? <Text style={styles.linkTextBold}>Đăng nhập</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
    },
    logo: {
        width: width * 0.3,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#31B7EC',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    errorInput: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 4,
    },
    registerButton: {
        backgroundColor: '#31B7EC',
        paddingVertical: 16,
        borderRadius: 25,
        margin: 20,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        alignItems: 'center',
        marginBottom: 30,
    },
    linkText: {
        fontSize: 16,
        color: '#666',
    },
    linkTextBold: {
        color: '#31B7EC',
        fontWeight: 'bold',
    },
});

export default StudentRegisterScreen;