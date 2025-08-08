import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { certificationService } from '../../services';

const { width } = Dimensions.get('window');

const TutorProfileStep2 = ({ navigation, route }) => {
    const { step1Data } = route.params;
    const [certificate, setCertificate] = useState(null);
    const [form, setForm] = useState({
        title: 'Sinh viên',
        organization: '',
        major: '',
        teachingMethod: 'Online',
    });

    const [titleOpen, setTitleOpen] = useState(false);
    const [methodOpen, setMethodOpen] = useState(false);

    const [titleItems, setTitleItems] = useState([
        { label: 'Sinh viên', value: 'Sinh viên' },
        { label: 'Giáo viên', value: 'Giáo viên' },
        { label: 'Gia sư tự do', value: 'Gia sư tự do' },
    ]);

    const [methodItems, setMethodItems] = useState([
        { label: 'Online', value: 'Online' },
        { label: 'Học tại nhà', value: 'Học tại nhà' },
        { label: 'Online và Học tại nhà', value: 'Cả hai' },
    ]);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const pickCertificate = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Cần cấp quyền truy cập ảnh.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setCertificate(result.assets[0].uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Hồ Sơ Gia Sư</Text>

            <Text style={styles.label}>Chức danh</Text>
            <DropDownPicker
                open={titleOpen}
                setOpen={setTitleOpen}
                items={titleItems}
                value={form.title}
                setValue={(val) => handleChange('title', val())}
                containerStyle={styles.dropdownContainer}
            />

            <Text style={styles.label}>Đơn vị học tập/ Công tác</Text>
            <TextInput
                style={styles.input}
                value={form.organization}
                onChangeText={(t) => handleChange('organization', t)}
            />

            <Text style={styles.label}>Chuyên ngành</Text>
            <TextInput
                style={styles.input}
                value={form.major}
                onChangeText={(t) => handleChange('major', t)}
            />

            <Text style={styles.label}>Hình thức dạy</Text>
            <DropDownPicker
                open={methodOpen}
                setOpen={setMethodOpen}
                items={methodItems}
                value={form.teachingMethod}
                setValue={(val) => handleChange('teachingMethod', val())}
                containerStyle={styles.dropdownContainer}
            />

            <Text style={styles.label}>Chứng Chỉ</Text>
            <TouchableOpacity onPress={pickCertificate} style={styles.certificateWrapper}>
                {certificate ? (
                    <Image source={{ uri: certificate }} style={styles.certificate} />
                ) : (
                    <View style={styles.placeholder}><Text style={styles.placeholderText}>Ấn để tải ảnh</Text></View>
                )}
            </TouchableOpacity>

            <View style={styles.footerButtons}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#ccc' }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('TutorProfileStep3', { step1Data, step2Data: form })}
                >
                    <Text style={styles.buttonText}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: 20,
        marginTop: 100,
    },
    label: {
        fontSize: 18,
        marginBottom: 6,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 20,
        marginBottom: 16,
    },
    dropdownContainer: {
        marginBottom: 20,
        zIndex: Platform.OS === 'android' ? 1000 : undefined,
    },
    certificateWrapper: {
        alignItems: 'center',
        marginBottom: 30,
    },
    certificate: {
        width: width * 0.8,
        height: 200,
        resizeMode: 'contain',
    },
    placeholder: {
        width: width * 0.8,
        height: 200,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    placeholderText: {
        color: '#999',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
    },
    button: {
        backgroundColor: '#31B7EC',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        flex: 1,
        marginTop: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TutorProfileStep2;
