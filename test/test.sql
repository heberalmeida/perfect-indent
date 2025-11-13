-- SQL - Mal indentado propositalmente
CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (name, email) VALUES
('John Doe', 'john@test.com'),
('Jane Smith', 'jane@test.com');
SELECT u.id, u.name, u.email
FROM users u
WHERE u.id > 0
AND u.email IS NOT NULL
ORDER BY u.name;
UPDATE users
SET email = 'newemail@test.com'
WHERE id = 1;
DELETE FROM users
WHERE id < 0;

