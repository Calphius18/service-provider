import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-xl text-red-500 font-JakartaBold">Services Provider App Demo</Text>
    </View>
  );
}
