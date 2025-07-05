import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const TutorRegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo1.png')} style={styles.logo} />
            <Text style={styles.title}>Đăng Nhập</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="example@example.com"
                    style={styles.input}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Mật Khẩu</Text>
                <View style={styles.passwordInputContainer}>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon}>
                        <Text>👁</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    const emailTrimmed = email.trim().toLowerCase();
                    const passwordTrimmed = password.trim();

                    if (emailTrimmed === 'admin' && passwordTrimmed === '123456') {
                        navigation.navigate('AdminHome');
                    } else if (emailTrimmed === 'nhi' && passwordTrimmed === '123456') {
                        navigation.navigate('TutorHome');
                    } else if (emailTrimmed === 'thinh' && passwordTrimmed === '123456') {
                        navigation.navigate('StudentHomeScreen');
                    } else {
                        Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu');
                    }
                }}
            >
                <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('TutorSignup')}
            >
                <Text style={styles.buttonText}>Đăng Ký</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.forgotText}>Quên Mật Khẩu?</Text>
            </TouchableOpacity>

            <Text style={styles.socialText}>Hoặc Đăng Nhập Với ?</Text>

            <View style={styles.socialIcons}>
                <Icon name="instagram" size={30} color="#C13584" style={styles.icon} />
                <Icon name="facebook" size={30} color="#1877F2" style={styles.icon} />
                <Icon name="twitter" size={30} color="#1DA1F2" style={styles.icon} />
                <Icon name="whatsapp" size={30} color="#25D366" style={styles.icon} />
            </View>


            <Text style={styles.registerHint}>
                Bạn đã có tài khoản? Đăng Nhập ngay
            </Text>
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
        height: 170,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    title: {
        fontSize: 33,
        color: '#007bff',
        fontWeight: 'bold',
        marginBottom: 24,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontSize: 20,
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
        fontSize: 20,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 12,
    },
    button: {
        backgroundColor: '#31B7EC',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        marginVertical: 8,
        width: '60%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    forgotText: {
        marginTop: 12,
        fontSize: 20,
        color: '#666',
    },
    socialText: {
        marginTop: 32,
        fontSize: 20,
        color: '#999',
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 16,
        marginVertical: 12,
    },
    icon: {
        fontSize: 30,
        marginHorizontal: 8,
    },
    registerHint: {
        fontSize: 20,
        color: '#333',
        marginTop: 20,
    },
});

export default TutorRegisterScreen;
