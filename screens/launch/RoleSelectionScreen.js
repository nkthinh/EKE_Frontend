import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
    const handleSelectRole = (role) => {
        if (role === 'Gia sư') {
            navigation.navigate('TutorLogin');
        } else {
            navigation.navigate('StudentLogin');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logo1.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>NỀN TẢNG GIÁO DỤC BẰNG CÔNG NGHỆ</Text>
            <Image
                source={require('../../assets/role.png')}
                style={styles.roleImage}
            />
            <Text style={styles.roleQuestion}>Chọn loại tài khoản</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handleSelectRole('Gia sư')}
            >
                <Text style={styles.buttonText}>👨‍🏫 Gia Sư</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handleSelectRole('Phụ huynh / Học viên')}
            >
                <Text style={styles.buttonText}>🧒 Phụ Huynh / Học Viên</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    logo: {
        width: width * 0.4,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#000',
    },
    roleImage: {
        width: width * 0.8,
        height: 250,
        resizeMode: 'contain',
    },
    roleQuestion: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 16,
        color: '#422',
        marginBottom: 20,
    },
    button: {
        borderWidth: 1.8,
        borderColor: '#31B7EC',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 30,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        backgroundColor: '#fff',

    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#31B7EC',
    },
});

export default RoleSelectionScreen;
