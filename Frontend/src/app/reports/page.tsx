'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/firebase'; //Firebase の初期化コード
import { ROUTES } from '@/lib/routes'; //新規と編集ページの定義

type Report = {
  id: number;
  report_date: Date;
};

export default function ReportsPage() {
  const [user, loadingAuth] = useAuthState(auth); //認証状態
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/');
      return;
    }
  }, [user, loadingAuth, router]);

  useEffect(() => {
    if (!user || loadingAuth) return;

    const fetchReports = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/daily-reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('データ取得に失敗しました');

        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error('取得エラー:', error); // エラーログ
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, loadingAuth, router, API_URL]);

  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        <p>読み込み中です...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '768px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
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
          Daily Report
        </h1>

        {error && (
          <p
            style={{
              color: '#e28080ff',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {error.message}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <Link href={ROUTES.REPORT_NEW}>
            <button
              style={{
                width: 220,
                height: 50,
                fontSize: '1.2rem',
                backgroundColor: '#6e6b6bff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#7a7878ff')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#4a4949ff')
              }
            >
              ＋ 新規作成
            </button>
          </Link>
        </div>

        {reports.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            まだレポートがありません。
          </p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              gap: '1rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {reports.map((report) => (
              <li
                key={report.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '1rem',
                  backgroundColor: '#f9fafb',
                  transition: 'box-shadow 0.3s',
                  cursor: 'default',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 5px 15px rgba(0,0,0,0.1)')
                }
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  {/* <span style={{ fontWeight: "500", color: "#374151" }}>
                    {new Date(report.report_date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}

                  </span>

                  {/* 編集リンク */}
                  <Link
                    href={`/reports/${report.id}/edit`}
                    style={{
                      fontWeight: '500',
                      color: '#2563eb',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    編集
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
