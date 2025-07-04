import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenu from '../components/BottomMenu';

const ratings = Array(8).fill({
    name: 'User 123',
    avatar: require('../../assets/avatar.png'),
    time: '15 Mins Ago',
    comment: 'Xuất sắc! Gia sư tận tâm, giảng dạy dễ hiểu, giúp học viên tiến bộ nhanh chóng!',
    stars: 5,
});

const RateScreen = ({ navigation }) => {
    const renderRating = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                </View>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
            <View style={styles.stars}>
                {Array(item.stars).fill().map((_, i) => (
                    <Icon key={i} name="star" size={20} color="#FFB800" />
                ))}
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Tổng quan đánh giá */}
            <View style={styles.summary}>
                <Text style={styles.title}>Đánh giá từ Phụ huynh/ Học viên</Text>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map(i => (
                            <View style={styles.row} key={i}>
                                <Text>{i}</Text>
                                <View style={styles.barBackground}>
                                    <View style={[styles.barFill, { width: `${i * 15}%` }]} />
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.score}>4.8</Text>
                        <View style={styles.stars}>
                            {Array(5).fill().map((_, i) => (
                                <Icon key={i} name="star" size={18} color="#FFB800" />
                            ))}
                        </View>
                        <Text style={styles.reviewCount}>52 Reviews</Text>
                    </View>
                </View>
            </View>

            {/* Danh sách đánh giá */}
            <Text style={styles.sectionTitle}>Đánh Giá Từ Phụ Huynh/ Học Viên</Text>
            <FlatList
                data={ratings}
                keyExtractor={(_, i) => i.toString()}
                renderItem={renderRating}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            {/* Bottom Menu */}
            <BottomMenu navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    summary: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 12,
        marginTop: 50,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    barBackground: {
        height: 6,
        flex: 1,
        backgroundColor: '#eee',
        marginLeft: 8,
        borderRadius: 4,
    },
    barFill: {
        height: 6,
        backgroundColor: '#00796B',
        borderRadius: 4,
    },
    score: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    stars: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    reviewCount: {
        fontSize: 12,
        color: '#666',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    card: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    name: {
        fontWeight: '600',
        color: '#F44336',
        fontSize: 18,
    },
    time: {
        fontSize: 15,
        color: '#f88',
    },
    comment: {
        marginBottom: 6,
        fontSize: 17,
        lineHeight: 20,
        color: '#333',
    },
});

export default RateScreen;
