export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <p className="text-5xl mb-4">📡</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">오프라인 상태입니다</h1>
        <p className="text-gray-500">인터넷 연결을 확인한 후 다시 시도해주세요.</p>
      </div>
    </div>
  );
}
