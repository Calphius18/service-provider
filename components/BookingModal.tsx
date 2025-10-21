import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookingModal({
  provider,
  onClose,
  onConfirm,
}: BookingModalProps) {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);

  const total = provider.pricePerHour * hours;

  const handleConfirm = () => {
    if (hours < 1) {
      Alert.alert("Invalid Input", "Hours must be at least 1");
      return;
    }

    const booking: Booking = {
      providerId: provider.id,
      userId: 1,
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().slice(0, 5),
      hours,
      totalCost: total,
      status: "pending",
    };

    setLoading(true);
    onConfirm(booking);
    setLoading(false);
  };

  return (
    <Modal animationType="slide" transparent visible>
      {/* Dimmed background */}
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={onClose}
      >
        {/* Stop propagation so modal content doesn’t close on inner tap */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl p-6 max-h-[80%]"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-grow"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-[18px] font-[Jakarta-SemiBold] text-neutral-900">
                Book {provider.name}
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Feather name="x" size={22} color="#444" />
              </TouchableOpacity>
            </View>

            {/* Date & Time */}
            <View className="mb-5">
              <Text className="text-[14px] font-[Jakarta-Medium] text-gray-700 mb-2">
                Select Date & Time
              </Text>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                activeOpacity={0.8}
                className="flex-row justify-between items-center border border-gray-200 p-3 rounded-2xl"
              >
                <Text className="text-[14px] text-gray-700 font-[Jakarta-Regular]">
                  {date.toLocaleString()}
                </Text>
                <Feather name="calendar" size={18} color="#555" />
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="datetime"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                    setShowPicker(false);
                  }}
                />
              )}
            </View>

            {/* Hours */}
            <View className="mb-5">
              <Text className="text-[14px] font-[Jakarta-Medium] text-gray-700 mb-2">
                Number of Hours
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl p-3 justify-between">
                <TextInput
                  keyboardType="numeric"
                  value={String(hours)}
                  onChangeText={(val) =>
                    setHours(Math.max(1, Number(val) || 1))
                  }
                  className="text-[15px] text-neutral-900 font-[Jakarta-Medium] w-[60px]"
                />
                <Text className="text-[14px] text-gray-500 font-[Jakarta-Regular]">
                  hrs
                </Text>
              </View>
            </View>

            {/* Total */}
            <View className="mb-8">
              <Text className="text-[15px] font-[Jakarta-Medium] text-gray-700">
                Total Cost
              </Text>
              <Text className="text-[18px] text-neutral-900 font-[Jakarta-SemiBold] mt-1">
                ₦{total.toLocaleString()}
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={loading}
              activeOpacity={0.9}
              className={`py-4 rounded-2xl ${
                loading ? "bg-gray-400" : "bg-black"
              }`}
            >
              <Text className="text-white text-center text-[15px] font-[Jakarta-SemiBold]">
                {loading ? "Booking..." : "Confirm Booking"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="py-4 mt-3 rounded-2xl border border-gray-300"
            >
              <Text className="text-center text-[15px] text-gray-700 font-[Jakarta-Medium]">
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
