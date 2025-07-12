import { ScrollView } from "react-native";
import ComponentLink from "@/components/component-link";

export default function Form() {
  return (
    <ScrollView
      className="p-4"
      contentContainerClassName="flex gap-4"
      contentInsetAdjustmentBehavior="automatic"
    >
      <ComponentLink href="/button">Button</ComponentLink>
    </ScrollView>
  );
}
