import { ToolPageHeader } from '@/components/tool/tool-page-header';
import { StringConcatenator } from '@/features/concat/string-concatenator.client';

export default function ConcatenatePage() {
  return (
    <>
      <ToolPageHeader
        eyebrow="Text / transform"
        title="Concatenate String"
        description="Combine line-separated values using any separator."
      />
      <StringConcatenator />
    </>
  );
}
