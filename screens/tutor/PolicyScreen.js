import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

const PolicyScreen = ({ navigation }) => {
    const [accepted, setAccepted] = useState(false);

    const handleComplete = () => {
        if (accepted) {
            navigation.navigate('TutorProfileStep1');
        } else {
            alert('Vui lòng chấp nhận chính sách trước khi tiếp tục.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>
                CHÍNH SÁCH & QUY ĐỊNH DÀNH CHO GIA SƯ
            </Text>

            <Text style={styles.item}>1. <Text style={styles.bold}>Điều Kiện:</Text> Trên 18 tuổi, cung cấp giấy tờ tùy thân và bằng cấp hợp lệ.</Text>
            <Text style={styles.item}>2. <Text style={styles.bold}>Xác Minh:</Text> Hồ sơ phải được duyệt trước khi hiển thị.</Text>
            <Text style={styles.item}>3. <Text style={styles.bold}>Kết Nối:</Text> Match 2 chiều với học viên để mở trò chuyện.</Text>
            <Text style={styles.item}>4. <Text style={styles.bold}>Ứng Xử:</Text> Lịch sự, đúng giờ, không quảng cáo/dịch vụ ngoài.</Text>
            <Text style={styles.item}>5. <Text style={styles.bold}>Phí và Thu Nhập:</Text> Có thể dùng gói miễn phí hoặc trả phí, tự chịu trách nhiệm thuế.</Text>
            <Text style={styles.item}>6. <Text style={styles.bold}>Xử Lý Vi Phạm:</Text> Vi phạm bị khóa tài khoản, tùy mức độ.</Text>
            <Text style={styles.item}>7. <Text style={styles.bold}>Bảo Mật:</Text> Tự bảo vệ thông tin, liên hệ hỗ trợ khi cần.</Text>

            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAccepted(!accepted)}>
                <View style={[styles.fakeCheckbox, accepted && styles.checkedBox]}>
                    {accepted && <Text style={styles.checkMark}>✔</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Tôi đã đọc kỹ các chính sách và quy định trên</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: accepted ? '#31B7EC' : '#ccc' }]}
                onPress={handleComplete}
                disabled={!accepted}
            >
                <Text style={styles.buttonText}>Hoàn Thiện Hồ Sơ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 30,
        textTransform: 'uppercase',
    },
    bold: {
        fontWeight: 'bold',
        color: '#000',
    },
    item: {
        fontSize: 25,
        marginBottom: 12,
        color: '#000',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    fakeCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 1.5,
        borderColor: '#555',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#31B7EC',
    },
    checkMark: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 17,
        color: '#333',
        flex: 1,
        flexWrap: 'wrap',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PolicyScreen;
