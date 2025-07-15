"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase"; // Firebase認証オブジェクト(作成する)

// デイリーレポートの型
type Report = {
  id: number;
  date: string;
  content: string;
};
//コンポーネントの状態管理
export default function ReportsPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ログイン状態とデータの取得
  useEffect(() => {
    if (loadingAuth) return;

    if (!user) {
      router.push("/"); // ログイン画面へ
      return;
    }

    const fetchReports = async () => {
      try {
        const token = await user.getIdToken(); // Firebaseトークン取得

        const res = await fetch("http://localhost:8000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("データ取得に失敗しました");

        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, loadingAuth, router]);

  if (loadingAuth || loading) return <p>読み込み中です...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h1>デイリーレポート一覧</h1>

      {/* 新規作成ボタン */}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/reports/new">
          <button
            style={{
              padding: "0.5rem 1rem",
              background: "#0070f3",
              color: "white",
              border: "none",
            }}
          >
            ＋ 新規作成
          </button>
        </Link>
      </div>

      {/* レポート一覧 */}
      {reports.length === 0 ? (
        <p>まだレポートがありません。</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reports.map((report) => (
            <li
              key={report.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <strong>{report.date}</strong>
              <p>{report.content.slice(0, 50)}...</p>

              <Link href={`/reports/edit/${report.id}`}>
                <button style={{ padding: "0.4rem 0.8rem" }}>編集</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
