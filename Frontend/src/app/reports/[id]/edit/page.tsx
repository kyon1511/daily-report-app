'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

type Report = {
  id: number;
  report_date: string;
  learned_today: string;
  learning_improvement: string;
  challenge_for_tomorrow: string;
  impressions: string;
  other_notes?: string;
};

export default function EditReportPage() {
  const { id } = useParams();
  const [user, loadingAuth] = useAuthState(auth);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user || loadingAuth) return;

    const fetchReport = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/daily-reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('レポート取得に失敗しました');

        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, user, loadingAuth, API_URL]);

  if (loadingAuth || loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)', // 背景統一
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '768px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', // 新規作成と同じカード風
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#2563eb',
            marginBottom: '1.5rem',
          }}
        >
          レポート編集ページ
        </h1>

        {report && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = await user?.getIdToken();
                const res = await fetch(`${API_URL}/daily-reports/${id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(report),
                });

                if (!res.ok) throw new Error('更新に失敗しました');
                alert('更新しました！');
                router.push('/reports');
              } catch (err) {
                alert((err as Error).message);
              }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <label>
              日付:
              <input
                type="date"
                value={report.report_date.split('T')[0]}
                onChange={(e) =>
                  setReport({ ...report, report_date: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                }}
              />
            </label>

            <label>
              今日学んだこと:
              <textarea
                value={report.learned_today}
                onChange={(e) =>
                  setReport({ ...report, learned_today: e.target.value })
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              />
            </label>

            <label>
              改善点:
              <textarea
                value={report.learning_improvement}
                onChange={(e) =>
                  setReport({ ...report, learning_improvement: e.target.value })
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              />
            </label>

            <label>
              明日の課題:
              <textarea
                value={report.challenge_for_tomorrow}
                onChange={(e) =>
                  setReport({
                    ...report,
                    challenge_for_tomorrow: e.target.value,
                  })
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              />
            </label>

            <label>
              感想:
              <textarea
                value={report.impressions}
                onChange={(e) =>
                  setReport({ ...report, impressions: e.target.value })
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              />
            </label>

            <label>
              その他メモ:
              <textarea
                value={report.other_notes || ''}
                onChange={(e) =>
                  setReport({ ...report, other_notes: e.target.value })
                }
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              更新する
            </button>

            <button
              type="button"
              style={{
                backgroundColor: '#dc2626', // 赤系
                color: '#fff',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
              onClick={async () => {
                if (!confirm('本当に削除しますか？')) return;
                try {
                  const token = await user?.getIdToken();
                  const res = await fetch(`${API_URL}/daily-reports/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (!res.ok) throw new Error('削除に失敗しました');
                  alert('削除しました');
                  router.push('/reports');
                } catch (err) {
                  alert((err as Error).message);
                }
              }}
            >
              削除する
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
