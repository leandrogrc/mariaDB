ALTER TABLE `users` ADD `type` enum('user','admin') DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `links` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;