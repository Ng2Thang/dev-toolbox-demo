import { ToolPageHeader } from '@/components/tool/tool-page-header';
import { JsonFormatter } from '@/features/json/json-formatter.client';

export default function JsonPage() {
  return (
    <>
      <ToolPageHeader
        eyebrow="Data / transform"
        title="JSON Formatter"
        description="Format and validate JSON without sending your payload anywhere."
      />
      <JsonFormatter />
    </>
  );
}
