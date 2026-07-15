-- StreamVault database schema
-- Run once against your MySQL database:
--   mysql -h HOST -u USER -p DATABASE < schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie_likes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  movie_id    VARCHAR(50) NOT NULL,
  title       VARCHAR(255),
  genres      TEXT,
  poster_path VARCHAR(500),
  media_type  ENUM('movie', 'tv') DEFAULT 'movie',
  liked_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY  unique_user_movie (user_id, movie_id)
);

CREATE TABLE IF NOT EXISTS movie_comments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  movie_id    VARCHAR(50) NOT NULL,
  title       VARCHAR(255),
  media_type  ENUM('movie', 'tv') DEFAULT 'movie',
  body        VARCHAR(1000) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_movie_id (movie_id),
  INDEX idx_user_id (user_id)
);
