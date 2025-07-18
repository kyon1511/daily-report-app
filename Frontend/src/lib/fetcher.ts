
import { auth } from "./firebase";


export const fetcher = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {

  try {
    // 認証トークンの準備
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    // 標準のヘッダーを作成
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // APIへのリクエスト実行
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers,
    });

    // エラーハンドリング
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.detail || JSON.stringify(errorBody);
      } catch (e) {}
      throw new Error(errorMessage);
    }

    // 成功時のレスポンス処理
    const responseText = await response.text();
    return responseText ? (JSON.parse(responseText) as T) : (null as T);
  } catch (error) {
    console.error("Fetcher Error:", error);
    throw error;
  }
};
