import { AutoFocus, Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import ViewShot from "react-native-view-shot";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import PatternView from "../components/patternView";
import DateVersion from "../components/dateVersion";
import ColorSelector from "../components/colorSelector";
import SizeSlider from "../components/sizeSlider";
import AutoSaveToggle from "../components/autoSaveToggle";
import {
  pickImage,
  saveImage,
  shareImage,
  takePicture,
} from "../util/cameraUtils";
import LocationButtons from "../components/textLocation";
import VersionSelector from "../components/versionSelector";
import { loadSettings, saveSettings } from "../util/asyncStorage";
import PermissionCheck from "../components/permissionCheck";
import { textLocationStyle } from "../util/textLocationStyle";
import { CameraButtons, ImageButtons } from "../components/bottomButtons";

export function CameraScreen() {
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);
  const snapshotRef = useRef<ViewShot | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [pickedDateTime, setPickedDateTime] = useState<string | null>(null);
  const [textLocation, setTextLocation] = useState<string>("5");
  const [fontColor, setFontColor] = useState<string>("white");
  const [version, setVersion] = useState<string>("ver1");
  const [sliderValue, setSliderValue] = useState<number>(23);
  const [toggle, setToggle] = useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await loadSettings();
      if (settings) {
        setTextLocation(settings.textLocation);
        setFontColor(settings.fontColor);
        setVersion(settings.version);
        setSliderValue(settings.sliderValue);
        setToggle(settings.toggle);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    saveSettings({ textLocation, fontColor, version, sliderValue, toggle });
  }, [textLocation, fontColor, version, sliderValue, toggle]);

  async function requestPermissions() {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasCameraPermission(cameraPermission.granted);
    setHasMediaLibraryPermission(mediaLibraryPermission.granted);
  }

  useEffect(() => {
    requestPermissions();
  }, []);

  async function handleTakePicture() {
    const uri = await takePicture(cameraRef);
    if (uri && toggle === false) {
      setImage(uri);
    } else if (uri && toggle === true) {
      setImage(uri);
      setTimeout(handleSaveImage, 100);
    }
  }

  async function handleSaveImage() {
    if (snapshotRef.current?.capture) {
      const success = await saveImage(snapshotRef);
      if (success) {
        setImage(null);
        setPickedDateTime(null);
      }
    }
  }

  async function handleShareImage() {
    if (snapshotRef.current?.capture) {
      await shareImage(snapshotRef);
    }
  }

  async function handlePickImage() {
    await pickImage(setPickedDateTime, setImage, setToggle, toggle);
  }

  function onClickFlipBtn() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function reTake() {
    setImage(null);
    setPickedDateTime(null);
  }

  const [cameraZoom, setCameraZoom] = useState(0);
  const onPinchGestureEvent = (event: any) => {
    const { velocity } = event.nativeEvent;

    let newCameraZoom;
    if (velocity > 0) {
      newCameraZoom = cameraZoom + 0.0003; // 양수일 때 일정한 비율로 증가
    } else if (velocity < 0) {
      newCameraZoom = cameraZoom - 0.0003; // 음수일 때 일정한 비율로 감소
    }

    // 유효성 검사
    if (typeof newCameraZoom === "number" && !isNaN(newCameraZoom)) {
      newCameraZoom = Math.max(0, Math.min(1, newCameraZoom)); // 최소 0, 최대 1로 제한
      setCameraZoom(newCameraZoom);
    }
  };

  return (
    <PermissionCheck
      hasCameraPermission={hasCameraPermission}
      hasMediaLibraryPermission={hasMediaLibraryPermission}
    >
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <ColorSelector setFontColor={setFontColor} />
          <SizeSlider
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
          />
          <AutoSaveToggle toggle={toggle} setToggle={setToggle} image={image} />
        </View>
        {!image ? (
          <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={type}
              autoFocus={AutoFocus.on}
              zoom={cameraZoom}
            >
              <View style={[styles.bgImage, textLocationStyle(textLocation)]}>
                <View style={styles.dateContainer}>
                  <DateVersion
                    version={version}
                    sliderValue={sliderValue}
                    pickedDateTime={pickedDateTime}
                    fontColor={fontColor}
                  />
                </View>
                <View style={styles.PatternViewContainer}>
                  <PatternView />
                </View>
                <LocationButtons setTextLocation={setTextLocation} />
              </View>
            </Camera>
          </PinchGestureHandler>
        ) : (
          <ViewShot style={{ flex: 1 }} ref={snapshotRef}>
            <ImageBackground
              source={{ uri: image }}
              style={[styles.camera, textLocationStyle(textLocation)]}
            >
              <LocationButtons setTextLocation={setTextLocation} />
              <View style={styles.dateContainer}>
                <DateVersion
                  version={version}
                  sliderValue={sliderValue}
                  pickedDateTime={pickedDateTime}
                  fontColor={fontColor}
                />
              </View>
            </ImageBackground>
          </ViewShot>
        )}
        <VersionSelector version={version} setVersion={setVersion} />
        {!image ? (
          <CameraButtons
            pickImage={handlePickImage}
            handleTakePicture={handleTakePicture}
            onClickFlipBtn={onClickFlipBtn}
          />
        ) : (
          <ImageButtons
            toggle={toggle}
            reTake={reTake}
            handleShareImage={handleShareImage}
            handleSaveImage={handleSaveImage}
          />
        )}
      </View>
    </PermissionCheck>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  topContainer: {
    backgroundColor: "black",
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  PatternViewContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    flex: 1,
    position: "absolute",
  },
});
