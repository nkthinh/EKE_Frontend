import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '../components/BottomMenu';

const NotificationScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNoti = async () => {
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
        fetchNoti();
    }, []);

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

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>🔔 Thông Báo</Text>

                {Object.keys(grouped).length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
                        Không có thông báo nào.
                    </Text>
                )}

                {Object.keys(grouped).map((section) => (
                    <View key={section}>
                        <Text style={styles.section}>{section}</Text>
                        {grouped[section].map((n, index) => (
                            <View key={index} style={styles.card}>
                                <View style={[styles.iconWrapper, { backgroundColor: n.color || '#2196F3' }]}>
                                    <Icon name={n.icon || 'bell'} size={30} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{n.title}</Text>
                                    {n.student && (
                                        <Text style={styles.studentName}>👤 Học viên: {n.student}</Text>
                                    )}
                                    <Text style={styles.time}>{n.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

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
    }

});

export default NotificationScreen;