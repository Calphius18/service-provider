import { getCategories, getProviders } from "@/api/api";
import FilterRating from "@/components/FilterRating";
import ProviderCard from "@/components/ProviderCard";
import { useStore } from "@/store/useStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { providers, setProviders } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [filterVisible, setFilterVisible] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    (async () => {
      try {
        const [provRes, catRes] = await Promise.all([
          getProviders(),
          getCategories(),
        ]);

        setProviders(
          provRes.data.map((prov) => ({
            ...prov,
            categoryId: Number(prov.categoryId),
          }))
        );

        setCategories(
          catRes.data.map((cat) => ({ ...cat, id: Number(cat.id) }))
        );
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Apply category & rating filters
  const filteredProviders = providers.filter((p) => {
    const matchCategory =
      selectedCat === null || Number(p.categoryId) === selectedCat;
    const matchRating = ratingFilter === null || p.rating >= ratingFilter;
    return matchCategory && matchRating;
  });

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  if (!providers.length)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-[15px] font-JakartaMedium">
          No providers available
        </Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-3">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-3 border-b border-gray-200 mb-4">
        <Text className="text-xl justify-start font-JakartaSemiBold text-black">
          Service Finder
        </Text>

        <View className="flex-row items-center justify-end space-x-2">
          {/* Filter button */}
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            className="flex-row items-center px-3 py-1.5 rounded-full bg-gray-300 border mr-2"
          >
            <Feather name="filter" size={18} color="#000" />
            <Text className="ml-2 text-[14px] text-black font-JakartaMedium">
              Filter
            </Text>
          </TouchableOpacity>

          {/* Logout button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center px-3 py-1.5 rounded-full bg-gray-300 border"
          >
            <Feather name="log-out" size={18} color="#ef4444" />
            <Text className="ml-2 text-[14px] text-red-500 font-JakartaMedium">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View className="flex-row flex-wrap mb-3">
        <TouchableOpacity
          onPress={() => setSelectedCat(null)}
          className={`flex-row items-center px-3 py-1.5 rounded-full border mr-2 mb-2 ${
            selectedCat === null ? "bg-black" : "bg-green-500/5"
          }`}
        >
          <Text
            className={`text-[13px] font-Jakarta-Medium ${
              selectedCat === null ? "text-white" : "text-neutral-800"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() =>
              setSelectedCat(
                category.id === selectedCat ? null : Number(category.id)
              )
            }
            className={`flex-row items-center px-3 py-1.5 rounded-full border mr-2 mb-2 ${
              selectedCat === Number(category.id)
                ? "bg-black/75"
                : "bg-green-500/5"
            }`}
          >
            <Image source={{ uri: category.icon }} className="w-4 h-4 mr-1.5" />
            <Text
              className={`text-[13px] font-Jakarta-Medium ${
                selectedCat === Number(category.id)
                  ? "text-white"
                  : "text-neutral-800"
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Providers List */}
      <View className="mt-2 border-b border-gray-200 pb-3  mb-3">
        <Text className="text-2xl font-JakartaSemiBold text-neutral-800">
          Available Providers
        </Text>
      </View>

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const category = categories.find(
            (cat) => Number(cat.id) === Number(item.categoryId)
          );
          if (!category) return null;

          return (
            <ProviderCard
              provider={item}
              category={category}
              onPress={() =>
                router.push({
                  pathname: "/provider/[id]",
                  params: { id: String(item.id) },
                })
              }
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Rating Filter Modal */}
      <FilterRating
        visible={filterVisible}
        setVisible={setFilterVisible}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
      />
    </SafeAreaView>
  );
}
