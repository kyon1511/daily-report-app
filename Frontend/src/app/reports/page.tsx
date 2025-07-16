"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebase"; //Firebase の初期化コード
import { ROUTES } from "@/lib/routes"; //新規と編集ページの定義

type Report = {
  id: number;
  date: string;
  content: string;
};

export default function ReportsPage() {
  const [user, loadingAuth] = useAuthState(auth); //認証状態
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState<Error | null>(null);

  //テスト用　ログイン画面後削除
  useEffect(() => {
    if (loadingAuth) return;
    console.warn("未ログイン（開発中）"); //ログイン画面が繋がったら削除

    //ログイン画面が接続されたら解除
    // useEffect(() => {
    //   if (!loadingAuth && !user) {
    //     router.push("/");
    //     return;
    //   }
    // }, [user, loadingAuth, router]);

    // useEffect(() => {
    //   if (!user || loadingAuth) return;

    const fetchReports = async () => {
      try {
        // const token = await user.getIdToken(); //ログイン画面がつながれば解除する
        const token = user ? await user.getIdToken() : ""; //ログイン画面がつながれば削除する
        const res = await fetch(`${API_URL}/api/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("データ取得に失敗しました");

        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("取得エラー:", error); // エラーログ
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, loadingAuth, router, API_URL]);

  if (loadingAuth || loading) return <p>読み込み中です...</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">デイリーレポート一覧</h1>

      {error && <p className="text-red-500">{error.message}</p>}

      <div className="mb-4">
        <Link href={ROUTES.REPORT_NEW}>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            ＋ 新規作成
          </button>
        </Link>
      </div>

      {reports.length === 0 ? (
        <p>まだレポートがありません。</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id} className="p-4 border rounded shadow-sm">
              <strong>{report.date}</strong>
              <p>
                {report.content.length > 50
                  ? report.content.slice(0, 50) + "..."
                  : report.content}
              </p>

              <Link href={ROUTES.REPORT_EDIT(report.id)}>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 border rounded bg-gray-100"
                >
                  編集
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
