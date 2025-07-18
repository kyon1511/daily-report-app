"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetcher } from "../../lib/fetcher";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ページ読み込み時に、現在のユーザー名を取得してフォームに表示する
  useEffect(() => {
    if (user) {
      // TODO: /users/me から取得したユーザー情報で初期化するのが望ましい
      // setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      alert("ログインしていません。");
      setIsLoading(false);
      return;
    }
    if (!name.trim()) {
      alert("名前を入力してください。");
      setIsLoading(false);
      return;
    }

    try {
      // ステップ2で作成したAPIエンドポイントを呼び出す
      const updatedUser = await fetcher("/users/me", {
        method: "PUT",
        body: JSON.stringify({ name: name }),
      });

      alert("名前を更新しました！");
      console.log("更新後のユーザー情報:", updatedUser);
    } catch (error) {
      console.error("名前の更新に失敗しました:", error);
      alert("エラーが発生しました。名前を更新できませんでした。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>プロフィール編集</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">ユーザー名:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="新しい名前を入力"
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "更新中..." : "名前を更新"}
        </button>
      </form>
    </div>
  );
}
