import { Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

  // Android sequential date + time picker
  const handleDatePress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        is24Hour: true,
        onChange: (_, selectedDate) => {
          if (selectedDate) {
            const newDate = new Date(selectedDate);
            // after selecting date, open time picker
            DateTimePickerAndroid.open({
              value: newDate,
              mode: "time",
              is24Hour: true,
              onChange: (_, selectedTime) => {
                if (selectedTime) {
                  const finalDate = new Date(
                    newDate.setHours(
                      selectedTime.getHours(),
                      selectedTime.getMinutes()
                    )
                  );
                  setDate(finalDate);
                }
              },
            });
          }
        },
      });
    } else {
      // For iOS, toggle inline picker
      setShowPicker(!showPicker);
    }
  };

  const handleConfirm = () => {
    if (hours < 1) {
      Alert.alert("Invalid Input", "Please select at least 1 hour.");
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
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <Modal animationType="slide" transparent visible>
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl p-6 shadow-lg max-h-[85%]"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-[18px] font-[Jakarta-SemiBold] text-neutral-900">
                Book {provider.name}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 rounded-full bg-gray-100"
              >
                <Feather name="x" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Date & Time Picker */}
            <View className="mb-6">
              <Text className="text-[14px] font-Jakarta-Medium text-gray-700 mb-2">
                Select Date & Time
              </Text>
              <TouchableOpacity
                onPress={handleDatePress}
                activeOpacity={0.9}
                className="flex-row justify-between items-center border border-gray-200 p-3 rounded-2xl bg-gray-50"
              >
                <Text className="text-[14px] text-gray-700 font-[Jakarta-Regular]">
                  {date.toLocaleString()}
                </Text>
                <Feather name="calendar" size={18} color="#555" />
              </TouchableOpacity>

              {/* Inline picker for iOS */}
              {Platform.OS === "ios" && showPicker && (
                <View className="mt-2">
                  <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="inline"
                    onChange={(_, selectedDate) => {
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                </View>
              )}
            </View>

            {/* Hours Selector */}
            <View className="mb-6">
              <Text className="text-[14px] font-Jakarta-Medium text-gray-700 mb-2">
                Number of Hours
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl p-3 justify-between bg-gray-50">
                <TouchableOpacity
                  onPress={() => setHours(Math.max(1, hours - 1))}
                  className="p-2"
                >
                  <Feather name="minus" size={18} color="#555" />
                </TouchableOpacity>

                <TextInput
                  keyboardType="numeric"
                  value={String(hours)}
                  onChangeText={(val) =>
                    setHours(Math.max(1, Number(val) || 1))
                  }
                  className="text-[16px] text-neutral-900 font-Jakarta-Medium text-center w-[50px]"
                />

                <TouchableOpacity
                  onPress={() => setHours(hours + 1)}
                  className="p-2"
                >
                  <Feather name="plus" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Total Price */}
            <View className="mb-8">
              <Text className="text-[15px] font-Jakarta-Medium text-gray-700">
                Total Cost
              </Text>
              <Text className="text-[22px] text-neutral-900 font-[Jakarta-Bold] mt-1">
                ₦{total.toLocaleString()}
              </Text>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={loading}
              activeOpacity={0.8}
              className={`py-4 rounded-2xl ${
                loading ? "bg-gray-400" : "bg-black"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-[15px] font-[Jakarta-SemiBold]">
                  Confirm Booking
                </Text>
              )}
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={onClose}
              className="py-4 mt-3 rounded-2xl border border-gray-300"
              activeOpacity={0.8}
            >
              <Text className="text-center text-[15px] text-gray-700 font-Jakarta-Medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
