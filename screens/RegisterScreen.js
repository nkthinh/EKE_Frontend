import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); 
  const navigation = useNavigation();

  const handleRegister = () => {
    console.log('Register with:', fullName, email, password);
    setIsSuccessModalVisible(true);
    setTimeout(() => {
      setIsSuccessModalVisible(false);
      navigation.navigate('Login');
    }, 2000);
  };

  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Success Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSuccessModalVisible}
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} numberOfLines={2}>Đăng Ký Thành Công!</Text>
            <Icon name="user" size={50} color="white" style={styles.checkIcon} />
            <Text style={styles.modalMessage}>Đã đăng ký tài khoản thành công</Text>
          </View>
        </View>
      </Modal>

      {/* Main Register Screen Content */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with your logo URL
          style={styles.logo}
        />
        <Text style={styles.title}>Đăng Ký</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ Và Tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ Và Tên"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật Khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

          <View style={styles.inputContainer}>
        <Text style={styles.label}>Nhập Lại Mật Khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLoginRedirect}>
        <Text style={styles.loginRedirect}>Đã Có Tài Khoản? Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '60%', 
    alignSelf: 'center', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRedirect: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  checkIcon: {
    marginBottom: 10,
    backgroundColor: '#28a745', 
    borderRadius: 50, 
    padding:30
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});