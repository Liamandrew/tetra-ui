import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAwareScrollView as RNKeyboardAwareScrollView,
  KeyboardProvider as RNKeyboardProvider,
  KeyboardStickyView as RNKeyboardStickyView,
  KeyboardToolbar as RNKeyboardToolbar,
} from "react-native-keyboard-controller";

export const KeyboardAvoidingView = RNKeyboardAvoidingView;

export const KeyboardAwareScrollView = ({
  bottomOffset = 62,
  ...props
}: React.ComponentProps<typeof RNKeyboardAwareScrollView>) => {
  return <RNKeyboardAwareScrollView {...props} />;
};

export const KeyboardProvider = RNKeyboardProvider;

export const KeyboardStickyView = RNKeyboardStickyView;

export const KeyboardToolbar = RNKeyboardToolbar;
