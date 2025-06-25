import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenuAdmin from '../components/BottomMenuAdmin';

const defaultPrices = {
    Silver: '50000',
    Gold: '90000',
    Diamond: '130000',
};

const AdminPackageScreen = ({ navigation }) => {
    const [prices, setPrices] = useState(defaultPrices);

    useEffect(() => {
        const loadPrices = async () => {
            try {
                const stored = await AsyncStorage.getItem('packagePrices');
                if (stored) setPrices(JSON.parse(stored));
            } catch (e) {
                console.warn('Không thể tải giá gói:', e);
            }
        };
        loadPrices();
    }, []);

    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('packagePrices', JSON.stringify(prices));
            Alert.alert('✅ Thành công', 'Giá gói đã được cập nhật.');
        } catch (e) {
            Alert.alert('❌ Lỗi', 'Không thể lưu giá gói.');
        }
    };

    const updatePrice = (key, value) => {
        const cleaned = value.replace(/\D/g, '');
        setPrices(prev => ({ ...prev, [key]: cleaned }));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>🎯 Cập Nhật Giá Gói Gia Sư</Text>

            {Object.keys(prices).map(key => (
                <View key={key} style={styles.card}>
                    <Text style={styles.label}>{key} Plan</Text>
                    <TextInput
                        style={styles.input}
                        value={prices[key]}
                        keyboardType="numeric"
                        onChangeText={(text) => updatePrice(key, text)}
                    />
                    <Text style={styles.unit}>VNĐ / tháng</Text>
                </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Icon name="content-save" size={24} color="#fff" />
                <Text style={styles.buttonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
            <BottomMenuAdmin navigation={navigation} />
        </ScrollView>

    );

};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingHorizontal: 20,
        paddingBottom: 120,
        backgroundColor: '#F4F9FF',
        flexGrow: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#007bff',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        backgroundColor: '#fdfdfd',
    },
    unit: {
        marginTop: 6,
        fontSize: 14,
        color: '#666',
    },
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default AdminPackageScreen;
