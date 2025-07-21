'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchReportById } from '@/lib/api/report';

export default function EditReportPage() {
  const { id } = useParams(); // URLの[id]を取得
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReport = async () => {
      try {
        console.log('取得したid:', id);

        if (typeof id === 'string') {
          const data = await fetchReportById(id);
          setReport(data);
        }
      } catch (error) {
        console.error('レポート取得エラー:', error);
        alert('レポートの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    getReport();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      <h1>レポート編集ページ</h1>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
}
