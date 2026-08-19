import { ToolPageHeader } from '@/components/tool/tool-page-header';
import { JwtDecoder } from '@/features/jwt/jwt-decoder.client';

export default function JwtPage() {
  return (
    <>
      <ToolPageHeader
        eyebrow="Security / decode"
        title="JWT Decoder"
        description="Inspect header and payload claims locally. Signature verification is intentionally not performed."
      />
      <JwtDecoder />
    </>
  );
}
