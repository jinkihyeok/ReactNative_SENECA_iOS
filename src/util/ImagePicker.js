import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Alert } from "react-native";

export async function takePicture() {
  async function verifyPermissions() {
    const [cameraPermissionInformation, requestPermission] =
      useCameraPermissions();
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "권한이 없습니다.",
        "카메라를 사용하려면 권한을 허용해야 합니다."
      );
      return false;
    }
    return true;
  }
  const hasPermission = await verifyPermissions();

  if (!hasPermission) {
    return;
  } else {
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(image);

    return image;
  }
}
