import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const tabs = [
    { name: 'AdminHome', icon: 'home', label: 'Trang chủ' },
    { name: 'AdminPackageScreen', icon: 'package-variant', label: 'Gói ĐK' },
    { name: 'AdminNotificationScreen', icon: 'bell-ring', label: 'Thông báo' },
    { name: 'AdminProfile', icon: 'account-circle', label: 'Tài khoản' },
];

const BottomMenuAdmin = ({ navigation }) => {
    const state = navigation.getState();
    const currentRoute = state.routes[state.index]?.name;

    return (
        <View style={styles.menu}>
            {tabs.map((tab, index) => {
                const isFocused = currentRoute === tab.name;

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(tab.name)}
                        style={styles.menuItem}
                    >
                        <View style={isFocused ? styles.activeCircle : null}>
                            <Icon
                                name={tab.icon}
                                size={32}
                                color={isFocused ? '#31B7EC' : '#fff'}
                            />
                        </View>
                        <Text style={[styles.label, isFocused && styles.activeLabel]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: '#31B7EC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        paddingBottom: 10,
        paddingTop: 10,
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeCircle: {
        backgroundColor: '#fff',
        width: 55,
        height: 55,
        borderRadius: 27.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 15,
        color: '#fff',
        marginTop: 4,
        fontWeight: '500',
    },
    activeLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default BottomMenuAdmin;
