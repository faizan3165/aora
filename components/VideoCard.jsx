import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";

import { deleteVideo, saveVideo, unSaveVideo } from "../scripts/videos";

const VideoCard = ({
  video: {
    $id: videoId,
    title,
    thumbnail,
    video,
    likedBy,
    creator: { username, avatar, $id },
  },
  user,
  refetch,
  refetchTrending,
}) => {
  const [play, setPlay] = useState(false);

  const userLiked = likedBy.some((likedUser) => likedUser.$id === user?.$id);

  const saveVideoHandler = async () => {
    try {
      await saveVideo(videoId, $id);

      await refetch();
      await refetchTrending();

      Alert.alert("Success", "Video saved successfully!");
    } catch (error) {
      Alert.alert("Error Saving", error.message);
    }
  };

  const unSaveVideoHandler = async () => {
    try {
      await unSaveVideo(videoId, $id);

      await refetch();
      await refetchTrending();

      Alert.alert("Success", "Video unsaved successfully!");
    } catch (error) {
      Alert.alert("Error Saving", error.message);
    }
  };

  const deleteVideoHandler = async () => {
    try {
      await deleteVideo(videoId);

      await refetch();
      await refetchTrending();

      Alert.alert("Success", "Video deleted successfully!");
    } catch (error) {
      Alert.alert("Error Deleting", error.message);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className=" w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>

            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        {userLiked ? (
          <View className="pt-2">
            <TouchableOpacity activeOpacity={0.7} onPress={unSaveVideoHandler}>
              <Image
                source={icons.liked}
                className="w-5 h-5 "
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="pt-2">
            <TouchableOpacity activeOpacity={0.7} onPress={saveVideoHandler}>
              <Image
                source={icons.like}
                className="w-5 h-5 "
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}

        {$id === user?.$id && (
          <View className="pt-2">
            <TouchableOpacity activeOpacity={0.7} onPress={deleteVideoHandler}>
              <Image
                source={icons.trash}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          useNativeControls
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
