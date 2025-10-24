import { MotiView } from "moti";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProviderCard({
  provider,
  category,
  onPress,
}: ProviderCardProps) {
  const iconUri = category?.icon;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
    >
      <View className="flex-row border items-center bg-white rounded-2xl p-4 mb-3 shadow-lg">
        <Image
          source={{ uri: provider.image }}
          className="w-[75px] h-[75px] rounded-xl mr-3 bg-gray-100"
        />

        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text className="text-[16px] text-neutral-900 font-[Jakarta-SemiBold]">
              {provider.name}
            </Text>

            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.9}
              className="bg-green-500/75 px-3 py-1.5 border rounded-full"
            >
              <Text className="text-base text-center text-black font-JakartaBold">
                View Details
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-1">
            <Image source={{ uri: iconUri }} className="w-4 h-4 mr-1" />
            <Text className="text-[13px] text-gray-500 font-[Jakarta-Regular]">
              {category.name} • {provider.location.city}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-[13px] text-neutral-700 font-Jakarta-Medium">
              ⭐ {provider.rating}
            </Text>
            <Text className="text-[13px] text-black font-[Jakarta-SemiBold]">
              ₦{provider.pricePerHour}/hr
            </Text>
          </View>
        </View>
      </View>
    </MotiView>
  );
}
