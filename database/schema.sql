-- Q-Balance fresh installation: MariaDB 10.6+.
-- Select an empty database before importing. This is not an upgrade migration.
-- No DROP or IF NOT EXISTS: incompatible existing tables should cause an error.
-- DDL commits implicitly in MariaDB, so imports are not transactional.
SET NAMES utf8mb4;

CREATE TABLE `user` (
    `id` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT FALSE,
    `image` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `session` (
    `id` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ipAddress` TEXT NULL,
    `userAgent` TEXT NULL,
    `userId` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `session_token_unique` (`token`),
    KEY `session_userId_idx` (`userId`),
    CONSTRAINT `session_user_fk` FOREIGN KEY (`userId`)
        REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `account` (
    `id` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    `issuer` VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
    `accountId` VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
    `providerId` TEXT NOT NULL,
    `userId` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` TEXT NULL,
    `password` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `account_issuer_accountId_unique` (`issuer`, `accountId`),
    KEY `account_userId_idx` (`userId`),
    CONSTRAINT `account_user_fk` FOREIGN KEY (`userId`)
        REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `verification` (
    `id` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    `identifier` VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `verification_identifier_idx` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `user_id` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `categories_id_user_unique` (`id`, `user_id`),
    KEY `categories_user_title_idx` (`user_id`, `title`),
    CONSTRAINT `categories_user_fk` FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `items` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `units` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `categoryid` INT UNSIGNED NOT NULL,
    `user_id` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `items_id_user_unique` (`id`, `user_id`),
    KEY `items_user_title_idx` (`user_id`, `title`),
    KEY `items_category_user_idx` (`categoryid`, `user_id`),
    CONSTRAINT `items_user_fk` FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `items_category_owner_fk` FOREIGN KEY (`categoryid`, `user_id`)
        REFERENCES `categories` (`id`, `user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `transactions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `itemid` INT UNSIGNED NOT NULL,
    `quantity` DECIMAL(15, 4) NOT NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `type` TINYINT UNSIGNED NOT NULL COMMENT '1 = income, 2 = expense',
    `comments` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id` VARCHAR(36) COLLATE utf8mb4_bin NOT NULL,
    PRIMARY KEY (`id`),
    KEY `transactions_user_type_date_idx` (`user_id`, `type`, `created_at`),
    KEY `transactions_user_date_idx` (`user_id`, `created_at`),
    KEY `transactions_item_user_idx` (`itemid`, `user_id`),
    CONSTRAINT `transactions_type_check` CHECK (`type` IN (1, 2)),
    CONSTRAINT `transactions_user_fk` FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `transactions_item_owner_fk` FOREIGN KEY (`itemid`, `user_id`)
        REFERENCES `items` (`id`, `user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
