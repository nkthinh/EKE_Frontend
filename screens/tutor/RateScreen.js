import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenu from '../components/BottomMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reviewService, tutorService } from '../../services';

const defaultRatings = Array(8).fill({
    name: 'User 123',
    avatar: require('../../assets/avatar.png'),
    time: '15 Mins Ago',
    comment: 'Xuất sắc! Gia sư tận tâm, giảng dạy dễ hiểu, giúp học viên tiến bộ nhanh chóng!',
    stars: 5,
});

const RateScreen = ({ navigation }) => {
    const [ratings, setRatings] = useState(defaultRatings);
    const [statistics, setStatistics] = useState({
        averageRating: 4.8,
        totalReviews: 234,
        ratingDistribution: { 5: 75, 4: 60, 3: 45, 2: 30, 1: 15 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
            
            if (user.id) {
                const [reviewsData, statsData] = await Promise.all([
                    reviewService.getReviewsByTutor(user.id),
                    tutorService.getTutorStatistics(user.id)
                ]);
                
                if (reviewsData && reviewsData.length > 0) {
                    const transformedReviews = reviewsData.map(review => ({
                        id: review.id,
                        name: review.studentName || 'Học viên',
                        avatar: review.studentAvatar ? { uri: review.studentAvatar } : require('../../assets/avatar.png'),
                        time: formatTime(review.createdAt),
                        comment: review.comment,
                        stars: review.rating,
                    }));
                    setRatings(transformedReviews);
                }
                
                if (statsData && statsData.reviews) {
                    setStatistics(statsData.reviews);
                }
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            // Keep default data if API fails
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    };

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#31B7EC" />
                <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
            </View>
        );
    }

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
                                    <View style={[styles.barFill, { 
                                        width: `${(statistics.ratingDistribution[i] / statistics.totalReviews) * 100 || i * 15}%` 
                                    }]} />
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.score}>{statistics.averageRating}</Text>
                        <View style={styles.stars}>
                            {Array(5).fill().map((_, i) => (
                                <Icon key={i} name="star" size={18} color="#FFB800" />
                            ))}
                        </View>
                        <Text style={styles.reviewCount}>{statistics.totalReviews} Reviews</Text>
                    </View>
                </View>
            </View>

            {/* Danh sách đánh giá */}
            <Text style={styles.sectionTitle}>Đánh Giá Từ Phụ Huynh/ Học Viên</Text>
            <FlatList
                data={ratings}
                keyExtractor={(item, i) => item.id?.toString() || i.toString()}
                renderItem={renderRating}
                contentContainerStyle={{ paddingBottom: 80 }}
                onRefresh={loadReviews}
                refreshing={loading}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
});

export default RateScreen;
