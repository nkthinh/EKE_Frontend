import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomMenu from '../components/BottomMenu';

const UpgradeScreen = ({ navigation }) => {
    const [selected, setSelected] = useState('Silver');

    return (
        <View style={styles.wrapper}>
            {/* Nút quay lại */}
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} style={styles.backButton}>
                <Icon name="arrow-left" size={30} color="#000" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Nâng Cấp Tài Khoản Platinum</Text>
                <Text style={styles.subTitle}>Dành cho tài khoản Gia Sư</Text>

                {[
                    { name: 'Silver', price: '50.000 đ' },
                    { name: 'Gold', price: '90.000 đ' },
                    { name: 'Diamond', price: '130.000 đ' },
                ].map((item) => (
                    <TouchableOpacity
                        key={item.name}
                        style={[
                            styles.option,
                            selected === item.name && styles.optionSelected,
                        ]}
                        onPress={() => setSelected(item.name)}
                    >
                        <View>
                            <Text style={styles.optionTitle}>{item.name}</Text>
                            <Text style={styles.optionDesc}>Thanh toán hàng tháng</Text>
                        </View>
                        <Text style={styles.price}>{item.price}</Text>
                        <Icon
                            name={
                                selected === item.name
                                    ? 'check-circle'
                                    : 'check-circle-outline'
                            }
                            size={30}
                            color={selected === item.name ? '#3C90EF' : '#ccc'}
                        />
                    </TouchableOpacity>
                ))}

                <Text style={styles.featureHeader}>Các Tính Năng Mới</Text>

                {[
                    'Tăng Giới Hạn Danh Sách Học Viên Có Thể Kết Nối',
                    'Sử Dụng Trợ Lý Học Tập AI',
                    'Không Hiển Thị Quảng Cáo',
                ].map((text, i) => (
                    <View key={i} style={styles.feature}>
                        <Text style={styles.featureText}>{text}</Text>
                        <Icon name="check-circle" size={24} color="green" />
                    </View>
                ))}

                <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.registerText}>Đăng Ký</Text>
                </TouchableOpacity>
            </ScrollView>


        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 24,
        paddingBottom: 100,
        paddingTop: 100,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    subTitle: {
        textAlign: 'center',
        color: '#888',
        fontSize: 18,
        marginBottom: 24,
    },
    option: {
        backgroundColor: '#e7f3ff',
        borderRadius: 14,
        padding: 20,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
    },
    optionSelected: {
        backgroundColor: '#cde8ff',
        borderWidth: 1.5,
        borderColor: '#3C90EF',
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    optionDesc: {
        fontSize: 16,
        color: '#555',
        marginTop: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 12,
    },
    featureHeader: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 30,
        marginBottom: 14,
    },
    feature: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f5faff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    featureText: {
        fontSize: 18,
        color: '#333',
        flex: 1,
        paddingRight: 10,
    },
    registerButton: {
        backgroundColor: '#31B7EC',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
    },
    registerText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default UpgradeScreen;
