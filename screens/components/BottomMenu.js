import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomMenu = ({ navigation }) => {
    return (
        <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TutorHome')}>
                <Icon name="home" size={36} color="#fff" />
                <Text style={styles.label}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChatListScreen')}>
                <Icon name="chat" size={36} color="#fff" />
                <Text style={styles.label}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('RateScreen')}>
                <Icon name="medal" size={36} color="#fff" />
                <Text style={styles.label}>Đánh giá</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProfileScreen')}>
                <Icon name="account-circle" size={36} color="#fff" />
                <Text style={styles.label}>Tài khoản</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        bottom: 0,
        height: 90,
        backgroundColor: '#31B7EC',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        paddingHorizontal: 10,
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 15,
        color: '#fff',
        marginTop: 4,
        fontWeight: '500',
    },
});

export default BottomMenu;
