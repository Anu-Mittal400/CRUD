import { useAuth } from "@/authcontext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { session, sessionLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && session) {
      // ✅ Redirect logged-in users away from public pages (e.g. login)
      router.replace("/(dashboard)");
    }
  }, [session, sessionLoading]);

  if (sessionLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ Allow non-logged-in users to access the page
  return <>{children}</>;
}
