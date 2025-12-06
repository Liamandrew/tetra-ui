import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shadcn-ui/components/tabs";
import { cn } from "@repo/shadcn-ui/lib/utils";
import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import { getPreviewComponentCode } from "@/lib/preview-source";

type ComponentPreviewProps = {
  name: string;
  type: "png" | "gif";
};

export async function ComponentPreview({ name, type }: ComponentPreviewProps) {
  const code = getPreviewComponentCode(name) ?? "";

  return (
    <Tabs className="relative w-full" defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent
        className="flex flex-row justify-center gap-12"
        value="preview"
      >
        <PreviewImage
          className="hidden lg:block"
          name={name}
          platform="ios"
          type={type}
        />
        <PreviewImage
          className="hidden lg:block"
          name={name}
          platform="android"
          type={type}
        />

        <Tabs className="lg:hidden" defaultValue="ios">
          <TabsContent value="ios">
            <PreviewImage name={name} platform="ios" type={type} />
          </TabsContent>
          <TabsContent value="android">
            <PreviewImage name={name} platform="android" type={type} />
          </TabsContent>

          <TabsList className="self-center">
            <TabsTrigger value="ios">iOS</TabsTrigger>
            <TabsTrigger value="android">Android</TabsTrigger>
          </TabsList>
        </Tabs>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={code} lang="tsx" />
      </TabsContent>
    </Tabs>
  );
}

type PreviewImageProps = ComponentPreviewProps & {
  className?: string;
  platform: "ios" | "android";
};

const PreviewImage = ({
  name,
  type,
  className,
  platform,
}: PreviewImageProps) => {
  return (
    <Image
      alt={name}
      className={cn(
        "rounded-3xl",
        platform === "android" && "bg-white pt-2.5",
        className
      )}
      height={684}
      src={`/previews/${platform}-${name}.${type}`}
      unoptimized={type === "gif"}
      width={312}
    />
  );
};
