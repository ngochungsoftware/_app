import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      void WebBrowser.warmUpAsync();
    }

    return () => {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};
