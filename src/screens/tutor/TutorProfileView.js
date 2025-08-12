import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { tutorService } from "../../services";

const TABS = ["Cá Nhân", "Chuyên Môn", "Khác"];

const TutorProfileViewTabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Cá Nhân");
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const user = JSON.parse((await AsyncStorage.getItem("user")) || "{}");

      if (user.id) {
        try {
          // Try to load from API first
          const profileData = await tutorService.getTutorProfile(user.id);
          setForm(profileData);
        } catch (apiError) {
          console.error("API Error:", apiError);
          // Fallback to AsyncStorage
          const json = await AsyncStorage.getItem("tutorProfile");
          const data = json ? JSON.parse(json) : {};
          setForm(data);
        }
      } else {
        // No user ID, load from AsyncStorage
        const json = await AsyncStorage.getItem("tutorProfile");
        const data = json ? JSON.parse(json) : {};
        setForm(data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setForm({});
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    if (!editing) return;
    setForm({ ...form, [key]: value });
  };

  const handleSubjectChange = (index, key, value) => {
    if (!editing) return;
    const updated = [...form.subjects];
    updated[index][key] = value;
    setForm({ ...form, subjects: updated });
  };

  const handleAddSubject = () => {
    if (!editing) return;
    const updated = [...(form.subjects || [])];
    updated.push({ subject: "", level: "", fee: "" });
    setForm({ ...form, subjects: updated });
  };

  const handleRemoveSubject = (index) => {
    if (!editing) return;
    const updated = [...form.subjects];
    updated.splice(index, 1);
    setForm({ ...form, subjects: updated });
  };

  const pickAvatar = async () => {
    if (!editing) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Cần cấp quyền truy cập ảnh");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0].uri });
    }
  };

  const pickCertificate = async () => {
    if (!editing) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Cần cấp quyền truy cập ảnh");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setForm({ ...form, certificate: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    await AsyncStorage.setItem("tutorProfile", JSON.stringify(form));
    await AsyncStorage.setItem("tutorName", form.name || "Gia Sư");

    alert("Đã lưu hồ sơ!");
    setEditing(false);
  };

  if (!form) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>Hồ Sơ Gia Sư</Text>
        </View>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editToggle}>{editing ? "Huỷ" : "Chỉnh sửa"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab ? styles.activeTab : null,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {activeTab === "Cá Nhân" && (
          <>
            <TouchableOpacity onPress={pickAvatar}>
              <Image
                source={
                  form.profileImage
                    ? { uri: form.profileImage }
                    : require("../../assets/avatar.png")
                }
                style={styles.avatar}
              />
              <Text style={styles.avatarHint}>Nhấn để đổi ảnh</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Họ và Tên</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(t) => handleChange("name", t)}
              editable={editing}
              placeholder="Họ và Tên"
            />

            <Text style={styles.label}>Giới tính</Text>
            <TextInput
              style={styles.input}
              value={form.gender}
              onChangeText={(t) => handleChange("gender", t)}
              editable={editing}
              placeholder="Giới tính"
            />

            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
              style={styles.input}
              value={form.dob}
              onChangeText={(t) => handleChange("dob", t)}
              editable={editing}
              placeholder="Ngày sinh"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(t) => handleChange("email", t)}
              editable={editing}
              placeholder="Email"
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(t) => handleChange("phone", t)}
              editable={editing}
              placeholder="Số điện thoại"
            />

            <Text style={styles.label}>Tỉnh/Thành Phố</Text>
            <TextInput
              style={styles.input}
              value={form.city}
              onChangeText={(t) => handleChange("city", t)}
              editable={editing}
              placeholder="Tỉnh/Thành Phố"
            />
          </>
        )}

        {activeTab === "Chuyên Môn" && (
          <>
            <Text style={styles.label}>Chức danh</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(t) => handleChange("title", t)}
              editable={editing}
              placeholder="Chức danh"
            />

            <Text style={styles.label}>Đơn vị học tập/ Công tác</Text>
            <TextInput
              style={styles.input}
              value={form.organization}
              onChangeText={(t) => handleChange("organization", t)}
              editable={editing}
              placeholder="Đơn vị học tập/ Công tác"
            />

            <Text style={styles.label}>Chuyên ngành</Text>
            <TextInput
              style={styles.input}
              value={form.major}
              onChangeText={(t) => handleChange("major", t)}
              editable={editing}
              placeholder="Chuyên ngành"
            />

            <Text style={styles.label}>Hình thức dạy</Text>
            <TextInput
              style={styles.input}
              value={form.teachingMethod}
              onChangeText={(t) => handleChange("teachingMethod", t)}
              editable={editing}
              placeholder="Hình thức dạy"
            />

            <Text style={styles.label}>Chứng chỉ</Text>
            <TouchableOpacity onPress={pickCertificate}>
              <Image
                source={
                  form.certificate
                    ? { uri: form.certificate }
                    : require("../../assets/cer.png")
                }
                style={styles.certificate}
              />
            </TouchableOpacity>
          </>
        )}

        {activeTab === "Khác" && (
          <>
            <Text style={styles.label}>Tự giới thiệu</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              value={form.description}
              onChangeText={(t) => handleChange("description", t)}
              editable={editing}
              placeholder="Tự giới thiệu"
            />

            <Text style={styles.label}>Cập nhật học phí</Text>
            {(form.subjects ? form.subjects : []).map((item, index) => (
              <View key={index} style={styles.subjectBox}>
                <Text style={styles.subjectTitle}>{`Môn ${index + 1}`}</Text>

                <Text style={styles.label}>Môn học</Text>
                <TextInput
                  style={styles.input}
                  value={item.subject}
                  onChangeText={(t) => handleSubjectChange(index, "subject", t)}
                  editable={editing}
                  placeholder="Môn học"
                />

                <Text style={styles.label}>Lớp</Text>
                <TextInput
                  style={styles.input}
                  value={item.level}
                  onChangeText={(t) => handleSubjectChange(index, "level", t)}
                  editable={editing}
                  placeholder="Lớp"
                />

                <Text style={styles.label}>Học phí / buổi</Text>
                <TextInput
                  style={styles.input}
                  value={item.fee}
                  keyboardType="numeric"
                  onChangeText={(t) => handleSubjectChange(index, "fee", t)}
                  editable={editing}
                  placeholder="Học phí / buổi"
                />

                {editing && (
                  <TouchableOpacity onPress={() => handleRemoveSubject(index)}>
                    <Text style={styles.deleteText}>Xoá</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {editing && (
              <TouchableOpacity
                onPress={handleAddSubject}
                style={styles.addBtn}
              >
                <Text style={styles.addText}>+ Thêm môn học</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {editing && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 80,
    marginLeft: 50,
  },
  editToggle: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "500",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tabButton: {
    paddingVertical: 14,
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 18,
    color: "#888",
  },
  activeTab: {
    color: "#00AEEF",
    fontWeight: "bold",
  },
  activeUnderline: {
    height: 3,
    backgroundColor: "#00AEEF",
    width: "100%",
    marginTop: 4,
  },
  body: {
    padding: 24,
  },
  label: {
    marginBottom: 6,
    marginTop: 14,
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 4,
    fontSize: 17,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginVertical: 14,
  },
  avatarHint: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
  certificate: {
    height: 180,
    resizeMode: "contain",
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subjectBox: {
    marginVertical: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 14,
  },
  subjectTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#00AEEF",
    fontSize: 17,
  },
  deleteText: {
    color: "red",
    textAlign: "right",
    fontSize: 15,
    marginTop: 6,
  },
  addBtn: {
    alignSelf: "center",
    marginVertical: 12,
  },
  addText: {
    color: "#00AEEF",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#00AEEF",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default TutorProfileViewTabs;
