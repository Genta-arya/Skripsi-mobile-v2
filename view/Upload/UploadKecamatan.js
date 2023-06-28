import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const UploadKecamatan = () => {
  const [namaKecamatan, setNamaKecamatan] = useState("");
  const [idKecamatan, setIdKecamatan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const API_URL = "http://192.168.1.28:3001";

  useEffect(() => {
    setCharacterCount(deskripsi.length);
  }, [deskripsi]);

  const handleChooseImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Izin akses ke galeri ditolak");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0]; // Ambil aset yang dipilih pertama kali
      console.log("Selected Asset:", selectedAsset);
      setSelectedAsset(selectedAsset);
    }
  };

  const handleUpload = async () => {
    try {
      // Validasi hanya angka pada idKecamatan
      if (!/^\d+$/.test(idKecamatan)) {
        Alert.alert("Validasi Gagal", "ID Kecamatan hanya boleh berisi angka.");
        return;
      }

      if (!selectedAsset) {
        Alert.alert("Pilih Gambar", "Silakan pilih gambar sebelum mengunggah.");
        return;
      }

      const filename = selectedAsset.uri.split("/").pop();
      const type = `image/${filename.split(".").pop().toLowerCase()}`;

      const formData = new FormData();
      formData.append("gambar", {
        uri: selectedAsset.uri,
        name: filename,
        type: type,
      });
      formData.append("nama_kecamatan", namaKecamatan);
      formData.append("id_kecamatan", idKecamatan);
      formData.append("deskripsi", deskripsi);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        // Proses upload berhasil
        Alert.alert("Upload Berhasil", "Data kecamatan berhasil diunggah.");
        setNamaKecamatan("");
        setIdKecamatan("");
        setDeskripsi("");
        setSelectedAsset(null);

        // Post juga ke log
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message ||
          "Terjadi kesalahan saat mengunggah data kecamatan.";
        Alert.alert("Upload Gagal", errorMessage);
      }
    } catch (error) {
      Alert.alert(
        "Upload Gagal",
        "Terjadi kesalahan saat mengunggah data kecamatan."
      );
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleChooseImage}
      >
        {selectedAsset ? (
          <Image
            source={{ uri: selectedAsset.uri }}
            style={styles.selectedImage}
          />
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
        placeholder="Kode Pos"
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
      <Text style={styles.characterCountText}>
        Jumlah Karakter: {characterCount}/60
      </Text>
      <TouchableOpacity
        style={[
          styles.uploadButton,
          characterCount < 60 && styles.disabledButton,
        ]}
        onPress={handleUpload}
        disabled={characterCount < 60}
      >
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
  characterCountText: {
    fontSize: 14,
    marginBottom: 10,
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
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
});

export default UploadKecamatan;
