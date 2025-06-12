import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenu from '../components/BottomMenu';

const notifications = [
    { title: 'Lịch Học Đã Được Cập Nhật', time: 'June 10 - 10:00 AM', icon: 'star', color: '#FF5E5E', section: 'Today' },
    { title: 'Đừng Quên Lịch Học Sáng Nay', time: 'June 10 - 8:00 AM', icon: 'lightbulb-on', color: '#A9E34B', section: 'Today' },
    { title: 'Đã Hoàn Thành Buổi Học', time: 'June 09 - 6:00 PM', icon: 'trophy', color: '#D8F561', section: 'Yesterday' },
    { title: 'Đừng Quên Lịch Học Tối Nay', time: 'June 09 - 3:00 PM', icon: 'clock-outline', color: '#FFA726', section: 'Yesterday' },
    { title: 'Bài Tập Đã Được Cập Nhật', time: 'June 09 - 11:00 AM', icon: 'file-document', color: '#448AFF', section: 'Yesterday' },
    { title: 'Lớp Học Mới Đã Bắt Đầu', time: 'May 29 - 9:00 AM', icon: 'star-circle', color: '#00C853', section: 'May 29 - 20XX' },
];

const NotificationScreen = ({ navigation }) => {
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

                {Object.keys(grouped).map((section) => (
                    <View key={section}>
                        <Text style={styles.section}>{section}</Text>
                        {grouped[section].map((n, index) => (
                            <View key={index} style={styles.card}>
                                <View style={[styles.iconWrapper, { backgroundColor: n.color }]}>
                                    <Icon name={n.icon} size={30} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{n.title}</Text>
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
});

export default NotificationScreen;
