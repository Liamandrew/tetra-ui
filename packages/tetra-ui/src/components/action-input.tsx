import { Text, View } from "react-native";
import { ChevronRight } from "./icons";
import { InputPressable, type InputPressableProps } from "./input";

// Types
export type ActionInputProps = Omit<InputPressableProps, "focused"> & {
  leftElement?: React.ReactNode;
  value?: string;
  placeholder: string;
};

// Components
export const ActionInput = ({
  onFocus,
  onBlur,
  leftElement,
  value,
  placeholder,
  ...props
}: ActionInputProps) => {
  return (
    <InputPressable {...props}>
      {leftElement}

      <View className="grow">
        {value ? (
          <Text className="text-foreground text-md">{value}</Text>
        ) : (
          <Text className="text-md text-muted-foreground">{placeholder}</Text>
        )}
      </View>

      <ChevronRight className="{}-[stroke]:color-muted-foreground size-7" />
    </InputPressable>
  );
};
