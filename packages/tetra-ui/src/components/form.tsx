import { get } from "lodash";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useMemo,
} from "react";
import type { FieldErrors, FieldPath } from "react-hook-form";
import { Text, type TextProps, View } from "react-native";
import { cn } from "../lib/utils";
import { Label, type LabelProps } from "./label";

// Types
type FieldStateProps = {
  invalid?: boolean;
  disabled?: boolean;
};

type InternalFieldContextType = FieldStateProps & {
  errorMessage?: string;
};

export type FieldProps = InternalFieldContextType & {
  children: React.ReactNode;
};

type FieldControlProps = {
  children: React.ReactElement<FieldStateProps>;
};

// Components
export const Field = ({
  errorMessage,
  invalid,
  disabled,
  children,
}: FieldProps) => {
  const value = useMemo(
    () => ({ errorMessage, disabled, invalid }),
    [errorMessage, disabled, invalid]
  );

  return (
    <FieldContext.Provider value={value}>
      <View className="flex flex-col gap-2">{children}</View>
    </FieldContext.Provider>
  );
};

export const FieldLabel = ({ className, ...props }: LabelProps) => {
  const { disabled, invalid } = useFieldContext();

  return (
    <Label
      {...props}
      className={cn(
        {
          "text-muted-foreground": disabled,
          "text-destructive": invalid,
        },
        className
      )}
    />
  );
};

export const FieldControl = ({ children }: FieldControlProps) => {
  const { disabled, invalid } = useFieldContext();
  const child = Children.only(children);

  if (!child) {
    if (__DEV__) {
      throw new Error(
        "FieldControl expects a single React element as children"
      );
    }

    return null;
  }

  return cloneElement(child, {
    disabled,
    invalid,
  });
};

export const FieldDescription = ({ className, ...props }: TextProps) => {
  return (
    <Text
      {...props}
      className={cn("text-muted-foreground text-sm", className)}
    />
  );
};

export const FieldErrorMessage = ({
  className,
  ...props
}: Omit<TextProps, "children">) => {
  const { errorMessage } = useFieldContext();
  return (
    <Text
      {...props}
      accessibilityRole="alert"
      className={cn("font-medium text-destructive text-sm", className)}
    >
      {errorMessage}
    </Text>
  );
};

// Context
const FieldContext = createContext<InternalFieldContextType | null>(null);

const useFieldContext = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error("useFieldContext must be used within a Field component");
  }
  return context;
};

// Utils
type FieldValuesFromFieldErrors<TFieldErrors> =
  TFieldErrors extends FieldErrors<infer TFieldValues> ? TFieldValues : never;

// biome-ignore lint/suspicious/noExplicitAny: ignore any
export function validateField<TFieldErrors extends FieldErrors<any>>(
  errors: TFieldErrors,
  fieldPath: FieldPath<FieldValuesFromFieldErrors<TFieldErrors>>
) {
  const error = get(errors, fieldPath);

  if (!error) {
    return {};
  }

  return {
    invalid: true,
    errorMessage: error.message as string | undefined,
  } as const;
}
