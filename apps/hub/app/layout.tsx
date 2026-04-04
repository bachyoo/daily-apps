import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daily Apps - 매일 새로운 무료 앱',
  description: '매일 하나씩 만드는 무료 웹앱 컬렉션. 타이머, 계산기, 게임 등 다양한 미니앱을 즐겨보세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
