import { auth } from '../lib/firebase';

/**
 * APIと通信するための汎用的なfetcher関数
 * @param url APIのエンドポイント（例: '/users/me'）
 * @param options fetchのオプション（method, body など）
 * @returns レスポンスのJSONデータ
 */
export const fetcher = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // 1. 現在のユーザーからIDトークン（身分証明書）を取得
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  // 2. リクエストヘッダーを準備
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // 3. fetchでAPIを呼び出す
  const res = await fetch(url, {
    ...options,
    headers,
  });

  // 4. エラーハンドリング
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'APIリクエストに失敗しました');
  }

  // 5. 結果をJSONとして返す
  return res.json();
};
