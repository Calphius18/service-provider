import { Minus, Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FilterRatingProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  ratingFilter: number | null;
  setRatingFilter: (v: number | null) => void;
}

export default function FilterRating({
  visible,
  setVisible,
  ratingFilter,
  setRatingFilter,
}: FilterRatingProps) {
  const [tempRating, setTempRating] = useState<string>(
    ratingFilter ? ratingFilter.toString() : ""
  );

  useEffect(() => {
    if (visible) {
      setTempRating(ratingFilter ? ratingFilter.toString() : "");
    }
  }, [visible, ratingFilter]);

  const handleApply = () => {
    const num = parseFloat(tempRating);
    if (!isNaN(num) && num >= 1 && num <= 5) {
      setRatingFilter(Number(num.toFixed(1)));
    } else {
      setRatingFilter(null);
    }
    setVisible(false);
  };

  const increment = () => {
    const current = parseFloat(tempRating) || 0;
    const newVal = Math.min(current + 0.1, 5);
    setTempRating(newVal.toFixed(1));
  };

  const decrement = () => {
    const current = parseFloat(tempRating) || 1;
    const newVal = Math.max(current - 0.1, 1);
    setTempRating(newVal.toFixed(1));
  };

  const handleInputChange = (val: string) => {
    // Allow empty input or valid decimal up to 1 decimal place
    if (/^\d*\.?\d*$/.test(val)) {
      setTempRating(val);
    }
  };

  const handleQuickSelect = (val: number) => {
    setTempRating(val.toString());
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={() => setVisible(false)}
        className="flex-1 bg-black/40 justify-center items-center px-6"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="bg-white w-full max-w-sm rounded-2xl p-6"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-xl font-JakartaSemiBold text-neutral-900">
              Filter by Rating
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <X size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          <View className="items-center mb-5">
            <Text className="text-[14px] text-gray-600 font-JakartaMedium mb-2">
              Enter a custom rating (1-5)
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={decrement}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
            >
              <Minus size={20} color="#555" />
            </TouchableOpacity>

            <TextInput
              value={tempRating}
              keyboardType="decimal-pad"
              placeholder="4.5"
              placeholderTextColor="#aaa"
              onChangeText={handleInputChange}
              className="border border-gray-300 rounded-xl w-20 text-center py-2 text-[16px] text-black font-JakartaSemiBold"
            />

            <TouchableOpacity
              onPress={increment}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
            >
              <Plus size={20} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Quick Select Buttons */}
          <View className="flex-row justify-between mb-5">
            {[3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                onPress={() => handleQuickSelect(rating)}
                className={`flex-1 py-3 mx-1 rounded-xl border ${
                  parseFloat(tempRating) === rating
                    ? "bg-yellow-100 border-yellow-400"
                    : "border-gray-200"
                }`}
              >
                <Text
                  className={`text-center text-[15px] font-JakartaMedium ${
                    parseFloat(tempRating) === rating
                      ? "text-yellow-700"
                      : "text-gray-700"
                  }`}
                >
                  ⭐ {rating} &gt;
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => {
                setTempRating("");
                setRatingFilter(null);
                setVisible(false);
              }}
              className="flex-1 py-3 rounded-xl bg-gray-100 mr-2"
            >
              <Text className="text-center text-gray-600 font-JakartaMedium">
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 py-3 rounded-xl bg-black"
            >
              <Text className="text-center text-white font-JakartaSemiBold">
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
