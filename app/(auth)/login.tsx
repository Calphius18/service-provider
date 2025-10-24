import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.replace("/(root)/(tabs)/home");
    }, 1500);
  };

  return (
    <LinearGradient
      colors={["#93C5FD", "#E5E7EB", "#60A5FA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 justify-center px-6"
    >
      <Text className="text-3xl font-JakartaBold text-center text-black mb-6">
        Welcome Back 👋
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="border-[5px] border-gray-300 rounded-2xl px-4 py-3 mb-4 text-[15px] text-black bg-white/70"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border-[5px] border-gray-300 rounded-2xl px-4 py-3 mb-3 text-[15px] text-black bg-white/70"
      />

      {error ? (
        <Text className="text-red-500 text-center mb-3 font-JakartaMedium">
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`py-4 rounded-2xl ${loading ? "bg-gray-400" : "bg-black"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-JakartaSemiBold text-[16px]">
            Login
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}
