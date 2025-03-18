# 아토케토 무인 주문 웹앱

이 프로젝트는 고객이 매장에서 직접 웹앱으로 주문서를 작성하여 출력한 후, 해당 주문서로 결제를 진행할 수 있는 무인 주문 시스템입니다.

## 주요 기능

- 고객이 메뉴를 선택하고 원하는 옵션을 조합하여 주문서 생성
- 생성된 주문서를 매장에서 출력 (프린터 인쇄)
- 관리자가 메뉴 및 옵션을 관리할 수 있는 관리자 페이지 제공

## 기술 스택

- 프론트엔드: Next.js, TypeScript, TailwindCSS
- 백엔드: Supabase
- 주문서 출력: react-to-print

## 설치 방법

1. 프로젝트 클론:
```bash
git clone https://github.com/bong9510/atoketo-order.git
cd atoketo-order
```

2. 의존성 설치:
```bash
npm install
```

3. `.env.local` 파일 생성 및 Supabase 정보 설정:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 개발 서버 실행:
```bash
npm run dev
```

## 사용 방법

### 고객 사용
1. 메인 페이지에서 '주문하기' 선택
2. 원하는 메뉴와 옵션 선택
3. 주문서 출력 버튼 클릭
4. 출력된 주문서를 매장 카운터에 제시하고 결제 진행

### 관리자 사용
1. 메인 페이지에서 '관리자' 선택
2. 관리자 비밀번호 입력 (기본: admin1234)
3. 메뉴 또는 옵션 관리 탭에서 항목 추가, 수정, 삭제 가능

## 프로젝트 구조

```
atoketo-order/
├── public/          # 정적 파일
├── src/             # 소스 코드
│   ├── components/  # 재사용 가능한 컴포넌트
│   ├── lib/         # 유틸리티 함수 및 서비스
│   ├── pages/       # 페이지 컴포넌트
│   ├── styles/      # 전역 스타일
│   └── types/       # TypeScript 타입 정의
├── .env.local       # 환경 변수 (git에서 무시됨)
├── package.json     # 프로젝트 의존성 및 스크립트
└── README.md        # 프로젝트 설명
```

## 배포

이 프로젝트는 Vercel 또는 Netlify와 같은 정적 웹 호스팅 서비스에 배포할 수 있습니다.

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다. 