import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { getAllPosts, getTrendingPosts } from "../../scripts/videos";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../hooks/useAppWrite";

import { images } from "../../constants";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: trendingPosts, refetch: refetchTrending } =
    useAppwrite(getTrendingPosts);

  const { user } = useGlobalContext();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchTrending();
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            user={user}
            refetch={refetch}
            refetchTrending={refetchTrending}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>

                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Trending Videos
              </Text>

              <Trending posts={trendingPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No Videos Found"}
            subtitle={"Be The First To Upload"}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
