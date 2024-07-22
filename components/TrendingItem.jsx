import * as Animatable from "react-native-animatable";
import React, { useState } from "react";
import { TouchableOpacity, ImageBackground, Image } from "react-native";
import { ResizeMode, Video } from "expo-av";

import { icons } from "../constants";

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  const zoomIn = {
    0: {
      scale: 0.9,
    },
    1: {
      scale: 1.1,
    },
  };

  const zoomOut = {
    0: {
      scale: 1,
    },
    1: {
      scale: 0.9,
    },
  };

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          useNativeControls
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default TrendingItem;
