-- 법무법인 예일법조 관리자 시스템 데이터베이스 스키마

-- 상담 신청 테이블
CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime')),
  notes TEXT
);

-- 관리자 계정 테이블
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  last_login TEXT
);

-- 초기 관리자 계정 생성 (비밀번호: admin123, 실제 환경에서는 변경 필요)
-- 해시는 bcrypt로 생성된 값이어야 하므로 실제로는 API에서 생성해야 함
-- INSERT INTO admins (username, password_hash) VALUES ('admin', '$2b$10$hashedpassword');
