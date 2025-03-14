CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(50) NOT NULL,
	`value` varchar(255) NOT NULL,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
