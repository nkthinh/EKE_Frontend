import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatDetailScreen = ({ route, navigation }) => {
    const { name } = route.params;

    const [messages, setMessages] = useState([
        { from: 'other', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' },
        { from: 'me', text: 'Chào bạn! Tôi muốn tìm gia sư toán.' },
        { from: 'other', text: 'Tuyệt vời! Bạn cần gia sư cho cấp độ nào?' },
        { from: 'me', text: 'Tôi cần gia sư cho lớp 10.' },
    ]);

    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { from: 'me', text: input }]);
            setInput('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerName}>{name}</Text>
                    <TouchableOpacity>
                        <Icon name="phone" size={26} color="#2196F3" />
                    </TouchableOpacity>
                </View>

                {/* Chat content */}
                <ScrollView contentContainerStyle={styles.chatContainer} showsVerticalScrollIndicator={false}>
                    {messages.map((msg, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.messageBox,
                                msg.from === 'me' ? styles.me : styles.other
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    msg.from === 'me' ? styles.textMe : styles.textOther
                                ]}
                            >
                                {msg.text}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Input */}
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Nhập tin nhắn..."
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Text style={styles.sendText}>Gửi</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#eee',
        zIndex: 10,
    },
    backButton: {
        padding: 4,
    },
    headerName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    chatContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 100,
    },
    messageBox: {
        maxWidth: '75%',
        padding: 14,
        borderRadius: 20,
        marginBottom: 12,
    },
    me: {
        backgroundColor: '#2196F3',
        alignSelf: 'flex-end',
    },
    other: {
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    textMe: {
        color: '#fff',
    },
    textOther: {
        color: '#000',
    },
    inputRow: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fafafa',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    sendBtn: {
        marginLeft: 10,
        backgroundColor: '#2196F3',
        borderRadius: 25,
        justifyContent: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    sendText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChatDetailScreen;
