//TODO バリデーション実装する
"use client";

import styles from "../../page.module.css";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../lib/FirebaseConfig";
import Image from "next/image";

export default function LoginHome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //フォーム送信時にページリロードを防ぎ、Firebaseでログイン処理を実行
  const doLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("ログインOK!");
        console.log(user);
      })
      .catch((error) => {
        alert("ログイン失敗");
        console.log(error);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "100vh",
        padding: "0 10vw",
        background: "#f0f2f5",
      }}
    >
      <div className={styles.card}>
        <h4>Ms. Engineer </h4>
        <h1>Daily Report管理帳</h1>
        <Image
          src="/top-icon.png"
          alt="トップページアイコン"
          width={250}
          height={250}
        />
      </div>

      <div
        style={{
          maxWidth: "400px",
          margin: "40px auto",
          padding: "24px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        <form onSubmit={doLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              メールアドレス：
              <input
                type="email"
                name="email"
                style={{
                  height: 50,
                  fontSize: "1.2rem",
                  display: "block",
                  width: "100%",
                }}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              パスワード：
              <input
                type="password"
                name="password"
                style={{
                  height: 50,
                  fontSize: "1.2rem",
                  display: "block",
                  width: "100%",
                }}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            style={{ width: 220, height: 50, fontSize: "1.2rem" }}
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
