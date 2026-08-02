import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Image, type ImageProps, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { cn } from "@/lib/utils";

// Types
type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>["size"]>;
type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";

type AvatarImageKeyStatus = {
  status: AvatarImageStatus;
  srcKey: string;
};

type AvatarContextValue = {
  size: AvatarSize;
  imageKeyStatus: AvatarImageKeyStatus;
  setImageKeyStatus: (status: AvatarImageKeyStatus) => void;
};

type AvatarProps = React.ComponentProps<typeof View> &
  VariantProps<typeof avatarVariants> & {
    children?: React.ReactNode;
  };

type AvatarImageProps = ImageProps;

type AvatarFallbackProps = React.ComponentProps<typeof View> & {
  children?: React.ReactNode;
};

type AvatarBadgeProps = React.ComponentProps<typeof View> & {
  children?: React.ReactNode;
};

type ClassNameElement = React.ReactElement<{ className?: string }>;

// Context
const AvatarContext = createContext<AvatarContextValue | null>(null);

const useAvatarContext = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("Avatar components must be used within an Avatar");
  }
  return context;
};

const StyledImage = withUniwind(Image);

// Components
export const Avatar = ({
  children,
  className,
  size = "default",
  ...props
}: AvatarProps) => {
  const [imageKeyStatus, _setImageKeyStatus] = useState<AvatarImageKeyStatus>({
    srcKey: "",
    status: "idle",
  });

  const setImageKeyStatus = useCallback((payload: AvatarImageKeyStatus) => {
    _setImageKeyStatus((prev) => {
      const isSameKey = payload.srcKey === prev.srcKey;

      if (prev.status === "loaded" && isSameKey) {
        return prev;
      }

      return payload;
    });
  }, []);

  const ctx = useMemo(
    () => ({
      imageKeyStatus,
      setImageKeyStatus,
      size: size ?? "default",
    }),
    [imageKeyStatus, size, setImageKeyStatus]
  );

  return (
    <AvatarContext.Provider value={ctx}>
      <View
        className={cn(avatarVariants({ className, size }))}
        data-slot="avatar"
        {...props}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
};

export const AvatarImage = ({
  alt,
  className,
  onError,
  onLoad,
  onLoadStart,
  source,
  src,
  ...props
}: AvatarImageProps) => {
  const { setImageKeyStatus } = useAvatarContext();

  const resolvedSource = source ?? (src ? { uri: src } : undefined);
  const resolvedSourceKey = JSON.stringify(resolvedSource);

  if (!resolvedSource) {
    return null;
  }

  return (
    <StyledImage
      accessibilityLabel={alt}
      className={cn("aspect-square size-full rounded-full", className)}
      data-slot="avatar-image"
      onError={(event) => {
        setImageKeyStatus({ srcKey: resolvedSourceKey, status: "error" });
        onError?.(event);
      }}
      onLoad={(event) => {
        setImageKeyStatus({ srcKey: resolvedSourceKey, status: "loaded" });
        onLoad?.(event);
      }}
      onLoadStart={() => {
        setImageKeyStatus({ srcKey: resolvedSourceKey, status: "loading" });
        onLoadStart?.();
      }}
      source={resolvedSource}
      {...props}
    />
  );
};

export const AvatarFallback = ({
  children,
  className,
  ...props
}: AvatarFallbackProps) => {
  const { imageKeyStatus, size } = useAvatarContext();

  if (imageKeyStatus.status === "loaded") {
    return null;
  }

  return (
    <View
      className={cn(
        "absolute inset-0 flex size-full items-center justify-center rounded-full bg-muted",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    >
      {Children.map(children, (child) => {
        if (typeof child === "string") {
          return (
            <Text
              className={cn(
                "font-medium text-muted-foreground",
                size === "sm" ? "text-xs" : "text-sm"
              )}
            >
              {child}
            </Text>
          );
        }

        return child;
      })}
    </View>
  );
};

export const AvatarBadge = ({
  children,
  className,
  ...props
}: AvatarBadgeProps) => {
  const { size } = useAvatarContext();

  return (
    <View
      className={cn(avatarBadgeVariants({ className, size }))}
      data-slot="avatar-badge"
      {...props}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child;
        }

        const element = child as ClassNameElement;

        return cloneElement(element, {
          className: cn(
            size === "sm" ? "size-1.5" : "size-2",
            "text-primary-foreground",
            element.props.className
          ),
        });
      })}
    </View>
  );
};

export const AvatarGroup = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("flex flex-row items-center", className)}
      data-slot="avatar-group"
      {...props}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          return child;
        }

        const element = child as ClassNameElement;
        const overlapClassName = index > 0 ? "-ml-2" : undefined;

        return cloneElement(element, {
          className: cn(
            overlapClassName,
            "border-2 border-background",
            element.props.className
          ),
        });
      })}
    </View>
  );
};

export const AvatarGroupCount = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View> & {
  children?: React.ReactNode;
}) => {
  return (
    <View
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted",
        className
      )}
      data-slot="avatar-group-count"
      {...props}
    >
      {Children.map(children, (child) => {
        if (typeof child === "string") {
          return (
            <Text className="font-medium text-muted-foreground text-sm">
              {child}
            </Text>
          );
        }

        return child;
      })}
    </View>
  );
};

// Styles
const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full border border-border",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "size-8",
        lg: "size-10",
        sm: "size-6",
      },
    },
  }
);

const avatarBadgeVariants = cva(
  "absolute z-10 flex items-center justify-center rounded-full border-2 border-background bg-primary",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "right-0 bottom-0 size-2.5",
        lg: "right-0 bottom-0 size-3",
        sm: "right-0 bottom-0 size-2",
      },
    },
  }
);
