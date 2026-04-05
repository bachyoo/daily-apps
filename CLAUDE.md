## Daily Apps Platform

### "개발하자!" 트리거

사용자가 "개발하자!" 라고 하면:

1. **superpowers 스킬 로드** — `using-superpowers` 스킬 실행
2. **세션 학습 내용 읽기** — `docs/session-learnings.md` 파일을 읽고 이전 실수/교훈을 숙지
3. **프로젝트 현황 파악** — `apps/hub/data/apps.json`에서 현재 앱 목록 확인, 다음 Day 번호 확인
4. **개발 시작** — brainstorming 스킬로 다음 앱 기획 또는 사용자 요청에 따라 작업

### 개발 워크플로우 (superpowers 방식)

- 새 기능/앱 → `brainstorming` → `writing-plans` → `subagent-driven-development` 또는 `executing-plans`
- 간단한 수정 → 직접 수정 후 빌드 확인 → 배포
- 항상 `pnpm --filter hub build` 로 빌드 확인 후 push
- 배포: `vercel deploy --prod` (PATH에 /opt/homebrew/bin 포함 필요)

### 프로젝트 구조 핵심

- **단일 Next.js 앱** — `apps/hub/`이 Vercel 배포 대상
- **개별 앱** — `apps/hub/app/apps/day-XXX-name/page.tsx` (독립 Next.js가 아님!)
- **새 앱 생성** — `./scripts/create-app.sh day-XXX-name`
- **공유 컴포넌트** — `packages/shared/` (AppLayout, AdBanner, Footer, SEO, Analytics)
- **Tailwind 테마** — `packages/shared/styles/theme.js` (CJS! require 호환)

### 배포 정보

- GitHub: https://github.com/bachyoo/daily-apps
- Vercel: https://daily-apps-tawny.vercel.app
- 계정: bachyoo / bachyoo-5428

### 주의사항 (실수 방지)

- Tailwind 테마는 CJS (module.exports) — ESM 쓰면 빌드 깨짐
- 커스텀 레이아웃 만들 때 AdBanner 빠뜨리지 말 것
- macOS 스크립트: grep -oP 사용 금지, sed -i '' (macOS) vs sed -i (Linux) 구분
- PWA manifest 아이콘 = 실제 파일 필수
- serwist PWA는 현재 비활성화 (Next.js 16 Turbopack 비호환)
