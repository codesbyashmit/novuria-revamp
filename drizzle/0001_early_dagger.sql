CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"subtitle" text,
	"image_url" text NOT NULL,
	"item_count_text" varchar(100),
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bundles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"total_price" numeric(10, 2) NOT NULL,
	"compare_at_price" numeric(10, 2),
	"image_url" text NOT NULL,
	"pieces_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bundles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"tag" varchar(100),
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"button_text" varchar(100),
	"button_link" varchar(255),
	"secondary_button_text" varchar(100),
	"secondary_button_link" varchar(255),
	"image_url" text,
	"badge_text" varchar(100),
	"countdown_target" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lookbook_stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_name" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"image_url" text NOT NULL,
	"outfit_title" varchar(255) NOT NULL,
	"product_slug" varchar(255),
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_nav" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "collection_id" uuid;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "occasion" varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "fabric" varchar(150);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "color" varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "color_hex" varchar(30);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "badges" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_new_arrival" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_bestseller" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;