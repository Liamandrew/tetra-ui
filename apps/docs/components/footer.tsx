import { buttonVariants } from "@repo/shadcn-ui/components/button";
import { siteConfig } from "@/lib/config";

export const Footer = () => {
  return (
    <footer className="container mx-auto flex items-center justify-center px-4 py-8">
      <span className="text-muted-foreground text-sm">
        Built by{" "}
        <a
          className={buttonVariants({
            variant: "link",
            className: "w-0 p-0",
          })}
          href={siteConfig.links.twitter}
        >
          Liam
        </a>{" "}
        for the community.
      </span>
    </footer>
  );
};
