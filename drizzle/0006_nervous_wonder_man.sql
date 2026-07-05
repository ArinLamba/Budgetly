ALTER TABLE "goals" ADD COLUMN "icon" varchar(80) DEFAULT 'Goal' NOT NULL;--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "color" varchar(32) DEFAULT '#6366f1' NOT NULL;--> statement-breakpoint
CREATE INDEX "goal_contributions_goal_date_idx" ON "goal_contributions" USING btree ("goal_id","contributed_at");
