import React from "react";
import { View, Text } from "react-native";
import Toggle from "react-native-toggle-input";

const AutoSaveToggle = ({ toggle, setToggle, image }) => {
  const onAndOff = () => {
    if (toggle === true) {
      return "On";
    } else {
      return "Off";
    }
  };

  return !image ? (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "20%",
      }}
    >
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 10,
            textAlign: "center",
            paddingBottom: 8,
          }}
        >
          Auto Save
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Toggle toggle={toggle} setToggle={setToggle} size={18} color="white" />
      </View>
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 10,
            textAlign: "center",
            paddingTop: 8,
          }}
        >
          {onAndOff()}
        </Text>
      </View>
    </View>
  ) : (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "20%",
      }}
    ></View>
  );
};

export default AutoSaveToggle;