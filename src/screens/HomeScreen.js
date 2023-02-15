import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

function HomeScreen() {
  const navigation = useNavigation();

  function settingPressHandler() {}

  function cameraPressHandler() {
    navigation.navigate("CameraScreen");
  }

  function albumPressHandler() {
    navigation.navigate("AlbumScreen");
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.mainText}>Home Screen</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View>
          <Pressable onPress={settingPressHandler}>
            <Ionicons name="settings" size={30} color="black" />
          </Pressable>
        </View>
        <View>
          <Pressable onPress={cameraPressHandler}>
            <Ionicons name="camera" size={30} color="black" />
          </Pressable>
        </View>
        <View>
          <Pressable onPress={albumPressHandler}>
            <FontAwesome name="photo" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    backgroundColor: "#eee",
  },
});
