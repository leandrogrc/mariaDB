ALTER TABLE `users` DROP INDEX `uniqueUsername`;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `unique_username` UNIQUE(`username`);