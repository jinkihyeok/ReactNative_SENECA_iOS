import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import AlbumScreen from "./src/screens/AlbumScreen";
import EditScreen from "./src/screens/EditScreen";
import CameraScreen from "./src/screens/CameraScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditScreen"
            component={EditScreen}
            options={{
              headerTitle: "편집",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="AlbumScreen"
            component={AlbumScreen}
            options={{
              headerTitle: "앨범",
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
  },
});
