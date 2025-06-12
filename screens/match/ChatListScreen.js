import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenu from '../components/BottomMenu';

const students = [
    {
        name: 'Hải Tú',
        avatar: require('../../assets/avatar.png'),
        lastMessage: 'Em muốn đăng ký ạ.',
        time: '9:40 AM',
        online: true,
    },
    {
        name: 'Thùy Chi (Pu)',
        avatar: require('../../assets/avatar.png'),
        lastMessage: 'Tý có dạy giờ hêm.',
        time: '10:37 PM',
        online: false,
    },
    {
        name: 'Huệ Phương (Cara)',
        avatar: require('../../assets/avatar.png'),
        lastMessage: 'Hello ạ.',
        time: '10:40 PM',
        online: false,
    },
];

const ChatListScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Học Viên Của Tôi</Text>
                    <TouchableOpacity>
                        <Icon name="bell-outline" size={28} color="#00AEEF" />
                    </TouchableOpacity>
                </View>

                <TextInput style={styles.search} placeholder="Tìm kiếm học viên..." />

                <Text style={styles.subHeading}>Học Viên Được Kết Nối:</Text>
                <FlatList
                    horizontal
                    data={students}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.avatarWrapper}
                            onPress={() => navigation.navigate('ChatDetailScreen', { name: item.name })}
                        >
                            <Image source={item.avatar} style={styles.avatar} />
                            <Text style={styles.avatarName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                    showsHorizontalScrollIndicator={false}
                />

                {/* ✅ Giảm khoảng cách với phần Tin Nhắn */}
                <View style={{ height: 20 }} />

                <Text style={styles.subHeading}>Tin Nhắn:</Text>
                {students.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.messageItem}
                        onPress={() => navigation.navigate('ChatDetailScreen', { name: item.name })}
                    >
                        <Image source={item.avatar} style={styles.avatarSmall} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.lastMessage}>You: {item.lastMessage}</Text>
                        </View>
                        <Text style={styles.time}>{item.time}</Text>
                        {item.online && <View style={styles.dot} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>


            <BottomMenu navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scroll: {
        paddingTop: 60,
        paddingBottom: 100
    },
    header: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#00AEEF'
    },
    search: {
        backgroundColor: '#f2f2f2',
        marginHorizontal: 20,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    subHeading: {
        fontSize: 20,
        fontWeight: '600',
        marginHorizontal: 20,
        marginBottom: 10,
        color: '#333',
    },
    avatarWrapper: {
        alignItems: 'center',
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 6,
    },
    avatarName: {
        fontSize: 14,
        width: 80,
        textAlign: 'center',
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    avatarSmall: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    lastMessage: {
        fontSize: 15,
        color: '#666',
        marginTop: 4
    },
    time: {
        fontSize: 13,
        color: '#888',
        marginLeft: 6
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1BC100',
        marginLeft: 8,
    },
});

export default ChatListScreen;
