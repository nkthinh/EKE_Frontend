import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const slides = [
    {
        key: '1',
        title: 'NỀN TẢNG GIÁO DỤC BẰNG CÔNG NGHỆ',
        topImage: require('../../assets/logo1.png'),
        bottomImage: require('../../assets/book.png'),
    },
    {
        key: '2',
        title: '🚀 Tìm Gia Sư – Học Dễ Dàng  Tiến Bộ Nhanh!',
        image: require('../../assets/teacher.png'),
        description:
            'Ứng dụng giúp học viên tìm kiếm gia sư phù hợp nhanh chóng, kết nối trực tiếp với giáo viên giỏi, hỗ trợ học tập mọi lúc, mọi nơi. Dễ dàng đặt lịch và theo dõi tiến trình học tập hiệu quả.',
    },
    {
        key: '3',
        title: '🚀 Kết Nối Gia Sư Thông Minh Với AI Tích Hợp!',
        image: require('../../assets/ai.png'),
        description:
            'Ứng dụng tiên phong trong việc kết nối học viên với gia sư thông qua AI thông minh, giúp bạn tìm kiếm gia sư phù hợp nhanh chóng, chính xác, dựa trên trình độ, nhu cầu và lịch học cá nhân.',
    },
    {
        key: '4',
        title: 'NỀN TẢNG GIÁO DỤC BẰNG CÔNG NGHỆ',
        topImage: require('../../assets/logo1.png'),
        image: require('../../assets/role.png'),
        isFinal: true,
    },
];

const OnboardingScreen = ({ navigation }) => {
    const [index, setIndex] = useState(0);
    const slide = slides[index];

    const nextSlide = () => {
        if (index < slides.length - 1) {
            setIndex(index + 1);
        }
    };

    const goToRoleScreen = (role) => {
        if (role === 'Gia sư') {
            navigation.navigate('TutorRegister');
        } else {
            // Chuyển sang màn hình khác nếu cần
            alert('Bạn chọn Phụ huynh / Học viên');
        }
    };

    return (
        <View style={styles.container}>
            {slide.isFinal ? (
                <>
                    <Image source={slide.topImage} style={styles.finalLogo} />
                    <Text style={styles.finalTitle}>{slide.title}</Text>
                    <Image source={slide.image} style={styles.finalImage} />

                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={styles.roleButton}
                            onPress={() => goToRoleScreen('Gia sư')}
                        >
                            <Text style={styles.roleText}>👨‍🏫 Gia Sư</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.roleButton}
                            onPress={() => goToRoleScreen('Phụ huynh / Học viên')}
                        >
                            <Text style={styles.roleText}>🧒 Phụ Huynh / Học Viên</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : slide.key === '1' ? (
                <>
                    <Image source={slide.topImage} style={styles.topImage} />
                    <Text style={styles.title}>{slide.title}</Text>
                    <Image source={slide.bottomImage} style={styles.bottomImage} />
                </>
            ) : (
                <>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.desc}>{slide.description}</Text>
                    <Image source={slide.image} style={styles.image} />
                </>
            )}

            {!slide.isFinal && (
                <TouchableOpacity style={styles.button} onPress={nextSlide}>
                    <Text style={styles.buttonText}>
                        {index === slides.length - 2 ? 'Bắt đầu' : 'Tiếp tục'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    topImage: {
        width: width * 0.75,
        height: 170,
        resizeMode: 'contain',
        marginTop: 40,
        marginBottom: 2,
    },
    bottomImage: {
        width: width * 0.95,
        height: 300,
        resizeMode: 'contain',
        marginTop: 0,
    },
    image: {
        width: width * 0.95,
        height: 400,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    finalLogo: {
        width: width * 0.3,
        height: 150,
        resizeMode: 'contain',
        marginTop: 40,
        marginBottom: 0,
    },
    finalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 16,
    },
    finalImage: {
        width: width * 0.9,
        height: 260,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 12,
        color: '#000',
    },
    desc: {
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'left',
        paddingHorizontal: 24,
        color: '#333',
        marginBottom: 10,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#31B7EC',
        paddingVertical: 16,
        paddingHorizontal: 50,
        borderRadius: 30,
        marginBottom: 40,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    roleContainer: {
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
    },
    roleButton: {
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
    roleText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#31B7EC',
    },
});

export default OnboardingScreen;
