import { ToolPageHeader } from '@/components/tool/tool-page-header';
import { TimestampConverter } from '@/features/timestamp/timestamp-converter.client';

export default function TimestampPage() {
  return (
    <>
      <ToolPageHeader
        eyebrow="Time / convert"
        title="Unix Timestamp"
        description="Translate Unix seconds or milliseconds into readable dates."
      />
      <TimestampConverter />
    </>
  );
}
