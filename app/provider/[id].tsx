import BookingModal from "@/components/BookingModal";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProvider, postBooking } from "../../api/api";
import { useStore } from "../../store/useStore";

export default function ProviderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const addBooking = useStore((s) => s.addBooking);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProvider(Number(id));
        setProvider(res.data);
      } catch (error) {
        console.log(error);
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
    } catch (err) {
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

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <SafeAreaView>
        <Text>
          Service Details
        </Text>
      </SafeAreaView>
      <Image
        source={{ uri: provider.image }}
        className="w-full h-[240px] rounded-3xl bg-gray-100"
      />

      <View className="p-5">
        <Text className="text-[24px] text-neutral-900 font-[Jakarta-Bold]">
          {provider.name}
        </Text>
        <Text className="text-[14px] text-gray-500 font-[Jakarta-Regular] mt-1">
          {provider.category}
        </Text>

        <Text className="text-[14px] text-neutral-700 font-[Jakarta-Medium] mt-2">
          ⭐ {provider.rating} · ₦{provider.pricePerHour}/hr
        </Text>

        <Text className="text-[15px] text-gray-700 font-[Jakarta-Regular] mt-4 leading-6">
          {provider.description}
        </Text>

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

      {open && (
        <BookingModal
          provider={provider}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </ScrollView>
  );
}
