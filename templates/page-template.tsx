'use client';

import { AppLayout } from '@daily-apps/shared';

export default function App() {
  return (
    <AppLayout appName="__APP_NAME__">
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">🚀 __APP_NAME__</h2>
        <p className="text-gray-500">여기에 앱을 만드세요!</p>
        <p className="text-sm text-gray-400 mt-2">이 파일을 편집하세요</p>
      </div>
    </AppLayout>
  );
}
