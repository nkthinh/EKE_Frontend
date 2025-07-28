import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Alert,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { locationService } from '../../services';
const { width } = Dimensions.get('window');

const TutorProfileStep1 = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        gender: '',
        dob: '',
        email: '',
        phone: '',
        city: '',
        avatar: null,
    });

    const [errors, setErrors] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProvinces();
    }, []);

    const loadProvinces = async () => {
        try {
            const provincesData = await locationService.getProvinces();
            setProvinces(provincesData);
        } catch (error) {
            console.error('Error loading provinces:', error);
        }
    };

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
        setErrors({ ...errors, [key]: null });
    };

    const pickImage = async () => {
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

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
        if (!form.gender) newErrors.gender = 'Vui lòng chọn giới tính';
        if (!form.dob.trim()) newErrors.dob = 'Vui lòng nhập ngày sinh';
        if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email';
        if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!form.city.trim()) newErrors.city = 'Vui lòng nhập tỉnh/thành phố';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (validate()) {
            try {
                await AsyncStorage.setItem('tutorName', form.name);
                navigation.navigate('TutorProfileStep2', { step1Data: form });
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Hồ Sơ Gia Sư</Text>
            <Text style={styles.sub}>Hoàn thiện hồ sơ của bạn để tiếp tục trải nghiệm nền tảng.</Text>

            <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                <Image
                    source={form.avatar ? { uri: form.avatar } : require('../../assets/logo1.png')}
                    style={styles.avatar}
                />
                <Text style={styles.avatarHint}>Nhấn để chọn ảnh</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Họ và Tên</Text>
            <TextInput
                style={[styles.input, errors.name && styles.errorInput]}
                value={form.name}
                onChangeText={(t) => handleChange('name', t)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text style={styles.label}>Giới tính</Text>
            <View style={[styles.pickerWrapper, errors.gender && styles.errorInput]}>
                <Picker
                    selectedValue={form.gender}
                    onValueChange={(value) => handleChange('gender', value)}
                >
                    <Picker.Item label="Chọn giới tính" value="" />
                    <Picker.Item label="Nam" value="Nam" />
                    <Picker.Item label="Nữ" value="Nữ" />
                </Picker>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
                style={[styles.input, errors.dob && styles.errorInput]}
                placeholder="DD/MM/YYYY"
                value={form.dob}
                onChangeText={(t) => handleChange('dob', t)}
            />
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, errors.email && styles.errorInput]}
                value={form.email}
                onChangeText={(t) => handleChange('email', t)}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
                style={[styles.input, errors.phone && styles.errorInput]}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(t) => handleChange('phone', t)}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <Text style={styles.label}>Tỉnh/Thành Phố</Text>
            <View style={[styles.pickerWrapper, errors.city && styles.errorInput]}>
                <Picker
                    selectedValue={form.city}
                    onValueChange={(value) => handleChange('city', value)}
                >
                    <Picker.Item label="Chọn tỉnh/thành phố" value="" />
                    {provinces.map((province) => (
                        <Picker.Item 
                            key={province.id} 
                            label={province.name} 
                            value={province.name} 
                        />
                    ))}
                </Picker>
            </View>
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleNext}>
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
        fontSize: 16,
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
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 17,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 4,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginBottom: 4,
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
