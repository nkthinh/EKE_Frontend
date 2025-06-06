import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const TutorProfileStep1 = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        gender: 'Nam',
        dob: '',
        email: '',
        phone: '',
        city: 'Thành Phố Hồ Chí Minh',
        avatar: null,
    });

    const pickImage = async () => {
        // Yêu cầu quyền truy cập
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Bạn cần cấp quyền để chọn ảnh.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({ ...form, avatar: result.assets[0].uri });
        }
    };

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Hồ Sơ Gia Sư</Text>
            <Text style={styles.sub}>Hoàn thiện hồ sơ của bạn để có thể tiếp tục trải nghiệm nền tảng tốt nhất.</Text>

            <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                <Image
                    source={form.avatar ? { uri: form.avatar } : require('../../assets/logo1.png')}
                    style={styles.avatar}
                />
                <Text style={styles.avatarHint}>Nhấn để chọn ảnh</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Họ và Tên</Text>
            <TextInput style={styles.input} value={form.name} onChangeText={(t) => handleChange('name', t)} />

            <Text style={styles.label}>Giới tính</Text>
            <TextInput style={styles.input} value={form.gender} onChangeText={(t) => handleChange('gender', t)} />

            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={form.dob} onChangeText={(t) => handleChange('dob', t)} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={form.email} onChangeText={(t) => handleChange('email', t)} />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput style={styles.input} value={form.phone} onChangeText={(t) => handleChange('phone', t)} />

            <Text style={styles.label}>Tỉnh/Thành Phố</Text>
            <TextInput style={styles.input} value={form.city} onChangeText={(t) => handleChange('city', t)} />

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TutorProfileStep2')}>
                <Text style={styles.buttonText}>Tiếp Tục</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fffefb',
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#31B7EC',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 60,
    },
    sub: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    avatarWrapper: {
        alignSelf: 'center',
        marginBottom: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
    },
    avatarHint: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 17,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#31B7EC',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default TutorProfileStep1;
