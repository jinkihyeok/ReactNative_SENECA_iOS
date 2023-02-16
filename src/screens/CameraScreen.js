import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [textLocation, setTextLocation] = useState("top");
  const [sliderValue, setSliderValue] = useState(30);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  function saveImage() {
    navigation.navigate("EditScreen", { image });
    setImage(null);
  }

  function goBack() {
    navigation.goBack();
  }

  const textLocationStyle = () => {
    switch (textLocation) {
      case "top":
        return { justifyContent: "flex-start" };
      case "middle":
        return { justifyContent: "center" };
      case "bottom":
        return { justifyContent: "flex-end" };
    }
  };

  if (hasCameraPermission === false) {
    return <Text>카메라 접근 권한이 없습니다.</Text>;
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.topBtnContainer}>
          <TouchableOpacity onPress={() => setTextLocation("bottom")}>
            <Text style={textLocation === "bottom" && { fontWeight: "bold" }}>
              하단
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTextLocation("middle")}>
            <Text style={textLocation === "middle" && { fontWeight: "bold" }}>
              중간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTextLocation("top")}>
            <Text style={textLocation === "top" && { fontWeight: "bold" }}>
              상단
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={20}
            maximumValue={40}
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value)}
            step={1}
          />
        </View>
      </View>
      {!image ? (
        <Camera
          style={[styles.camera, textLocationStyle()]}
          type={cameraType}
          ref={cameraRef}
        >
          <View>
            <Text style={[styles.text, { fontSize: sliderValue }]}>
              Display Time
            </Text>
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      {!image ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={goBack} style={styles.takePictureBtn}>
            <AntDesign name="back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.takePictureBtn}>
            <MaterialIcons name="camera" size={50} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCameraType(
                cameraType === CameraType.back
                  ? CameraType.front
                  : CameraType.back
              );
            }}
          >
            <Entypo name="retweet" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer2}>
          <TouchableOpacity
            onPress={() => setImage(null)}
            style={styles.reTakeBtn}
          >
            <Entypo name="retweet" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveImage} style={styles.saveBtn}>
            <Feather name="check" size={40} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  topBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    width: "80%",
    height: 40,
  },
  camera: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  buttonContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "white",
    paddingVertical: 20,
  },
  text: {
    fontWeight: "bold",
    color: "white",
    paddingVertical: 30,
  },
});
