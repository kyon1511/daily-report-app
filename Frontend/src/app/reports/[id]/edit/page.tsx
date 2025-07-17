'use client';

import React from 'react';
import{ useRouter } from 'next/navigation';
import{ useEffect } from 'react';

export default function EditReportPage() {
    const router = useRouter();

    useEffect(() => {
        console.log('編集ページにアクセスされました');

    }, []);

    return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">レポート編集ページ</h1>
      <p>ここに編集フォームを作成していきます。</p>
    </main>
  );
}