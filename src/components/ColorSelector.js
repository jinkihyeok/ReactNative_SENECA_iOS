import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ColorSelector = ({ setFontColor }) => {
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "30%",
      }}
    >
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            paddingBottom: 10,
          }}
        >
          Color
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          height: 40,
          backgroundColor: "#343434",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity onPress={() => setFontColor("white")}>
          <FontAwesome name="circle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFontColor("black")}>
          <FontAwesome
            style={{ margin: 0, padding: 0 }}
            name="circle"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ColorSelector;