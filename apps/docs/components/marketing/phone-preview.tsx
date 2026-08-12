import { cn } from "@repo/shadcn-ui/lib/utils";
import Image from "next/image";

type PhonePreviewProps = {
  alt: string;
  className?: string;
  eager?: boolean;
  name: string;
};

export function PhonePreview({
  alt,
  className,
  eager = false,
  name,
}: PhonePreviewProps) {
  return (
    <Image
      alt={alt}
      className={cn("select-none object-contain", className)}
      decoding={eager ? "sync" : "async"}
      fetchPriority={eager ? "high" : "low"}
      fill
      loading={eager ? "eager" : "lazy"}
      sizes="(max-width: 1023px) 11rem, 14rem"
      src={`/static/marketing/${name}-400.webp`}
    />
  );
}
