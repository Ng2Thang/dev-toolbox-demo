import { HomeTopbar } from '@/components/layout/home-topbar';
import { JsonFormatter } from '@/features/json/json-formatter.client';

export default function JsonPage() {
  return (
    <>
      <HomeTopbar />
      <JsonFormatter />
    </>
  );
}
