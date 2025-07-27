import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '../components/BottomMenu';
import { notificationService } from '../../services';

const NotificationScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const apiNotifications = await notificationService.getAllNotifications();
            
            // Transform API data to match existing format
            const transformedNotifications = apiNotifications.map(notification => ({
                id: notification.id,
                title: notification.title,
                section: formatDate(notification.createdAt),
                time: formatTime(notification.createdAt),
                student: notification.relatedUser?.name,
                icon: getNotificationIcon(notification.type),
                color: getNotificationColor(notification.type),
                isRead: notification.isRead
            }));
            
            setNotifications(transformedNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            // Fallback to AsyncStorage if API fails
            await fetchNotificationsFromStorage();
        } finally {
            setLoading(false);
        }
    };

    const fetchNotificationsFromStorage = async () => {
        try {
            const data = await AsyncStorage.getItem('notifications');
            if (data) {
                const parsed = JSON.parse(data);
                setNotifications(parsed);
            }
        } catch (e) {
            console.warn('Lỗi đọc notifications:', e);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua';
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'BOOKING': return 'calendar-check';
            case 'MESSAGE': return 'message-text';
            case 'MATCH': return 'heart';
            case 'PAYMENT': return 'credit-card';
            default: return 'bell';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'BOOKING': return '#4CAF50';
            case 'MESSAGE': return '#2196F3';
            case 'MATCH': return '#E91E63';
            case 'PAYMENT': return '#FF9800';
            default: return '#2196F3';
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    const markAsRead = async (notificationId) => {
        try {
            await notificationService.markNotificationAsRead(notificationId);
            setNotifications(prev => prev.map(n => 
                n.id === notificationId ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const grouped = notifications.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <View style={styles.wrapper}>
            {/* Nút quay lại */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Icon name="arrow-left" size={32} color="#000" />
            </TouchableOpacity>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.loadingText}>Đang tải thông báo...</Text>
                </View>
            ) : (
                <ScrollView 
                    contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>🔔 Thông Báo</Text>
                        {notifications.some(n => !n.isRead) && (
                            <TouchableOpacity 
                                style={styles.markAllButton} 
                                onPress={markAllAsRead}
                            >
                                <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {Object.keys(grouped).length === 0 && (
                        <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
                            Không có thông báo nào.
                        </Text>
                    )}

                    {Object.keys(grouped).map((section) => (
                        <View key={section}>
                            <Text style={styles.section}>{section}</Text>
                            {grouped[section].map((n, index) => (
                                <TouchableOpacity 
                                    key={n.id || index} 
                                    style={[styles.card, !n.isRead && styles.unreadCard]}
                                    onPress={() => markAsRead(n.id)}
                                >
                                    <View style={[styles.iconWrapper, { backgroundColor: n.color || '#2196F3' }]}>
                                        <Icon name={n.icon || 'bell'} size={30} color="#fff" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.title, !n.isRead && styles.unreadTitle]}>
                                            {n.title}
                                        </Text>
                                        {n.student && (
                                            <Text style={styles.studentName}>👤 Học viên: {n.student}</Text>
                                        )}
                                        <Text style={styles.time}>{n.time}</Text>
                                    </View>
                                    {!n.isRead && <View style={styles.unreadDot} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}

            <BottomMenu navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 10,
        elevation: 4,
    },
    container: {
        paddingTop: 100,
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#666',
        marginVertical: 14,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 18,
        marginBottom: 16,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
    },
    time: {
        fontSize: 16,
        color: '#888',
        marginTop: 4,
    },
    studentName: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 200,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    markAllButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    markAllText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    unreadCard: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196F3',
        borderWidth: 1,
    },
    unreadTitle: {
        fontWeight: 'bold',
        color: '#1976D2',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2196F3',
        position: 'absolute',
        top: 10,
        right: 10,
    },

});

export default NotificationScreen;