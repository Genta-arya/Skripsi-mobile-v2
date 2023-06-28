import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const UploadPembangunan = () => {
  const [namaKecamatan, setNamaKecamatan] = useState("");
  const [idKecamatan, setIdKecamatan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [image, setImage] = useState(null);

  const handleUpload = () => {

    setIdKecamatan("");
    setDeskripsi("");
    setImage(null);
  };

  const handleChooseImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Izin akses ke galeri ditolak");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleChooseImage}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <AntDesign name="picture" size={200} color="black" />
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Nama Kecamatan"
        value={namaKecamatan}
        onChangeText={setNamaKecamatan}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Kecamatan"
        value={idKecamatan}
        onChangeText={setIdKecamatan}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Deskripsi"
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UploadPembangunan;
