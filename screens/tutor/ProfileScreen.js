import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenu from '../components/BottomMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

const AccountScreen = ({ navigation }) => {
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const fetchPlan = async () => {
            const json = await AsyncStorage.getItem('subscriptionPlan');
            if (json) setSubscription(JSON.parse(json));
        };
        fetchPlan();
    }, []);
    return (
        <View style={styles.container}>
            {/* PHẦN TRÊN: Vòng bo trắng */}
            <View style={styles.topContainer}>
                <Image source={require('../../assets/logo1.png')} style={styles.logo} />

                <Text style={styles.role}>
                    Gia Sư <Text style={styles.rating}>⭐ 4.8</Text>
                </Text>

                <View style={styles.avatarWrapper}>
                    <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
                    <View style={styles.avatarBorder} />
                    <View style={styles.idBadge}>
                        <Text style={styles.idText}>ID: 1234567</Text>
                    </View>
                </View>

                <Text style={styles.name}>Nguyễn Thị Thảo</Text>

                <View style={styles.actionRow}>
                    {[
                        { icon: 'logout', label: 'Đăng Xuất', onPress: () => navigation.replace('TutorRegister') },
                        { icon: 'pencil', label: 'Hồ Sơ', isProfile: true, onPress: () => navigation.navigate('TutorProfileView') },
                        { icon: 'wallet', label: 'Gói ĐK', onPress: () => navigation.replace('WalletScreen') }

                    ].map((btn, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.actionItem, btn.isProfile && { marginTop: 40 }]}
                            onPress={btn.onPress}
                        >
                            <View style={styles.circle}>
                                <Icon name={btn.icon} size={35} color="#7B7B7B" />
                                {btn.isProfile && <View style={styles.redDot} />}
                            </View>
                            <Text style={styles.actionLabel}>{btn.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* PHẦN DƯỚI: EKE Platinum */}
            <View style={styles.bottomArea}>
                <View style={styles.premiumCard}>
                    <Text style={styles.platinumTitle}>EKE Platinum</Text>
                    <Text style={styles.platinumDesc}>Nâng Cấp Tài Khoản Của Bạn</Text>

                    <View style={styles.dotWrapper}>
                        <View style={[styles.dot, { backgroundColor: '#000' }]} />
                        <View style={[styles.dot, { backgroundColor: '#000', opacity: 0.3 }]} />
                    </View>

                    <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('UpgradeScreen')}>
                        <Text style={styles.upgradeText}>ĐĂNG KÝ</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <BottomMenu navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F8'
    },

    // TOP
    topContainer: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 260,
        borderBottomRightRadius: 260,
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 45,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 40,
        width: '130%',
        marginLeft: -60,
        marginRight: -60,
    },
    logo: {
        width: 150,
        height: 120,
        resizeMode: 'contain',
        marginTop: -20
    },
    role: {
        fontSize: 20,
        color: '#00AEEF',
        marginTop: 4
    },
    rating: {
        color: '#FFC107'
    },

    avatarWrapper: {
        marginTop: 20,
        alignItems: 'center',
        position: 'relative'
    },
    avatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
    },
    avatarBorder: {
        position: 'absolute',
        top: -8,
        left: -8,
        width: 176,
        height: 176,
        borderRadius: 88,
        borderWidth: 5,
        borderColor: '#00AEEF',
    },
    idBadge: {
        position: 'absolute',
        bottom: -15,
        alignSelf: 'center',
        backgroundColor: '#256DFF',
        paddingHorizontal: 13,
        paddingVertical: 4,
        borderRadius: 16,
        zIndex: 2,
    },
    idText: {
        color: '#fff',
        fontSize: 20
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 30
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 20,
        paddingHorizontal: 30,
    },
    actionItem: {
        alignItems: 'center',
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    redDot: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF3B30',
    },
    actionLabel: {
        fontSize: 15,
        color: '#7B7B7B',
        marginTop: 6,
    },

    // BOTTOM
    bottomArea: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F2F4F8',
        paddingTop: 0,
    },
    premiumCard: {
        backgroundColor: '#F2F4F8',
        width: width - 40,
        borderRadius: 20,
        padding: 5,
        alignItems: 'center',
        marginTop: -25,
    },
    platinumTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000'
    },
    platinumDesc: {
        fontSize: 20,
        color: '#888',
        marginTop: 6
    },
    dotWrapper: {
        flexDirection: 'row',
        gap: 8,
        marginVertical: 12
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
    },
    upgradeButton: {
        backgroundColor: '#1E88E5',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 30,
    },
    upgradeText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default AccountScreen;
