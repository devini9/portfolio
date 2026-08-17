CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    markdown_content TEXT,
    tags VARCHAR(255)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(255),
    achievement_name VARCHAR(255),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
