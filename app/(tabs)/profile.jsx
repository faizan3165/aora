import { View, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox";

import useAppwrite from "../../hooks/useAppWrite";
import { getUserPosts } from "../../scripts/videos";
import { signOut } from "../../scripts/users";
import { useGlobalContext } from "../../context/GlobalProvider";

import { icons } from "../../constants";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { data: posts } = useAppwrite(() => getUserPosts(user?.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/signin");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                resizeMode="cover"
                className="w-[90%] h-[90%] rounded-lg"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles={"mt-5"}
              titleStyles={"text-lg"}
            />

            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle={posts.length == 1 ? "Post" : "Posts"}
                containerStyles={"mr-10"}
                titleStyles={"text-xl"}
              />

              <InfoBox
                title={"1.2k"}
                subtitle={"Followers"}
                titleStyles={"text-xl"}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
