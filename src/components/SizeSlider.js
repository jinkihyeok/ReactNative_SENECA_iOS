import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const SizeSlider = ({ sliderValue, setSliderValue }) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            paddingBottom: 10,
          }}
        >
          Size
        </Text>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={14}
          maximumValue={34}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="grey"
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
          step={1}
        />
      </View>
    </View>
  );
};

export default SizeSlider;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    flex: 1,
  },
  slider: {
    width: 200,
    height: 40,
  },
});
