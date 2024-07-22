import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image } from "react-native";

import CustomButton from "./CustomButton";

import { images } from "../constants";

const EmptyState = ({ title, subtitle }) => {
  const route = useRoute();
  let name = "";
  let screen = "";

  if (route.name === "home") {
    name = "Create Video";
    screen = "/create"
  } else {
    name = "Back To Home";
    screen = "/home"
  }

  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      <CustomButton
        title={name}
        handlePress={() => router.push(screen)}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
