import { Footer } from '@daily-apps/shared';

export const metadata = { title: '개인정보처리방침 | Daily Apps' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. 수집하는 개인정보</h2>
            <p>Daily Apps는 서비스 이용 시 방문 페이지, 접속 시간, 기기 유형, 브라우저 종류를 자동으로 수집할 수 있습니다 (Vercel Analytics).</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">2. 이용 목적</h2>
            <p>수집된 정보는 서비스 개선 및 광고 제공 목적으로만 사용됩니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">3. 광고</h2>
            <p>본 서비스는 Google AdSense를 통해 광고를 제공하며, Google의 쿠키 정책이 적용됩니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">4. 문의</h2>
            <p>개인정보 관련 문의: dailyapps@example.com</p>
          </section>
        </div>
      </main>
      <Footer appName="Daily Apps" />
    </div>
  );
}
