import { ToolPageHeader } from '@/components/tool/tool-page-header';
import { UuidGenerator } from '@/features/uuid/uuid-generator.client';

export default function UuidPage() {
  return (
    <>
      <ToolPageHeader
        eyebrow="Identifiers / generate"
        title="UUID Generator"
        description="Create random v4 UUIDs locally for development and testing."
      />
      <UuidGenerator />
    </>
  );
}
