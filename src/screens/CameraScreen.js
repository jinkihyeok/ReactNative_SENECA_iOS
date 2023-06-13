import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Pressable,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import DateVersion from "../components/DateVersion";
import PatternView from "../components/patternView";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [image, setImage] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const cameraRef = useRef(null);
  const [textLocation, setTextLocation] = useState("2");
  const [sliderValue, setSliderValue] = useState(23);
  const [fontColor, setFontColor] = useState("white");
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
    if (cameraRef.current) {
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
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      setImage(null);
      setPickedDateTime(null);
      Alert.alert("사진이 저장되었습니다.");
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
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          카메라 접근 권한이 없습니다. {"\n"} 설정에서 카메라 접근 권한을 허용한
          후 {"\n"} 다시 시도해주세요.
        </Text>
      </View>
    );
  }

  if (hasMediaLibraryPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
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
        <View style={styles.colorContainer}>
          <Text style={styles.labelText}>Color</Text>
          <View style={styles.colorButtonContainer}>
            <TouchableOpacity
              onPress={() => setFontColor("white")}
              style={styles.colorButton}
            >
              <FontAwesome name="circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontColor("black")}
              style={styles.colorButton}
            >
              <FontAwesome name="circle" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.labelText}>Size</Text>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={34}
            minimumTrackTintColor="#FFFFFF"
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value)}
            step={1}
          />
        </View>
      </View>
      {!image ? (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <ImageBackground
            style={[styles.bgImage, textLocationStyle()]}
            resizeMode="cover"
          >
            <View style={styles.PatternViewContainer}>
              <PatternView />
            </View>
            <View style={styles.dateContainer}>
              <DateVersion
                version={version}
                sliderValue={sliderValue}
                pickedDateTime={pickedDateTime}
                fontColor={fontColor}
              />
            </View>
            <View style={styles.locationButtonContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((location) => (
                <Pressable
                  key={location}
                  style={styles.locationButton}
                  onPress={() => setTextLocation(location.toString())}
                >
                  <Text style={styles.locationButtonText}>Touch</Text>
                </Pressable>
              ))}
            </View>
          </ImageBackground>
        </Camera>
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
              fontColor={fontColor}
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
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => setVersion("ver4")}
        >
          <Text
            style={[styles.topText, version === "ver4" && { color: "red" }]}
          >
            #4
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => setVersion("ver5")}
        >
          <Text
            style={[styles.topText, version === "ver5" && { color: "red" }]}
          >
            #5
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
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  topContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  colorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    color: "white",
    fontSize: 18,
    paddingBottom: 10,
    textAlign: "center",
  },
  colorButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    backgroundColor: "#343434",
    borderRadius: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  slider: {
    width: "90%",
    alignSelf: "center",
  },
  camera: {
    flex: 1,
  },
  PatternViewContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    flex: 1,
    position: "absolute",
  },
  locationButtonContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  locationButton: {
    width: 100 / 3 + "%",
    height: 100 / 3 + "%",
    justifyContent: "center",
    alignItems: "center",
  },
  locationButtonText: {
    color: "white",
    opacity: 0,
  },
  versionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
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
  topText: {
    color: "grey",
    fontSize: 18,
  },
});
