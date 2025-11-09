import Link from "next/link";
import { registry } from "@/lib/registry";

export function ComponentsList() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {Object.values(registry).map((item) => {
        if (item.type !== "registry:ui") {
          return null;
        }

        return (
          <Link
            className="inline-flex items-center gap-2 font-medium text-lg underline-offset-4 hover:underline md:text-base"
            href={`components/${item.name}`}
            key={item.name}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
