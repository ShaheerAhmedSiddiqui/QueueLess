CREATE DATABASE IF NOT EXISTS queueless_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE queueless_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('STUDENT','STAFF','ADMIN') NOT NULL DEFAULT 'STUDENT',
  student_id VARCHAR(50) NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  code VARCHAR(12) NOT NULL UNIQUE,
  description VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS counters (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(80) NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_counters_service FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS staff_assignments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  staff_id BIGINT UNSIGNED NOT NULL,
  counter_id BIGINT UNSIGNED NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_assignments_staff FOREIGN KEY (staff_id) REFERENCES users(id),
  CONSTRAINT fk_assignments_counter FOREIGN KEY (counter_id) REFERENCES counters(id),
  UNIQUE KEY uq_staff_counter (staff_id, counter_id)
);

CREATE TABLE IF NOT EXISTS queue_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  counter_id BIGINT UNSIGNED NULL,
  token_number VARCHAR(30) NOT NULL,
  status ENUM('WAITING','CALLED','SERVING','COMPLETED','CANCELLED','SKIPPED') NOT NULL DEFAULT 'WAITING',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  called_at TIMESTAMP NULL,
  service_started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  CONSTRAINT fk_tokens_student FOREIGN KEY (student_id) REFERENCES users(id),
  CONSTRAINT fk_tokens_service FOREIGN KEY (service_id) REFERENCES services(id),
  CONSTRAINT fk_tokens_counter FOREIGN KEY (counter_id) REFERENCES counters(id),
  UNIQUE KEY uq_service_token (service_id, token_number),
  INDEX idx_queue_service_status (service_id, status, joined_at),
  INDEX idx_queue_student_status (student_id, status)
);

CREATE TABLE IF NOT EXISTS queue_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  queue_token_id BIGINT UNSIGNED NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(40) NOT NULL,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_history_token FOREIGN KEY (queue_token_id) REFERENCES queue_tokens(id),
  CONSTRAINT fk_history_actor FOREIGN KEY (actor_user_id) REFERENCES users(id),
  INDEX idx_history_token_date (queue_token_id, created_at)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_notifications_user_read (user_id, is_read, created_at)
);

INSERT IGNORE INTO services (name, code, description) VALUES
('Student Affairs', 'SA', 'Student records, enrollment and general student support.'),
('Fee Office', 'FEE', 'Fee statements and fee office assistance.'),
('Admissions Office', 'ADM', 'Admission and enrollment guidance.'),
('Examination Office', 'EX', 'Examination forms, results and academic records.'),
('IT Support', 'IT', 'Help with university systems and technology.'),
('Document Verification', 'DV', 'Academic document verification requests.');
