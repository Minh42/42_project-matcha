USE matcha;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(32) NOT NULL,
    lastname VARCHAR(32) NOT NULL,
    username VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(32) NOT NULL,
    activation_code varchar(255) NOT NULL,
    status INT DEFAULT 0 NOT NULL,
    birth_date DATE NOT NULL,
    gender enum('male', 'female') NOT NULL,
    location VARCHAR (255),
    bio TEXT,
    ip_address VARCHAR(15),
    popularity DECIMAL(5,2), -- popularity score
    fb_id INT,
    twitter_id INT,
    google_id INT,
    token VARCHAR(255), -- token for reset password
    alert_notification BOOLEAN DEFAULT TRUE NOT NULL, -- trigger email notification
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- date when user activated the account
    date_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS user_photos (
    photo_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    details TEXT,
    image_path VARCHAR(255),
    active BOOLEAN, -- A flag denoting if this photo is still active (i.e. available for others to see on the user’s profile).
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS likes (
    from_user_id BIGINT UNSIGNED, -- ID of the user performing the like,
    to_user_id BIGINT UNSIGNED, -- ID of the user being liked
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS tags (
    tag_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL
)

CREATE TABLE IF NOT EXISTS user_tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id), -- ID of the user being tagged
    tag_id BIGINT UNSIGNED -- ID of the tag being assigned to a user
)

CREATE TABLE IF NOT EXISTS gender (
    gender_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL
)

CREATE TABLE IF NOT EXISTS interested_in_gender (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    gender_id BIGINT UNSIGNED
)

CREATE TABLE IF NOT EXISTS relationship_type (
    relationship_type_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32)
)

CREATE TABLE IF NOT EXISTS interested_in_relation (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    relationship_type_id BIGINT UNSIGNED
)

CREATE TABLE IF NOT EXISTS conversation (
    conversation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- each user can start a conversation
    FOREIGN KEY (user_id) REFERENCES users(user_id), -- ID of the user that initiated the conversation
    time_started TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    time_closed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS participant (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id), -- ID of the conversation
    FOREIGN KEY (participant_id) REFERENCES users(user_id), -- ID of the participant
    time_joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    time_left TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS message (
    message_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (participant_id) REFERENCES participant(participant_id),
    message TEXT,
    time_sent TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    message_read BOOLEAN NOT NULL DEFAULT 0
)

CREATE TABLE IF NOT EXISTS notifications (
    message_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (participant_id) REFERENCES participant(participant_id),
    message TEXT,
    time_sent TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    message_read BOOLEAN NOT NULL DEFAULT 0
)

CREATE TABLE IF NOT EXISTS grade (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id_given) REFERENCES users(user_id), -- ID of the user who gave the grade
    FOREIGN KEY (user_id_received) REFERENCES users(user_id), -- ID of the user who was graded
    grade INT
)

CREATE TABLE IF NOT EXISTS block_user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id), -- ID of the blocking user
    FOREIGN KEY (user_id_blocked) REFERENCES users(user_id), -- D of the blocked user
)

