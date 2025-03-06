ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `username` varchar(25) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `name` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `photo_url` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `description` varchar(300);--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;