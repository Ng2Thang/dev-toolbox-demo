import { HomeTopbar } from '@/components/layout/home-topbar';
import { EncoderDecoder } from '@/features/encode-decode/encoder-decoder.client';

export default function EncodeDecodePage() {
  return (
    <>
      <HomeTopbar />
      <header className="encoder-screen-head">
        <h1>Encoder / Decoder</h1>
        <p>Convert common UTF-8 text formats locally.</p>
      </header>
      <EncoderDecoder />
    </>
  );
}
