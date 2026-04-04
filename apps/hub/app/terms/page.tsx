import { Footer } from '@daily-apps/shared';

export const metadata = { title: '이용약관 | Daily Apps' };

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">이용약관</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. 서비스 이용</h2>
            <p>Daily Apps에서 제공하는 모든 앱은 무료로 이용할 수 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">2. 면책 조항</h2>
            <p>앱 사용으로 인한 직접적 또는 간접적 손해에 대해 책임지지 않습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">3. 서비스 변경</h2>
            <p>사전 고지 없이 서비스를 변경하거나 중단할 수 있습니다.</p>
          </section>
        </div>
      </main>
      <Footer appName="Daily Apps" />
    </div>
  );
}
