import React, { useState } from "react";
import { FlatList } from "react-native";

import TrendingItem from "./TrendingItem";

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewAbleItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveItem(viewableItems[0].key);
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
      onViewableItemsChanged={viewAbleItemsChanged}
    />
  );
};

export default Trending;
