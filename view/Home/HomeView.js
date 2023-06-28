import React, { useEffect, useRef, useContext, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  BackHandler,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { Divider } from "@react-native-material/core";
import bg from "../../components/src/assets/rsz_1a.jpg";
import icon from "../../components/src/assets/rsz_image.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../Theme/Theme";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
const screenWidth = Dimensions.get("window").width;
const HomeView = () => {
  const backPressRef = useRef(0);
  const { isDarkMode, backgroundColor, textColor } = useContext(ThemeContext);
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (backPressRef.current && backPressRef.current > 0) {
          BackHandler.exitApp();
        } else {
          ToastAndroid.show(
            "Tekan sekali lagi untuk keluar",
            ToastAndroid.SHORT
          );

          backPressRef.current = backPressRef.current + 1;

          setTimeout(() => {
            backPressRef.current = 0;
          }, 2000);
        }
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.21:3002/admin/");
        const json = await response.json();

        if (json.data && json.data.length > 0) {
          const uniqueYears = Array.from(
            new Set(json.data.map((item) => item.tahun))
          ).sort((a, b) => a - b);

          const labels = uniqueYears.map((year) => String(year));

          const data = uniqueYears.map((year) => {
            const count = json.data.filter(
              (item) => item.tahun === year
            ).length;
            return count;
          });

          const newData = {
            labels,
            datasets: [
              {
                data,
              },
            ],
          };

          setChartData(newData);
          await AsyncStorage.setItem("chartData", JSON.stringify(newData)); 
        } else {
          console.log("Data is empty");
          setChartData(null); 
          await AsyncStorage.removeItem("chartData"); 
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ScrollView>
      <ImageBackground
        source={bg}
        style={styles.backgroundImage}
      ></ImageBackground>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <SafeAreaView style={styles.contentContainer}>
          <ImageBackground source={icon} style={styles.icon}>
            <Divider style={{ marginTop: 60 }} />
          </ImageBackground>
          <View style={[styles.cardContainer, { backgroundColor }]}>
            <Text style={[styles.visionTitle, { color: textColor }]}>Visi</Text>
            <Text style={[styles.visionText, { color: textColor }]}>
              Menjadi Organisasi yang Terbaik dan Profesional di Bidang
              Pengelolaan Pendapatan Daerah
            </Text>
            <Text style={[styles.missionTitle, { color: textColor }]}>
              Misi
            </Text>
            <Text style={[styles.missionText, { color: textColor }]}>
              - Melaksanakan perencanaan, pengendalian dan monitoring
              pengelolaan pendapatan daerah yang sesuai dengan potensi daerah.{" "}
              {"\n"}- Melakukan pengkajian dan pengembangan potensi pendapatan
              daerah. {"\n"}- Meningkatkan pendapatan yang sesuai dengan potensi
              daerah. {"\n"}- Membuat kebijakan-kebijakan tentang peningkatan
              pendapatan daerah yang bersifat komprehensif dan berkelanjutan.
            </Text>

            <Text style={[styles.mottoTitle, { color: textColor }]}>
              Motto Pelayanan
            </Text>
            <Text style={[styles.mottoText, { color: textColor }]}>
              Profesional, Ramah, Ikhlas, Mudah dan Akuntabel
            </Text>

            <Text style={[styles.maklumatTitle, { color: textColor }]}>
              Maklumat Pelayanan
            </Text>
            <Text style={[styles.maklumatText, { color: textColor }]}>
              Dengan Ini Kami Segenap Aparatur Sipil Negara Badan Pendapatan
              Daerah Kabupaten Ketapang Menyatakan Sanggup Dan Siap
              Menyelenggarakan Pelayanan Berdasarkan Standar Operasional
              Prosedur (SOP) Yang Telah Ditetapkan Dan Apabila Tidak Menepati
              Janji Ini Maka Kami Siap Menerima Sanksi Sesuai Dengan Peraturan
              Yang Berlaku
            </Text>

            <Text style={[styles.maklumatTitle, { color: textColor }]}>
              Grafik Pembangunan
            </Text>
          </View>
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              horizontal
            >
              <View style={styles.chartContainer}>
                {chartData &&
                chartData.datasets &&
                chartData.datasets.length > 0 ? (
                  <LineChart
                    data={chartData}
                    width={screenWidth}
                    height={320}
                    chartConfig={{
                      backgroundGradientFrom: "#1E2923",
                      backgroundGradientTo: "#08130D",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726",
                      },
                    }}
                    bezier
                    style={styles.chart}
                  />
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No data available</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 112,
    height: 150,
    marginTop: -50,
    marginBottom: 20,
  },
  backgroundImage: {
    width: "100%",
    height: 300,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
    paddingTop: 20,
  },
  cardContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    width: "80%",
  },
  visionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  visionText: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "center",
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  missionText: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "justify",
  },
  mottoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  mottoText: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "center",
  },
  maklumatTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  maklumatText: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "justify",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  chartContainer: {
    alignItems: "flex-start",
  },
  chart: {
    borderRadius: 5,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth,
    height: 250,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
});

export default HomeView;
