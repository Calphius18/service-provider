import ProviderCard from "@/components/ProviderCard";
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
import { getCategories, getProviders } from "../api/api";
import { useStore } from "../store/useStore";

export default function Home() {
  const { providers, setProviders } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);

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

  const filteredProviders = selectedCat
    ? providers.filter((item) => Number(item.categoryId) === selectedCat)
    : providers;

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  if (!providers.length)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-[15px] font-[Jakarta-Medium]">
          No providers available
        </Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-3">
      {/* Header */}
      <View className="justify-center items-center mb-4">
        <Text className="text-[20px] text-neutral-900 font-[Jakarta-Bold]">
          Providers
        </Text>
      </View>

      <View className="flex-row flex-wrap mb-3">
        <TouchableOpacity
          onPress={() => setSelectedCat(null)}
          className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 mb-2 ${
            selectedCat === null ? "bg-black" : "bg-green-500/5"
          }`}
        >
          <Text
            className={`text-[13px] font-[Jakarta-Medium] ${
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
            className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 mb-2 ${
              selectedCat === Number(category.id) ? "bg-black/75" : "bg-green-500/5"
            }`}
          >
            <Image source={{ uri: category.icon }} className="w-4 h-4 mr-1.5" />
            <Text
              className={`text-[13px] font-[Jakarta-Medium] ${
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

      <View className="mt-2 mb-1">
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
    </SafeAreaView>
  );
}
