import axios from "axios";

const API_URL = "http://192.168.1.21:3002";
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDetail = (id_kecamatan) => {
  const url = `${API_URL}/detail/${id_kecamatan}`;

  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};
export const getKecamatan = async () => {
  try {
    const response = await axios.get(`${API_URL}/kecamatan`);
    return response.data;
  } catch (error) {
    // console.error("Error getting kecamatan:", error);
    throw error;
  }
};

export const deleteDetail = async (id_kecamatan) => {
  try {
    const response = await axios.delete(`${API_URL}/detail/${id_kecamatan}`);
    const deletedData = response.data;
    return deletedData;
  } catch (error) {
    throw error;
  }
};

export const deleteKecamatan = async (id_kecamatan) => {
  try {
    const response = await axios.delete(`${API_URL}/kecamatan/${id_kecamatan}`);
    const deletedData = response.data;
    return deletedData;
  } catch (error) {
    throw error;
  }
};

export const saveLogActivity = async ({
  id_admin,
  status,
  nama_kecamatan,
  id_kecamatan,
  deskripsi,
  gambar,
}) => {
  try {
    const formData = new FormData();
    formData.append("gambar", gambar);
    formData.append("nama_kecamatan", nama_kecamatan);
    formData.append("id_kecamatan", id_kecamatan);
    formData.append("deskripsi", deskripsi);
    formData.append("id_admin", id_admin);
    formData.append("ket_act", status);

    const response = await axios.post(`${API_URL}/log`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengirim data kecamatan:", error);
    throw new Error("id kecamatan telah tersedia.");
  }
};
export const halamanDetail = async (id_kecamatan) => {
  try {
    const response = await axios.get(`${API_URL}/halaman/${id_kecamatan}`);
    const result = response.data;

    if (response.status === 200) {
      return result;
    } else {
      // throw new Error(result.message);
    }
  } catch (error) {
    throw error;
  }
};