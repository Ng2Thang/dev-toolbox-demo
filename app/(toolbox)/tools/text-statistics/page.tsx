import { HomeTopbar } from '@/components/layout/home-topbar';
import { TextStatistics } from '@/features/text-statistics/text-statistics.client';

export default function TextStatisticsPage() {
  return (
    <>
      <HomeTopbar />
      <div className="text-statistics-head">
        <p className="eyebrow">Text / analyze</p>
        <h1>
          Text Statistics <span className="heading-icon">▤</span>
        </h1>
        <p>Detailed character, word, and line counting with real-time analysis.</p>
      </div>
      <TextStatistics />
    </>
  );
}
