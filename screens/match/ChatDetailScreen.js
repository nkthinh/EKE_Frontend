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
    SafeAreaView,
    Alert,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatDetailScreen = ({ route, navigation }) => {
    const { name } = route.params;

    const [messages, setMessages] = useState([
        { id: 1, from: 'other', text: 'Xin chào! Tôi có thể giúc gì cho bạn?' },
        { id: 2, from: 'me', text: 'Chào bạn! Tôi muốn tìm gia sư toán.' },
        { id: 3, from: 'other', text: 'Tuyệt vời! Bạn cần gia sư cho cấp độ nào?' },
        { id: 4, from: 'me', text: 'Tôi cần gia sư cho lớp 10.' },
    ]);

    const [input, setInput] = useState('');
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleTitle, setScheduleTitle] = useState('');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);

    const handleSend = () => {
        if (input.trim()) {
            const newMsg = {
                id: Date.now(),
                from: 'me',
                text: input
            };
            setMessages([...messages, newMsg]);
            setInput('');
        }
    };

    const startVideoCall = () => {
        const roomName = name.replace(/\s+/g, '') + '_room';
        navigation.navigate('VideoCall', { roomName });
    };

    const handleSchedulePress = () => {
        setEditingMessageId(null);
        setScheduleTitle('');
        setScheduleDate('');
        setScheduleTime('');
        setShowScheduleModal(true);
    };

    const confirmSchedule = () => {
        if (!scheduleTitle.trim() || !scheduleDate.trim() || !scheduleTime.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề, ngày và thời gian.');
            return;
        }

        const formatted = `${scheduleDate} lúc ${scheduleTime}`;

        const newMessage = {
            id: editingMessageId || Date.now(),
            from: 'me',
            text: `📅 [${scheduleTitle}] vào ${formatted}`,
            type: 'schedule',
        };

        setMessages(prev => {
            if (editingMessageId) {
                return prev.map(msg => msg.id === editingMessageId ? newMessage : msg);
            } else {
                return [...prev, newMessage];
            }
        });

        setEditingMessageId(null);
        setScheduleTitle('');
        setScheduleDate('');
        setScheduleTime('');
        setShowScheduleModal(false);
    };

    const showScheduleOptions = (id) => {
        Alert.alert('Lịch hẹn', 'Bạn muốn thực hiện gì?', [
            { text: '✏️ Chỉnh sửa', onPress: () => editSchedule(id) },
            { text: '❌ Huỷ lịch', onPress: () => deleteSchedule(id), style: 'destructive' },
            { text: 'Hủy', style: 'cancel' }
        ]);
    };

    const deleteSchedule = (id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    const editSchedule = (id) => {
        const msg = messages.find(m => m.id === id);
        if (msg) {
            const match = msg.text.match(/\[(.*)\] vào (.*) lúc (.*)/);
            if (match) {
                setScheduleTitle(match[1]);
                setScheduleDate(match[2]);
                setScheduleTime(match[3]);
                setEditingMessageId(id);
                setShowScheduleModal(true);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerName}>{name}</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity onPress={handleSchedulePress} style={{ marginRight: 16 }}>
                            <Icon name="calendar-plus" size={26} color="#4CAF50" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={startVideoCall}>
                            <Icon name="phone" size={26} color="#2196F3" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.chatContainer} showsVerticalScrollIndicator={false}>
                    {messages.map((msg) => (
                        <TouchableOpacity key={msg.id} onLongPress={() => msg.type === 'schedule' && showScheduleOptions(msg.id)}>
                            <View style={[
                                styles.messageBox,
                                msg.from === 'me' ? styles.me : styles.other,
                                msg.type === 'schedule' && { backgroundColor: '#E1F5FE', borderColor: '#0288D1', borderWidth: 1 }
                            ]}>
                                <Text style={[
                                    styles.messageText,
                                    msg.from === 'me' ? styles.textMe : styles.textOther,
                                    msg.type === 'schedule' && { color: '#0288D1', fontWeight: 'bold' }
                                ]}>
                                    {msg.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

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

                <Modal
                    visible={showScheduleModal}
                    transparent
                    animationType="slide"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Tạo lịch hẹn</Text>

                            <TextInput
                                value={scheduleTitle}
                                onChangeText={setScheduleTitle}
                                style={styles.modalInput}
                                placeholder="Tiêu đề (VD: Học toán)"
                            />

                            <TextInput
                                value={scheduleDate}
                                onChangeText={setScheduleDate}
                                style={styles.modalInput}
                                placeholder="Ngày (VD: 25/06/2025)"
                            />

                            <TextInput
                                value={scheduleTime}
                                onChangeText={setScheduleTime}
                                style={styles.modalInput}
                                placeholder="Giờ (VD: 14:30)"
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                                <TouchableOpacity onPress={() => setShowScheduleModal(false)} style={styles.cancelBtn}>
                                    <Text>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmSchedule} style={styles.confirmBtn}>
                                    <Text style={{ color: '#fff' }}>{editingMessageId ? 'Lưu' : 'Tạo'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 8,
    },
    cancelBtn: {
        marginRight: 12,
        padding: 10,
    },
    confirmBtn: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 6,
    },
});

export default ChatDetailScreen;