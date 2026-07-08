import { cva } from "class-variance-authority";
import { ActivityIndicator, View } from "react-native";
import * as ToastPrimitive from "sonner-native";
import { useUniwind } from "uniwind";
import { cn } from "@/lib/utils";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "./icons";
import { Text } from "./text";

// Types
type ToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";

type ToastIconProps = {
  variant: ToastVariant;
};

type ToastOptions = NonNullable<
  Parameters<typeof ToastPrimitive.toast.custom>[1]
>;

type PromiseOptions = {
  loading: string;
  success: string | ((result: unknown) => string);
  error: string | ((error: unknown) => string);
} & Omit<ToastOptions, "description" | "icon">;

// Components
const ToastIcon = ({ variant }: ToastIconProps) => {
  const iconClassName = iconVariants({ variant });

  if (variant === "loading") {
    return (
      <View className="size-5 items-center justify-center">
        <ActivityIndicator className="accent-muted-foreground" size="small" />
      </View>
    );
  }

  if (variant === "success") {
    return <CircleCheckIcon className={iconClassName} />;
  }

  if (variant === "error") {
    return <TriangleAlertIcon className={iconClassName} />;
  }

  if (variant === "warning") {
    return <CircleAlertIcon className={iconClassName} />;
  }

  return <InfoIcon className={iconClassName} />;
};

type TetraToastProps = {
  variant: ToastVariant;
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

const TetraToast = ({ variant, title, description, icon }: TetraToastProps) => (
  <View className="mx-4 justify-center rounded-2xl border border-border/80 bg-popover p-4 shadow-md">
    <View
      className={cn(
        "flex-row gap-4",
        description ? "items-start" : "items-center"
      )}
    >
      {icon ?? <ToastIcon variant={variant} />}
      <View className="flex-1">
        <Text className={titleVariants({ variant })}>{title}</Text>
        {description ? (
          <Text className="text-muted-foreground text-sm">{description}</Text>
        ) : null}
      </View>
    </View>
  </View>
);

export const Toaster = (props: Omit<ToastPrimitive.ToasterProps, "theme">) => {
  const { theme: uniwindTheme } = useUniwind();
  const theme = uniwindTheme === "dark" ? "dark" : "light";

  return (
    <ToastPrimitive.Toaster {...props} enableStacking gap={4} theme={theme} />
  );
};

// Utils
const showToast = (
  variant: ToastVariant,
  title: string,
  options?: ToastOptions
) => {
  const { description, icon, ...rest } = options ?? {};

  return ToastPrimitive.toast.custom(
    <TetraToast
      description={description}
      icon={icon}
      title={title}
      variant={variant}
    />,
    rest
  );
};

export const toast = Object.assign(
  (message: string, options?: ToastOptions) =>
    showToast("default", message, options),
  {
    custom: ToastPrimitive.toast.custom,
    dismiss: ToastPrimitive.toast.dismiss,
    error: (message: string, options?: ToastOptions) =>
      showToast("error", message, options),
    info: (message: string, options?: ToastOptions) =>
      showToast("info", message, options),
    loading: (message: string, options?: ToastOptions) =>
      showToast("loading", message, options),
    promise: <T,>(promise: Promise<T>, options: PromiseOptions) => {
      const { loading, success, error, ...rest } = options;
      const id = ToastPrimitive.toast.custom(
        <TetraToast title={loading} variant="loading" />,
        { ...rest, duration: Number.POSITIVE_INFINITY }
      );

      promise
        .then((data) => {
          const title = typeof success === "function" ? success(data) : success;
          ToastPrimitive.toast.custom(
            <TetraToast title={title} variant="success" />,
            {
              duration: rest.duration,
              id,
            }
          );
        })
        .catch((err) => {
          const title = typeof error === "function" ? error(err) : error;
          ToastPrimitive.toast.custom(
            <TetraToast title={title} variant="error" />,
            {
              duration: rest.duration,
              id,
            }
          );
        });

      return id;
    },
    success: (message: string, options?: ToastOptions) =>
      showToast("success", message, options),
    warning: (message: string, options?: ToastOptions) =>
      showToast("warning", message, options),
    wiggle: ToastPrimitive.toast.wiggle,
  }
);

// Styles
const titleVariants = cva("font-semibold leading-5", {
  variants: {
    variant: {
      default: "text-popover-foreground",
      error: "text-destructive",
      info: "text-info",
      loading: "text-popover-foreground",
      success: "text-success",
      warning: "text-warning",
    },
  },
});

const iconVariants = cva("size-5", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      error: "text-destructive",
      info: "text-info",
      loading: "text-muted-foreground",
      success: "text-success",
      warning: "text-warning",
    },
  },
});
