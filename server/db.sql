USE matcha;

CREATE TABLE IF NOT EXISTS `users` (
    `user_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(32) NOT NULL,
    `lastname` VARCHAR(32) NOT NULL,
    `username` VARCHAR(32),
    `email` VARCHAR(64) NOT NULL,
    `password` VARCHAR(128),
    `activation_code` VARCHAR(255) DEFAULT 0,
    `status` INT DEFAULT 0 NOT NULL,
    `birth_date` DATE,
    `gender` enum('man', 'woman'),
    `latitude` FLOAT,
    `longitude` FLOAT,
    `bio` TEXT,
    `imageProfile_path` VARCHAR(255),
    `occupation` VARCHAR(64),
    `popularity` DECIMAL(5,2),
    `ip_address` VARCHAR(15),
    `geolocalisationAllowed` BOOLEAN DEFAULT FALSE,
    `onboardingDone` BOOLEAN DEFAULT FALSE,
    `fb_id` VARCHAR(255),
    `google_id` VARCHAR(255),
    `token_reset` VARCHAR(255),
    `alert_notification` BOOLEAN DEFAULT TRUE NOT NULL,
    `last_login` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `user_photos` (
    `photo_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED,
    `details` TEXT,
    `image_path` VARCHAR(255),
    `active` BOOLEAN,
    `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `likes` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `from_user_id` BIGINT UNSIGNED,
    `to_user_id` BIGINT UNSIGNED,
    `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `views` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `from_user_id` BIGINT UNSIGNED,
    `to_user_id` BIGINT UNSIGNED,
    `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `tags` (
    `tag_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `user_tags` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`BIGINT UNSIGNED,
    `tag_id` BIGINT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `genders` (
    `gender_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `interested_in_gender` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED,
    `gender_id` BIGINT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `relationships_type` (
    `relationship_type_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS `interested_in_relation` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED,
    `relationship_type_id` BIGINT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `conversation` (
    `conversation_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED,
    `time_started` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `time_closed` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `participant` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT UNSIGNED,
    `participant_id` BIGINT UNSIGNED,
    `time_joined` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `time_left` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id),
    FOREIGN KEY (participant_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `message` (
    `message_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT UNSIGNED,
    `participant_id` BIGINT UNSIGNED,
    `message` TEXT,
    `time_sent` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participant(participant_id),
    FOREIGN KEY (conversation_id) REFERENCES participant(conversation_id)
);

CREATE TABLE IF NOT EXISTS `grade` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id_given` BIGINT UNSIGNED,
    `user_id_received` BIGINT UNSIGNED,
    `grade` INT,
    FOREIGN KEY (user_id_given) REFERENCES users(user_id),
    FOREIGN KEY (user_id_received) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `block_user` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED,
    `user_id_blocked` BIGINT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (user_id_blocked) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `report_user` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED,
    `user_id_reported` BIGINT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (user_id_reported) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `notification_object` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `entity_type_id` INT UNSIGNED NOT NULL,
    `entity_id` INT UNSIGNED NOT NULL,
    `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` TINYINT DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS `notification` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `notification_object_id` BIGINT UNSIGNED NOT NULL,
    `notifier_id` BIGINT UNSIGNED NOT NULL,
    `status` TINYINT DEFAULT 0 NOT NULL,
    FOREIGN KEY (notification_object_id) REFERENCES notification_object(id),
    FOREIGN KEY (notifier_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS `notification_change` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `notification_object_id` BIGINT UNSIGNED NOT NULL,
    `actor_id` BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (notification_object_id) REFERENCES notification_object(id),
    FOREIGN KEY (actor_id) REFERENCES users(user_id)
);