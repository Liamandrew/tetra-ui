import { buttonVariants } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex flex-col items-center justify-center gap-2.5">
        <h1 className="font-bold text-4xl leading-tight tracking-tight">
          Delightful Components for React Native
        </h1>
        <p className="max-w-4xl text-balance text-muted-foreground">
          The foundations for a clean, accessible and modern component library
          that is purpose built for React Native.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Link className={buttonVariants()} href="/docs">
          Get Started
        </Link>
        <Link
          className={buttonVariants({ variant: 'ghost' })}
          href="/docs/components"
        >
          Browse Components
        </Link>
      </div>
    </main>
  );
}
