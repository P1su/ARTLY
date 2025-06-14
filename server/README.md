## ** 디렉토리 구조**

```
ARTLY/
└─ server/                        # 백엔드 서버 디렉토리 (PHP + Slim Framework)
   ├─ config/                    # 환경 설정 (DB 연결, JWT 등)
   │  └─ config.php
   │
   ├─ controllers/              # 컨트롤러 계층 - 요청별 로직 처리
   │  ├─ AnnouncementController.php
   │  ├─ ArtController.php
   │  ├─ ArtistController.php
   │  ├─ ArtlyApiDemoController.php
   │  ├─ AuthController.php
   │  ├─ BookController.php
   │  ├─ ChatController.php
   │  ├─ ExhibitionController.php
   │  ├─ GalleryController.php
   │  ├─ LikeController.php
   │  ├─ ReservationController.php
   │  ├─ SearchController.php
   │  ├─ SessionController.php
   │  └─ UserController.php
   │
   ├─ docs/                     # Swagger 문서 정의 JSON
   │  └─ swagger.json
   │
   ├─ middlewares/             # 미들웨어 - 인증/권한 제어 처리
   │  └─ AuthMiddleware.php
   │
   ├─ models/                  # 모델 계층 - DB 직접 접근 (DAO)
   │  ├─ AnnouncementModel.php
   │  ├─ ArtistModel.php
   │  ├─ ArtModel.php
   │  ├─ BookModel.php
   │  ├─ ChatModel.php
   │  ├─ ExhibitionModel.php
   │  ├─ GalleryModel.php
   │  ├─ LikeModel.php
   │  ├─ ReservationModel.php
   │  ├─ SessionModel.php
   │  └─ UserModel.php
   │
   ├─ routes/                  # API 라우팅 정의
   │  └─ routes.php
   │
   ├─ vendor/                  # Composer 패키지 자동 설치 디렉토리 (의존성)
   │  └─ ...
   │
   ├─ .env                     # 환경 변수 설정 (DB 정보, 포트 등)
   ├─ .gitignore               # Git 추적 제외 파일 설정
   ├─ .htaccess                # Apache 웹서버 설정
   ├─ composer.json            # Composer 의존성 정의
   ├─ composer.lock            # 의존성 고정 파일 (재설치 시 동일 버전)
   ├─ index.php                # 애플리케이션 진입점 (entry point)
   ├─ migrate.php              # DB 마이그레이션 스크립트
   ├─ openapi.php              # Swagger 문서 초기화 엔드포인트
   ├─ test.php                 # 테스트용 PHP 스크립트
   ├─ SHOW                     # 임시 또는 디버깅 용도 (확인 필요)
   ├─ exit                     # 디버깅/테스트용 파일로 추정
   └─ quit                     # 디버깅/테스트용 파일로 추정
```
### controllers/	각 리소스(전시회, 사용자, 예매 등)에 대한 요청을 처리하는 컨트롤러 파일이 모여 있습니다. RESTful API 형식에 맞춰 구성됩니다.
### models/	DB 테이블과 직접 연결되는 계층입니다. 각 모델 파일은 해당 도메인 테이블(예: Exhibition, User)에 대한 SQL 쿼리 메서드를 포함하며, GET, POST, PUT, DELETE 등의 요청을 나눠 처리합니다.
### middlewares/	JWT 인증 토큰 확인, 로그인 여부 검증 등의 기능을 담당합니다. API 요청 흐름을 사전에 제어합니다.
### routes.php	API 엔드포인트들을 정의한 파일로, 어떤 URI가 어떤 컨트롤러의 메서드를 실행할지 매핑합니다.
### migrate.php	데이터베이스 초기 설정 또는 테이블 자동 생성을 위한 PHP 스크립트입니다.
### openapi.php	Swagger 문서용 API 명세를 로드하여 Swagger UI를 통해 API를 시각적으로 확인할 수 있도록 지원합니다.
### index.php	프로젝트의 메인 진입점입니다. 모든 요청이 이 파일로 들어옵니다.

