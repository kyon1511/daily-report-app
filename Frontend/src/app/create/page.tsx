//TODO バリデーション実装する
"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetcher } from "../../lib/fetcher";

// 日報データの型を定義
interface DailyReportFormState {
  report_date: string;
  learned_today: string;
  learning_improvement: string;
  challenge_for_tomorrow: string;
  impressions: string;
  other_notes: string;
}

// スタイル定義（変更なし）
const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "2rem",
    background: "#f0f2f5",
  },
  formContainer: {
    width: "100%",
    maxWidth: "600px",
    padding: "24px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",

    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
    minHeight: "100px",

    resize: "vertical" as const,
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    borderRadius: "4px",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
};

export default function CreateDailyReportPage() {
  const { user, loading } = useAuth();

  // 日付の初期値を設定
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const today = `${yyyy}-${mm}-${dd}`;

  const [formData, setFormData] = useState<DailyReportFormState>({
    report_date: today,
    learned_today: "",
    learning_improvement: "",
    challenge_for_tomorrow: "",
    impressions: "",
    other_notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("送信データ", formData);
    if (!user) {
      alert("ログインしていません。");
      return;
    }

    try {
      await fetcher("/daily-reports", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      alert("日報が正常に送信されました！");
    } catch (error) {
      console.error("日報の送信に失敗しました:", error);
      alert("エラーが発生しました。日報を送信できませんでした。");
    }
  };

  if (loading) {
    return <div>認証状態を確認中...</div>;
  }
  if (!user) {
    return <div>ログインしていません。</div>;
  }


  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "1.8rem",
          }}
        >
          日報作成
        </h1>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <Link href="/reports">
            <button
              type="button"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f3f4f6",
                color: "#333",
                cursor: "pointer",
              }}
            >
              一覧画面に戻る
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="report_date" style={styles.label}>
              報告日
            </label>
            <input
              type="date"
              id="report_date"
              name="report_date"
              value={formData.report_date}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="learned_today" style={styles.label}>
              今日学んだこと
            </label>
            <textarea
              id="learned_today"
              name="learned_today"
              value={formData.learned_today}
              onChange={handleInputChange}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="learning_improvement" style={styles.label}>
              今日の学びの改善点
            </label>

            <textarea
              id="learning_improvement"
              name="learning_improvement"
              value={formData.learning_improvement}
              onChange={handleInputChange}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="challenge_for_tomorrow" style={styles.label}>
              明日チャレンジすること
            </label>

            <textarea
              id="challenge_for_tomorrow"
              name="challenge_for_tomorrow"
              value={formData.challenge_for_tomorrow}
              onChange={handleInputChange}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="impressions" style={styles.label}>
              ひとこと(感想)
            </label>

            <textarea
              id="impressions"
              name="impressions"
              value={formData.impressions}
              onChange={handleInputChange}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="other_notes" style={styles.label}>
              その他（任意）
            </label>

            <textarea
              id="other_notes"
              name="other_notes"
              value={formData.other_notes}
              onChange={handleInputChange}
              style={styles.textarea}
            />
          </div>

          <div>
            <button type="submit" style={styles.button}>
              提出する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
