import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

export default function EntryPoint() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Here you could later check AsyncStorage or Zustand for auth
    // For now we just simulate "logged out"
  }, []);

  if (isLoggedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
