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
];

const OnboardingScreen = ({ navigation }) => {
    const [index, setIndex] = useState(0);
    const slide = slides[index];

    const nextSlide = () => {
        if (index < slides.length - 1) {
            setIndex(index + 1);
        } else {
            navigation.navigate('RoleSelection');
        }
    };

    return (
        <View style={styles.container}>
            {slide.topImage && (
                <Image source={slide.topImage} style={styles.topImage} />
            )}
            <Text style={styles.title}>{slide.title}</Text>
            {slide.description && (
                <Text style={styles.desc}>{slide.description}</Text>
            )}
            {slide.bottomImage && (
                <Image source={slide.bottomImage} style={styles.bottomImage} />
            )}
            {slide.image && (
                <Image source={slide.image} style={styles.image} />
            )}

            <TouchableOpacity style={styles.button} onPress={nextSlide}>
                <Text style={styles.buttonText}>
                    {index === slides.length - 1 ? 'Bắt đầu' : 'Tiếp tục'}
                </Text>
            </TouchableOpacity>
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
});

export default OnboardingScreen;
