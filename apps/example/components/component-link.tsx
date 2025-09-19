import { Button } from '@repo/tetra-ui/components/button';
import { type Href, useRouter } from 'expo-router';

type ComponentLinkProps = {
  href: Href;
  children: string;
};

export default function ComponentLink({ href, children }: ComponentLinkProps) {
  const router = useRouter();

  return (
    <Button onPress={() => router.push(href)} variant="link">
      {children}
    </Button>
  );
}
