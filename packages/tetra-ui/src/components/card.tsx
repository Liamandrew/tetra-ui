import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

// Components
export const Card = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn(
        "flex flex-col gap-6 rounded-2xl bg-card py-5 text-card-foreground",
        className
      )}
      data-slot="card"
      {...props}
    />
  );
};

export const CardHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("flex items-start gap-1 px-4", className)}
      data-slot="card-header"
      {...props}
    />
  );
};

export const CardTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <Text
      className={cn(
        "font-semibold text-foreground text-xl leading-none",
        className
      )}
      data-slot="card-title"
      {...props}
    />
  );
};

export const CardDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <Text
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
      {...props}
    />
  );
};

export const CardContent = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("px-4", className)}
      data-slot="card-content"
      {...props}
    />
  );
};

export const CardFooter = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      className={cn("flex items-center px-4", className)}
      data-slot="card-footer"
      {...props}
    />
  );
};
