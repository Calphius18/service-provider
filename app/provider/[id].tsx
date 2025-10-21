import BookingModal from "@/components/BookingModal";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategories, getProvider, postBooking } from "../../api/api";
import { useStore } from "../../store/useStore";

const { width } = Dimensions.get("window");

export default function ProviderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const addBooking = useStore((s) => s.addBooking);

  useEffect(() => {
    (async () => {
      try {
        const [provRes, catRes] = await Promise.all([
          getProvider(Number(id)),
          getCategories(),
        ]);

        const foundProvider = provRes.data;
        setProvider(foundProvider);

        const foundCategory = catRes.data.find(
          (c: Category) => Number(c.id) === Number(foundProvider.categoryId)
        );
        setCategory(foundCategory || null);
      } catch (error) {
        console.log("Error fetching provider details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleConfirm = async (booking: Booking) => {
    try {
      const res = await postBooking(booking);
      addBooking(res.data);
      setOpen(false);
      Alert.alert("Success", "Booking confirmed!");
    } catch {
      Alert.alert("Error", "Could not complete booking.");
    }
  };

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  if (!provider)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-[15px] font-[Jakarta-Regular]">
          Provider not found
        </Text>
      </SafeAreaView>
    );

  const { location, gallery } = provider;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Header Section with Overlay */}
        <View className="relative">
          <Image
            source={{ uri: provider.image }}
            className="w-full h-[280px] bg-gray-200"
            resizeMode="cover"
          />

          {/* Gradient overlay */}
          <LinearGradient
  colors={["rgba(0,0,0,0.7)", "transparent"]}
  start={{ x: 0.5, y: 1 }}
  end={{ x: 0.5, y: 0 }}
  style={{
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 140,
  }}
/>



          {/* Blurred Header Bar */}
          <BlurView
  intensity={50}
  tint="dark"
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
  }}
>
  <TouchableOpacity
    onPress={() => router.back()}
    style={{
      padding: 8,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 999,
    }}
  >
    <ChevronLeft color="white" size={24} />
  </TouchableOpacity>

  <Text style={{ color: "white", fontFamily: "Jakarta-SemiBold", fontSize: 16 }}>
    Service Details
  </Text>

  <View style={{ width: 24 }} />
</BlurView>


          {/* Info overlay text */}
          <View className="absolute bottom-6 left-5">
            <Text className="text-white text-[24px] font-[Jakarta-Bold]">
              {provider.name}
            </Text>
            {category && (
              <View className="flex-row items-center mt-1">
                <Image
                  source={{ uri: category.icon }}
                  className="w-5 h-5 mr-1"
                  resizeMode="contain"
                />
                <Text className="text-white text-[13px] font-[Jakarta-Medium]">
                  {category.name} • {provider.location.city}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 🔹 Body Section */}
        <View className="p-5">
          {/* Experience + Rating + Price */}
          <Text className="text-[13px] text-gray-500 font-[Jakarta-Medium]">
            {provider.experienceYears} years of experience
          </Text>

          <Text className="text-[14px] text-neutral-700 font-[Jakarta-Medium] mt-1">
            ⭐ {provider.rating} · ₦{provider.pricePerHour}/hr
          </Text>

          {/* Description */}
          <Text className="text-[15px] text-gray-700 font-JakartaMedium mt-4 leading-6">
            {provider.description}
          </Text>

          {/* Gallery Carousel */}
          {gallery && gallery.length > 0 && (
            <View className="mt-5">
              <Text className="text-[16px] font-[Jakarta-SemiBold] mb-2 text-neutral-900">
                Work Gallery
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                {gallery.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    className="w-[160px] h-[120px] rounded-2xl mr-3 bg-gray-200"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Map Section */}
          <View >
             <Text className="text-[16px] font-[Jakarta-SemiBold] mt-4 text-neutral-900">
                Map Location
              </Text>
          <View className="mt-6 rounded-3xl overflow-hidden">
            <MapView
              style={{
                width: width - 30,
                height: 200,
              }}
              initialRegion={{
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              pointerEvents="none"
            >
              <Marker
                coordinate={{
                  latitude: location.lat,
                  longitude: location.lng,
                }}
                title={provider.name}
                description={provider.location.city}
              />
            </MapView>
          </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setMapExpanded(true)}
            className="mt-3"
          >
            <Text className="text-center text-gray-500 text-[13px]">
              Tap to expand map
            </Text>
          </TouchableOpacity>

          {/* Book Button */}
          <TouchableOpacity
            onPress={() => setOpen(true)}
            className="bg-black py-3 mt-8 rounded-2xl"
            activeOpacity={0.8}
          >
            <Text className="text-center text-white font-[Jakarta-SemiBold] text-[15px]">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Expandable Full Map Modal */}
      <Modal visible={mapExpanded} animationType="slide" transparent={false}>
        <SafeAreaView className="flex-1 bg-black">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.lat,
                longitude: location.lng,
              }}
              title={provider.name}
              description={location.city}
            />
          </MapView>

          <TouchableOpacity
            onPress={() => setMapExpanded(false)}
            className="absolute top-10 right-5 bg-white/90 px-4 py-2 rounded-full"
          >
            <Text className="text-black font-[Jakarta-Medium]">Close Map</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Booking Modal */}
      {open && (
        <BookingModal
          provider={provider}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </SafeAreaView>
  );
}
