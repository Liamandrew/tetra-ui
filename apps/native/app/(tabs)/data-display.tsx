import { Badge } from '@tetra-ui/native/components/badge';
import ComponentLink from '@/components/component-link';
import { ScreenScrollView } from '@/components/screen-scrollview';
import { Section } from '@/components/section';

export default function DataDisplay() {
  return (
    <ScreenScrollView>
      <Section title="Badge">
        <Badge>Badge</Badge>
        <ComponentLink href="/badge">View More</ComponentLink>
      </Section>
    </ScreenScrollView>
  );
}
