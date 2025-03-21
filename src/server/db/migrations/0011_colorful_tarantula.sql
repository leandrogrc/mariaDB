CREATE TABLE `logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`type` enum('log','error') NOT NULL DEFAULT 'log',
	`title` varchar(500) NOT NULL,
	`details` text,
	`stack` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `logs` ADD CONSTRAINT `logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;