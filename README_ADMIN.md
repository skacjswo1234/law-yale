# 법무법인 예일법조 관리자 시스템

## 데이터베이스 스키마

### 테이블 구조

#### 1. reviews (고객 후기)
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: TEXT NOT NULL - 고객 이름
- `rating`: INTEGER NOT NULL (1-5) - 별점
- `comment`: TEXT NOT NULL - 후기 내용
- `date`: TEXT NOT NULL - 날짜 (YYYY.MM.DD 형식)
- `created_at`: TEXT - 생성일시
- `updated_at`: TEXT - 수정일시
- `is_visible`: INTEGER DEFAULT 1 - 공개 여부 (1: 공개, 0: 비공개)

#### 2. consultations (상담 신청)
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: TEXT NOT NULL - 신청자 이름
- `phone`: TEXT NOT NULL - 연락처
- `inquiry_type`: TEXT NOT NULL - 문의 유형 (personal-rehabilitation, personal-bankruptcy, consultation, other)
- `content`: TEXT - 상담 내용
- `status`: TEXT DEFAULT 'pending' - 상태 (pending, contacted, completed, cancelled)
- `created_at`: TEXT - 생성일시
- `updated_at`: TEXT - 수정일시
- `notes`: TEXT - 관리자 메모

#### 3. admins (관리자 계정)
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `username`: TEXT UNIQUE NOT NULL - 사용자명
- `password_hash`: TEXT NOT NULL - 비밀번호 해시
- `created_at`: TEXT - 생성일시
- `last_login`: TEXT - 마지막 로그인 시간

## 설정 방법

### 1. 데이터베이스 초기화

D1 데이터베이스에 스키마를 적용하려면:

```bash
npx wrangler d1 execute law-yale-db --file=./schema.sql
```

### 2. 환경 변수 설정

`wrangler.toml` 파일이 이미 설정되어 있습니다. 필요시 관리자 비밀번호를 환경 변수로 설정할 수 있습니다:

```bash
npx wrangler secret put ADMIN_PASSWORD
```

### 3. 로컬 개발

```bash
npx wrangler pages dev
```

### 4. 배포

```bash
npx wrangler pages deploy
```

## API 엔드포인트

### 인증
- `POST /api/auth` - 로그인
  - Body: `{ username: string, password: string }`
  - Response: `{ success: boolean, token?: string, error?: string }`

### 고객 후기
- `GET /api/reviews` - 후기 목록 조회
  - Query: `?visible=true` (선택사항, 공개된 후기만 조회)
- `POST /api/reviews` - 후기 생성
- `PUT /api/reviews` - 후기 수정
- `DELETE /api/reviews?id={id}` - 후기 삭제

### 상담 신청
- `GET /api/consultations` - 상담 신청 목록 조회
  - Query: `?status={status}` (선택사항, 상태별 필터링)
- `POST /api/consultations` - 상담 신청 생성
- `PUT /api/consultations` - 상담 신청 수정
- `DELETE /api/consultations?id={id}` - 상담 신청 삭제

## 관리자 화면 접근

1. `/admin.html` 페이지로 이동
2. 기본 로그인 정보:
   - 사용자명: `admin`
   - 비밀번호: `admin123` (프로덕션에서는 반드시 변경 필요)

## 보안 권장사항

1. 프로덕션 환경에서는 관리자 비밀번호를 변경하세요.
2. 실제 운영 환경에서는 JWT 토큰이나 세션 기반 인증을 구현하는 것을 권장합니다.
3. API 엔드포인트에 인증 미들웨어를 추가하는 것을 권장합니다.
4. HTTPS를 사용하세요.

## 파일 구조

```
.
├── schema.sql                  # 데이터베이스 스키마
├── wrangler.toml              # Cloudflare Workers 설정
├── admin.html                 # 관리자 화면 HTML
├── admin.js                   # 관리자 화면 JavaScript
├── functions/
│   └── api/
│       ├── auth.ts           # 인증 API
│       ├── reviews.ts        # 후기 API
│       └── consultations.ts  # 상담 신청 API
└── README_ADMIN.md           # 이 문서
```
