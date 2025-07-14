import { useAuth } from "@/authcontext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, sessionLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/(auth)/login");
    }
  }, [sessionLoading, session]);

  if (sessionLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}