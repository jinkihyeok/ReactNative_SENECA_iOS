import { AutoFocus, Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Button,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import DateVersion from "../components/DateVersion";
import { captureRef } from "react-native-view-shot";

function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [image, setImage] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const cameraRef = useRef(null);
  const [textLocation, setTextLocation] = useState("2");
  const [sliderValue, setSliderValue] = useState(30);
  const [version, setVersion] = useState("ver1");
  const [pickedDateTime, setPickedDateTime] = useState(null);
  const snapShotRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const MediaLibraryPermission =
          await MediaLibrary.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === "granted");
        setHasMediaLibraryPermission(
          MediaLibraryPermission.status === "granted"
        );
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const options = { quality: 1 };
        const data = await cameraRef.current.takePictureAsync(options);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  async function saveImage() {
    try {
      const result = await captureRef(snapShotRef);
      const asset = await MediaLibrary.createAssetAsync(result);
      const album = await MediaLibrary.getAlbumAsync("Seneca");
      if (album === null) {
        await MediaLibrary.createAlbumAsync("Seneca", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false).then(
          () => {
            Alert.alert("사진이 저장되었습니다.");
          }
        );
      }
      setImage(null);
      setPickedDateTime(null);
    } catch (e) {
      console.log(e);
    }
  }

  function reTake() {
    setImage(null);
    setPickedDateTime(null);
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [5, 4],
        quality: 1,
        exif: true,
      });

      const pickedDateTime = result.assets[0].exif.DateTimeOriginal;
      if (!result.canceled && pickedDateTime !== undefined) {
        setPickedDateTime(pickedDateTime);
        setImage(result.assets[0].uri);
      } else if (pickedDateTime === undefined) {
        Alert.alert(
          "이미 적용된 사진이거나,\n시간 데이터가 존재하지 않는 사진입니다."
        );
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const textLocationStyle = () => {
    switch (textLocation) {
      case "1":
        return { justifyContent: "flex-start", alignItems: "flex-start" };
      case "2":
        return { justifyContent: "flex-start", alignItems: "center" };
      case "3":
        return { justifyContent: "flex-start", alignItems: "flex-end" };
      case "4":
        return { justifyContent: "center", alignItems: "flex-start" };
      case "5":
        return { justifyContent: "center", alignItems: "center" };
      case "6":
        return { justifyContent: "center", alignItems: "flex-end" };
      case "7":
        return { justifyContent: "flex-end", alignItems: "flex-start" };
      case "8":
        return { justifyContent: "flex-end", alignItems: "center" };
      case "9":
        return { justifyContent: "flex-end", alignItems: "flex-end" };
    }
  };

  if (hasCameraPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 20,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          카메라 접근 권한이 없습니다. {"\n"} 설정에서 카메라 접근 권한을 허용한
          후 {"\n"} 다시 시도해주세요.
        </Text>
      </View>
    );
  }

  if (hasMediaLibraryPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 20,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          사진 저장 권한이 없습니다. {"\n"} 설정에서 사진 저장 권한을 허용한 후
          {"\n"}
          다시 시도해주세요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              padding: 5,
              borderRadius: "50%",
            }}
          >
            글씨 크기
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={20}
            maximumValue={40}
            minimumTrackTintColor="#FFFFFF"
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value)}
            step={1}
          />
        </View>
      </View>
      {!image ? (
        <View style={{ flex: 1 }}>
          <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
            <View style={{ flex: 1 }}>
              <ImageBackground
                style={[styles.bgImage, textLocationStyle()]}
                resizeMode="cover"
              >
                <DateVersion
                  version={version}
                  sliderValue={sliderValue}
                  pickedDateTime={pickedDateTime}
                />
                <View style={styles.locationBtnContainer2}>
                  <View style={styles.topLocationBtn}>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("1")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("2")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("3")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                  </View>
                  <View style={styles.midLocationBtn}>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("4")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("5")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("6")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                  </View>
                  <View style={styles.botLocationBtn}>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("7")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("8")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                    <Pressable
                      style={styles.locationBtn}
                      onPress={() => setTextLocation("9")}
                    >
                      <Text>Touch</Text>
                    </Pressable>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </Camera>
        </View>
      ) : (
        <View style={{ flex: 1 }} ref={snapShotRef}>
          <ImageBackground
            source={{ uri: image }}
            style={[styles.camera, textLocationStyle()]}
          >
            <DateVersion
              version={version}
              sliderValue={sliderValue}
              pickedDateTime={pickedDateTime}
            />
            <View style={styles.locationBtnContainer2}>
              <View style={styles.topLocationBtn}>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("1")}
                >
                  <Text>Touch</Text>
                </Pressable>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("2")}
                >
                  <Text>Touch</Text>
                </Pressable>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("3")}
                >
                  <Text>Touch</Text>
                </Pressable>
              </View>
              <View style={styles.midLocationBtn}>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("4")}
                >
                  <Text>Touch</Text>
                </Pressable>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("5")}
                >
                  <Text>Touch</Text>
                </Pressable>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("6")}
                >
                  <Text>Touch</Text>
                </Pressable>
              </View>
              <View style={styles.botLocationBtn}>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("7")}
                >
                  <Text>Touch</Text>
                </Pressable>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("8")}
                >
                  <Text>Touch</Text>
                </Pressable>
                <Pressable
                  style={styles.locationBtn}
                  onPress={() => setTextLocation("9")}
                >
                  <Text>Touch</Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>
      )}
      <View style={styles.versionContainer}>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => setVersion("ver1")}
        >
          <Text
            style={[styles.topText, version === "ver1" && { color: "red" }]}
          >
            #1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => setVersion("ver2")}
        >
          <Text
            style={[styles.topText, version === "ver2" && { color: "red" }]}
          >
            #2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => setVersion("ver3")}
        >
          <Text
            style={[styles.topText, version === "ver3" && { color: "red" }]}
          >
            #3
          </Text>
        </TouchableOpacity>
      </View>
      {!image ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.takePictureBtn}>
            <Ionicons name="ios-albums-outline" size={30} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.takePictureBtn}>
            <MaterialIcons name="camera" size={60} color="white" />
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
            <EvilIcons name="refresh" size={40} color="grey" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer2}>
          <TouchableOpacity onPress={reTake} style={styles.reTakeBtn}>
            <Ionicons name="return-down-back-outline" size={35} color="white" />
          </TouchableOpacity>
          <View style={styles.takePictureBtn}>
            <MaterialIcons name="camera" size={60} color="black" />
          </View>
          <TouchableOpacity onPress={saveImage} style={styles.saveBtn}>
            <MaterialIcons name="save-alt" size={35} color="white" />
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
    justifyContent: "center",
    backgroundColor: "black",
  },
  topContainer: {
    paddingVertical: 20,
  },
  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  slider: {
    width: "80%",
    height: 40,
  },
  locationBtnContainer2: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "absolute",
  },
  topLocationBtn: {
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  midLocationBtn: {
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  botLocationBtn: {
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  locationBtn: {
    width: "30%",
    height: "100%",
    opacity: 0,
  },
  versionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingTop: 20,
  },
  camera: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  buttonContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  btnStyle: {
    width: "30%",
    justifyContent: "center",

    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    color: "white",
    paddingVertical: 30,
  },
});
