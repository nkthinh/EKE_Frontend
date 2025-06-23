import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoCallScreen = ({ route }) => {
    const { roomName } = route.params;
    const jitsiURL = `https://meet.jit.si/${roomName}`;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: jitsiURL }}
                style={{ flex: 1 }}
                javaScriptEnabled
                allowsFullscreenVideo
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default VideoCallScreen;
