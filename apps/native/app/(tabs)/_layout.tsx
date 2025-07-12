import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="feedback" options={{ title: "Feedback" }} />
      <Tabs.Screen name="form" options={{ title: "Form" }} />
      <Tabs.Screen name="data-display" options={{ title: "Data Display" }} />
    </Tabs>
  );
}
