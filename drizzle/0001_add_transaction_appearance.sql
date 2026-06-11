ALTER TABLE "transactions" ADD COLUMN "icon" varchar(80) DEFAULT 'Wallet' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "color" varchar(32) DEFAULT '#6366f1' NOT NULL;