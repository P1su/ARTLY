# **Artly**

> 이 문서는 Artly 프로젝트의 프론트엔드·백엔드·AI(도슨트 & 챗봇) 모듈에 대한 전반적인 구조를 한눈에 살펴볼 수 있도록 작성되었습니다.  
> 각 모듈은 독립적으로 동작하지만, 동일한 도메인 모델과 REST API 규약을 공유합니다.



## **1. 프로젝트 개요**

**목표**: 생성 AI와 빅데이터 기술을 활용해 전시·작품·작가 정보를 제공하고, 관람객 참여(도슨트·챗봇) 경험을 향상시키는 예술 콘텐츠 플랫폼

**모듈 구성**:

1. `client` (React + Vite) : 웹/모바일 SPA  
2. `backend` (PHP + Slim MVC) : REST API & Swagger  
3. `ai` (OpenAI & Google TTS) : 음성 도슨트, GPT 기반 챗봇 서비스


## **2. 디렉토리 구조**
>> AI 실제 코드는 프론트, 백엔드에 추가되어 있습니다.

```
ARTTLY/
├─ client/                      # 프론트엔드 (React + Vite)
│  └─ src/
│     ├─ apis/                 # Axios 인스턴스 & API 래퍼
│     ├─ assets/              # 이미지 · SVG · 폰트
│     │  ├─ images/
│     │  └─ svg/
│     ├─ components/          # 공통 UI 컴포넌트
│     ├─ hooks/               # 공통 커스텀 훅
│     │  ├─ common/
│     │  └─ queries/
│     ├─ layouts/             # 레이아웃 + 중첩 라우팅
│     ├─ pages/
│     │  ├─ Domain1/          # 도메인 전용 UI
│     │  └─ Domain2/
│     ├─ router/              # 페이지 라우팅 정의
│     ├─ store/               # 전역 상태 관리 (Context 등)
│     ├─ styles/              # GlobalStyle, Theme 설정
│     ├─ types/               # 타입 정의
│     └─ utils/               # 유틸리티 함수, 상수
│
├─ backend/                    # 백엔드 (PHP + Slim)
│  ├─ config/                 # DB, 메일, JWT 설정
│  ├─ controllers/           # REST API 컨트롤러
│  ├─ docs/                  # Swagger 문서 JSON
│  ├─ middlewares/           # 인증, 권한 제어
│  ├─ models/                # DB 접근 (DAO)
│  ├─ routes/                # API 라우트 정의
│  ├─ vendor/                # Composer 의존성
│  ├─ .env                   # 환경 변수
│  ├─ index.php              # 애플리케이션 진입점
│  └─ migrate.php            # DB 마이그레이션 스크립트
│
└─ ai/                        # 인공지능 서비스 (선택)
   ├─ docent/                # Google TTS 도슨트
   └─ chatbot/               # GPT 챗봇 의도 분석 & 응답
```
