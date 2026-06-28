-- config/schema.sql
-- Fixed schema for Aiven MySQL (production-safe)

-- USERS: core auth table
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  mobile          VARCHAR(15) NOT NULL UNIQUE,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- LINKED PROFILES
CREATE TABLE IF NOT EXISTS linked_profiles (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  leetcode_username     VARCHAR(100) DEFAULT NULL,
  codeforces_username   VARCHAR(100) DEFAULT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user (user_id),
  CONSTRAINT fk_linked_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SUBMISSIONS
CREATE TABLE IF NOT EXISTS submissions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  platform        ENUM('leetcode', 'codeforces') NOT NULL,
  problem_title   VARCHAR(255) NOT NULL,
  verdict         VARCHAR(50)  NOT NULL,
  language        VARCHAR(50)  DEFAULT NULL,
  submitted_at    DATETIME     NOT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_platform (user_id, platform),
  CONSTRAINT fk_submissions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- CONTEST HISTORY
CREATE TABLE IF NOT EXISTS contest_history (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  platform        ENUM('leetcode', 'codeforces') NOT NULL,
  contest_name    VARCHAR(255) NOT NULL,
  rank_position   INT DEFAULT NULL,
  rating_change   INT DEFAULT NULL,
  new_rating      INT DEFAULT NULL,
  contest_date    DATETIME NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_platform_date (user_id, platform, contest_date),
  CONSTRAINT fk_contest_history_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;