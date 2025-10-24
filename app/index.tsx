import { Redirect } from "expo-router";
import React, { useState } from "react";

export default function EntryPoint() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
