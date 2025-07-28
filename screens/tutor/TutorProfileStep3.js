import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subjectService, tutorService } from '../../services';

const { width } = Dimensions.get('window');

const TutorProfileStep3 = ({ navigation, route }) => {
    const { step1Data, step2Data } = route.params;
    const [description, setDescription] = useState('');
    const [subjects, setSubjects] = useState([
        { id: 1, subject: null, level: null, fee: '', subjectOpen: false, levelOpen: false }
    ]);
    const [allSubjects, setAllSubjects] = useState([
        'Toán', 'Văn (Tiếng Việt)', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Tin Học', 'Địa Lý', 'Lịch Sử',
        'Mỹ Thuật', 'Âm nhạc', 'Tiếng Trung', 'Tiếng Hàn', 'Tiếng Nhật', 'Tiếng Anh', 'Lập trình', 'Khác'
    ]);
    const [loading, setLoading] = useState(false);

    const allLevels = ['Cấp 1', 'Cấp 2', 'Cấp 3', 'Đại học'];

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const subjectsData = await subjectService.getAllSubjects();
            if (subjectsData && subjectsData.length > 0) {
                const subjectNames = subjectsData.map(subject => subject.name);
                setAllSubjects(subjectNames);
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
            // Keep default subjects if API fails
        }
    };

    const handleChange = (index, key, value) => {
        const updated = [...subjects];
        updated[index][key] = value;
        setSubjects(updated);
    };

    const addSubject = () => {
        setSubjects([
            ...subjects,
            {
                id: subjects.length + 1,
                subject: null,
                level: null,
                fee: '',
                subjectOpen: false,
                levelOpen: false,
            },
        ]);
    };

    const removeSubject = (index) => {
        const updated = subjects.filter((_, i) => i !== index);
        setSubjects(updated);
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const fullProfile = {
                ...step1Data,
                ...step2Data,
                description,
                subjects,
            };
            
            // Save to AsyncStorage for backup
            await AsyncStorage.setItem('tutorProfile', JSON.stringify(fullProfile));
            
            // Get current user from storage
            const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
            
            if (user.id) {
                try {
                    // Update tutor profile via API
                    await tutorService.updateTutorProfile(user.id, {
                        bio: description,
                        subjects: subjects.map(s => ({
                            subjectName: s.subject,
                            level: s.level,
                            hourlyRate: parseFloat(s.fee) || 0
                        })).filter(s => s.subjectName && s.level),
                        personalInfo: {
                            name: step1Data.name,
                            gender: step1Data.gender,
                            dateOfBirth: step1Data.dob,
                            phone: step1Data.phone,
                            city: step1Data.city,
                        },
                        professionalInfo: {
                            title: step2Data.title,
                            organization: step2Data.organization,
                            major: step2Data.major,
                            teachingMethod: step2Data.teachingMethod,
                        }
                    });
                    
                    Alert.alert('Thành công', 'Hồ sơ đã được cập nhật thành công!');
                } catch (apiError) {
                    console.error('API Error:', apiError);
                    Alert.alert('Thông báo', 'Hồ sơ đã được lưu tạm thời. Sẽ đồng bộ khi có kết nối.');
                }
            }
            
            navigation.navigate('TutorHome');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Lỗi', 'Không thể lưu hồ sơ. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
            >
                <View style={styles.container}>
                    <Text style={styles.header}>Hồ Sơ Gia Sư</Text>

                    <Text style={styles.label}>Tự giới thiệu</Text>
                    <TextInput
                        style={styles.inputMultiline}
                        placeholder="Chia sẻ một vài thông tin về bản thân"
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text style={styles.label}>Cập nhật học phí</Text>

                    {subjects.map((item, index) => (
                        <View key={index} style={[styles.subjectBox, { zIndex: 5000 - index }]}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.bold}>Môn {index + 1}</Text>
                                <TouchableOpacity onPress={() => removeSubject(index)}>
                                    <Text style={styles.trash}>🗑</Text>
                                </TouchableOpacity>
                            </View>

                            <DropDownPicker
                                items={allSubjects.map(sub => ({ label: sub, value: sub }))}
                                open={item.subjectOpen}
                                setOpen={(open) => {
                                    const updated = [...subjects];
                                    updated[index].subjectOpen = open;
                                    setSubjects(updated);
                                }}
                                value={item.subject}
                                setValue={(cb) => {
                                    const updated = [...subjects];
                                    updated[index].subject = cb(updated[index].subject);
                                    setSubjects(updated);
                                }}
                                placeholder="Chọn môn học"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                dropDownContainerStyle={styles.dropdownContainer}
                                zIndex={5000 - index * 2}
                                zIndexInverse={1000 + index * 2}
                            />

                            <DropDownPicker
                                items={allLevels.map(level => ({ label: level, value: level }))}
                                open={item.levelOpen}
                                setOpen={(open) => {
                                    const updated = [...subjects];
                                    updated[index].levelOpen = open;
                                    setSubjects(updated);
                                }}
                                value={item.level}
                                setValue={(cb) => {
                                    const updated = [...subjects];
                                    updated[index].level = cb(updated[index].level);
                                    setSubjects(updated);
                                }}
                                placeholder="Chọn cấp học"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                dropDownContainerStyle={styles.dropdownContainer}
                                zIndex={4000 - index * 2}
                                zIndexInverse={2000 + index * 2}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Học phí / buổi (nghìn đồng)"
                                keyboardType="numeric"
                                value={item.fee}
                                onChangeText={(text) => handleChange(index, 'fee', text)}
                            />
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addButton} onPress={addSubject}>
                        <Text style={styles.addText}>Thêm môn học</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Quay lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.nextButton, loading && styles.disabledButton]}
                            onPress={handleFinish}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Đang xử lý...' : 'Hoàn Thành'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 300,
    },
    container: {
        padding: 20,
        backgroundColor: '#fffefb',
        flexGrow: 1,
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#31B7EC',
        textAlign: 'center',
        marginBottom: 16,
        marginTop: 50,
    },
    label: {
        fontSize: 20,
        marginBottom: 6,
        color: '#000',
    },
    inputMultiline: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        fontSize: 18,
        marginBottom: 16,
        height: 100,
        textAlignVertical: 'top',
    },
    subjectBox: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    trash: {
        fontSize: 20,
        color: 'red',
    },
    dropdown: {
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
    },
    dropdownContainer: {
        borderColor: '#ccc',
        borderRadius: 8,
        maxHeight: 200,
    },
    dropdownText: {
        fontSize: 18,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 18,
        marginBottom: 10,
    },
    addButton: {
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    addText: {
        fontSize: 18,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        backgroundColor: '#ccc',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 30,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: '#31B7EC',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 30,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    disabledButton: {
        opacity: 0.6,
    },
});

export default TutorProfileStep3;