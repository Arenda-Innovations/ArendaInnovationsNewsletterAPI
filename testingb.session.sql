-- @block
CREATE TABLE IF NOT EXISTS potentialUsers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    signup_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- @endblock


-- @block
SELECT * FROM potentialUsers;
-- @endblock