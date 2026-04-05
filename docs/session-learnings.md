# Daily Apps Platform — Session Learnings

> 2026-04-05 첫 개발 세션에서 배운 교훈과 실수. 다음 개발 시 반드시 참고.

---

## 아키텍처 결정

### 단일 Next.js 프로젝트 구조 채택
- **결정:** 개별 앱을 독립 Next.js 프로젝트가 아닌, Hub의 `app/apps/day-XXX/page.tsx` 페이지로 만듦
- **이유:** Vercel Hobby 플랜에서 단일 프로젝트로 관리 가능, 서브도메인 DNS 설정 불필요, 배포가 훨씬 단순
- **교훈:** 처음에 독립 프로젝트로 설계했다가 리뷰에서 라우팅 모순 발견 → 단일 프로젝트로 재설계. **배포 전략을 먼저 결정하고 아키텍처를 맞춰야 함**

### 앱 커스텀 레이아웃 시 주의
- **실수:** 타이머 리디자인할 때 `AppLayout`을 빼고 전체 커스텀 UI를 만들었더니 **광고 영역(AdBanner)이 사라짐**
- **교훈:** 커스텀 레이아웃을 쓸 때도 반드시 `<AdBanner />`를 포함할 것. 수익화 컴포넌트는 빠뜨리면 안 됨

---

## 기술적 실수 & 해결

### 1. ESM vs CJS 충돌 (Tailwind config)
- **문제:** `theme.ts`를 ESM(`export const`)으로 만들었는데, `tailwind.config.js`에서 `require()`로 불러오면 실패
- **해결:** `theme.js`로 변경하고 `module.exports` 사용 (CJS)
- **원칙:** Tailwind config는 Node.js CJS 컨텍스트에서 실행됨. 테마 파일은 항상 CJS로.

### 2. @serwist/next + Next.js 16 Turbopack 비호환
- **문제:** `@serwist/next`의 webpack 플러그인이 Next.js 16의 기본 Turbopack 모드와 호환 안 됨
- **해결:** `next.config.js`에서 serwist 래퍼 제거, `turbopack: {}` 추가
- **현재 상태:** PWA 서비스워커 비활성화 상태. serwist 업데이트 시 재적용 필요
- **참고:** `app/sw.ts`는 tsconfig.json의 exclude에 추가해야 타입 에러 방지

### 3. macOS grep -oP 미지원
- **문제:** `grep -oP`(Perl regex)는 macOS BSD grep에서 지원 안 됨
- **해결:** `sed 's/day-\([0-9]*\).*/\1/'` 같은 포터블 방식 사용
- **원칙:** 스크립트 작성 시 macOS/Linux 호환을 항상 고려. `sed -i`도 macOS는 `sed -i ''`, Linux는 `sed -i`로 다름

### 4. PWA 아이콘 파일 누락
- **문제:** `manifest.ts`에 아이콘 경로를 명시했지만 실제 PNG 파일이 `public/icons/`에 없었음
- **증상:** PWABuilder 분석이 무한 로딩, 404 에러
- **해결:** macOS `qlmanage`로 SVG→PNG 변환, `sips`로 리사이즈
- **원칙:** manifest에 참조하는 에셋은 반드시 실제 파일이 존재해야 함

### 5. PATH 환경변수 문제
- **문제:** Claude Code 세션에서 `/opt/homebrew/bin`이 PATH에 없어 `pnpm`, `npm`, `brew` 등 못 찾음
- **해결:** 명령어마다 `export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"` 추가
- **참고:** `preview_start`용 launch.json에서는 `/bin/bash -c "export PATH=... && cd ... && pnpm dev"` 패턴 사용

### 6. Vercel 모노레포 배포 설정
- **문제:** Vercel이 루트에서 Next.js를 감지 못하고 빌드 실패 (`No Output Directory named "public"`)
- **해결:** `vercel.json` 추가:
  ```json
  {
    "buildCommand": "pnpm --filter hub build",
    "outputDirectory": "apps/hub/.next",
    "installCommand": "pnpm install",
    "framework": "nextjs"
  }
  ```
- **원칙:** 모노레포는 항상 `vercel.json`으로 빌드 대상을 명시해야 함

### 7. GitHub CLI + Vercel 연결 이슈
- **문제:** `vercel link`에서 GitHub 연결 실패 ("need Login Connection")
- **해결:** `vercel deploy --prod`로 직접 배포 (GitHub 연동 없이)
- **참고:** GitHub 자동 배포를 원하면 Vercel 대시보드에서 수동으로 GitHub repo 연결 필요

---

## 프로젝트 구조 요약

```
daily-apps/
├── packages/shared/          # 공통 컴포넌트 (AppLayout, AdBanner, Footer, SEO, Analytics)
│   └── styles/theme.js       # CJS! (Tailwind 호환)
├── apps/hub/                 # 단일 Next.js 앱 (Vercel 배포 대상)
│   ├── app/apps/day-XXX/     # 각 앱은 여기에 page.tsx로 존재
│   └── data/apps.json        # 앱 레지스트리
├── templates/page-template.tsx  # 새 앱 템플릿 (단일 파일)
├── scripts/create-app.sh     # 앱 자동 생성
└── vercel.json               # 모노레포 배포 설정
```

## 배포 정보

- **GitHub:** https://github.com/bachyoo/daily-apps
- **Vercel:** https://daily-apps-tawny.vercel.app
- **Vercel 계정:** bachyoo-5428
- **GitHub 계정:** bachyoo

## 매일의 워크플로우

```bash
cd daily-apps
./scripts/create-app.sh day-XXX-name   # 앱 생성
# apps/hub/app/apps/day-XXX-name/page.tsx 편집
pnpm dev                                # 로컬 확인
pnpm --filter hub build                 # 빌드 확인
git add . && git commit -m "feat(day-XXX): add app-name"
git push
vercel deploy --prod                    # 또는 Vercel GitHub 자동 배포 설정
```

## 다음 세션 TODO

- [ ] serwist PWA 재적용 (Next.js 16 호환 버전 나오면)
- [ ] Vercel GitHub 자동 배포 연결 (대시보드에서)
- [ ] 커스텀 도메인 연결
- [ ] Day 002 앱 개발 (주사위 굴리기)
- [ ] Google Play 출시 (PWABuilder로)
- [ ] AdSense 신청 (앱 5-10개 배포 후)
