
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';

const VideoCallScreen = () => {
    const meetLink = 'https://meet.google.com/svk-ubxs-itf';

    useEffect(() => {
        const openMeet = async () => {
            const supported = await Linking.canOpenURL(meetLink);
            if (supported) {
                await Linking.openURL(meetLink);
            } else {
                Alert.alert('Không thể mở cuộc gọi', 'Thiết bị không hỗ trợ mở Google Meet.');
            }
        };

        openMeet();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>🔗 Đang mở phòng họp Google Meet...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: '#444'
    }
});

export default VideoCallScreen;
