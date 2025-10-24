import BookingModal from "@/components/BookingModal";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategories, getProvider, postBooking } from "../../../api/api";
import { useStore } from "../../../store/useStore";

const { width } = Dimensions.get("window");

export default function ProviderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const providers = useStore((s) => s.providers);
  const setProviders = useStore((s) => s.setProviders);
  const addBooking = useStore((s) => s.addBooking);

  const [provider, setProvider] = useState<Provider | null>(
    providers.find((p) => p.id === Number(id)) || null
  );
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // shimmer animation
  const shimmer = new Animated.Value(0);

  const startShimmer = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchProvider = async () => {
    setLoading(true);
    try {
      if (!provider) {
        const [provRes, catRes] = await Promise.all([
          getProvider(Number(id)),
          getCategories(),
        ]);
        const foundProvider = provRes.data;
        setProvider(foundProvider);

        // sync Zustand
        const exists = providers.find((p) => p.id === foundProvider.id);
        if (!exists) setProviders([...providers, foundProvider]);

        const foundCategory = catRes.data.find(
          (c: Category) => Number(c.id) === Number(foundProvider.categoryId)
        );
        setCategory(foundCategory || null);
      } else {
        const catRes = await getCategories();
        const foundCategory = catRes.data.find(
          (c: Category) => Number(c.id) === Number(provider.categoryId)
        );
        setCategory(foundCategory || null);
      }
    } catch (error) {
      console.log("Error fetching provider details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startShimmer();
    fetchProvider();
  }, [id]);

  const handleConfirm = async (booking: Booking) => {
    try {
      const res = await postBooking(booking);
      addBooking(res.data);
      setOpen(false);
      setSuccessModal(true);
      await fetchProvider();
    } catch (error) {
      console.log("Error booking provider:", error);
    }
  };

  if (loading)
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        {/* Simple shimmer skeleton */}
        <Animated.View
          style={{
            width: "100%",
            height: 280,
            backgroundColor: "#E5E7EB",
            opacity: shimmer.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 1],
            }),
          }}
        />
        <View className="p-5">
          <View className="w-2/3 h-6 bg-gray-300 rounded-lg mb-3" />
          <View className="w-1/2 h-4 bg-gray-300 rounded-lg mb-2" />
          <View className="w-full h-3 bg-gray-200 rounded-lg mb-2" />
          <View className="w-full h-3 bg-gray-200 rounded-lg mb-2" />
        </View>
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
        {/* Header */}
        <View className="relative">
          <Image
            source={{ uri: provider.image }}
            className="w-full h-[280px] bg-gray-200"
            resizeMode="cover"
          />

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

            <Text
              style={{
                color: "white",
                fontFamily: "Jakarta-SemiBold",
                fontSize: 16,
              }}
            >
              Service Details
            </Text>

            <View style={{ width: 24 }} />
          </BlurView>

          {/* Title + Category */}
          <View className="absolute bottom-6 left-5">
            <Text className="text-white text-[24px] font-[Jakarta-Bold]">
              {provider.name}
            </Text>

            <View className="flex-row items-center mt-1">
              {category?.icon && (
                <Image
                  source={{ uri: category.icon }}
                  className="w-5 h-5 mr-1"
                  resizeMode="contain"
                />
              )}
              <Text className="text-white text-[13px] font-[Jakarta-Medium]">
                {category?.name ?? "Unknown"} •{" "}
                {provider.location?.city ?? "No city"}
              </Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <View className="px-5 py-2">
          <Text className="text-[13px] text-gray-500 font-[Jakarta-Medium]">
            {provider.experienceYears} years of experience
          </Text>
          <Text className="text-[14px] text-neutral-700 font-[Jakarta-Medium] mt-1">
            ⭐ {provider.rating} · ₦{provider.pricePerHour}/hr
          </Text>
          <Text className="text-[15px] text-gray-700 font-JakartaMedium mt-4 leading-6">
            {provider.description}
          </Text>

          {/* Gallery */}
          {gallery?.length ? (
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
          ) : null}

          {/* Map */}
          <View className="mt-6">
            <Text className="text-[16px] font-[Jakarta-SemiBold] text-neutral-900">
              Map Location
            </Text>
            <View className="mt-4 rounded-3xl overflow-hidden">
              <MapView
                style={{ width: width - 30, height: 200 }}
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
                  description={location.city}
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

          {/* Book */}
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

      {/* Expanded Map */}
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

      {/* Success Modal */}
      <ReactNativeModal isVisible={successModal}>
        <View className="bg-white px-7 py-9 rounded-2xl items-center justify-center min-h-[320px]">
          <Image
            source={require("@/assets/images/check.png")}
            className="w-[110px] h-[110px] mb-5"
            resizeMode="contain"
          />
          <Text className="text-2xl font-[Jakarta-Bold] text-center mb-3">
            Booking Successful!
          </Text>
          <Text className="text-base text-gray-500 font-[Jakarta-Regular] text-center mb-6">
            Your booking has been confirmed successfully.
          </Text>

          <TouchableOpacity
            onPress={() => setSuccessModal(false)}
            className="py-4 mt-3 rounded-2xl border border-gray-300 w-full"
            activeOpacity={0.8}
          >
            <Text className="text-center text-[15px] text-gray-700 font-[Jakarta-Medium]">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
}
