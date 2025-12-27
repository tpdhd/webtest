-- 3D Print Showcase Platform - Complete Database Schema
-- Run this in Supabase SQL Editor to set up all tables, indexes, and security policies

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Categories Table
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Miniatures & Figures', 'miniatures', 'Tabletop gaming figures, characters, and collectibles', 1),
  ('Functional Parts', 'functional', 'Useful household items and mechanical parts', 2),
  ('Art & Decor', 'art', 'Sculptures, decorative pieces, and artistic prints', 3),
  ('Tools & Gadgets', 'tools', 'Practical tools and clever accessories', 4),
  ('Toys & Games', 'toys', 'Fun items for play and entertainment', 5),
  ('Other', 'other', 'Miscellaneous 3D prints', 6);

-- Tags Table
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common tags
INSERT INTO public.tags (name, slug) VALUES
  ('PLA', 'pla'),
  ('PETG', 'petg'),
  ('Resin', 'resin'),
  ('ABS', 'abs'),
  ('TPU', 'tpu'),
  ('Support-Free', 'support-free'),
  ('Supports Required', 'supports-required'),
  ('Beginner Friendly', 'beginner-friendly'),
  ('Advanced', 'advanced'),
  ('Multicolor', 'multicolor'),
  ('Functional', 'functional'),
  ('Decorative', 'decorative');

-- User Profiles Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,

  -- Stats
  print_count INTEGER DEFAULT 0,
  total_upvotes INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,

  -- Future: Commerce
  stripe_account_id TEXT, -- For creator payouts
  is_verified_creator BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prints Table (main content)
CREATE TABLE public.prints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Basic Information
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES public.categories(id),

  -- Files
  model_file_url TEXT NOT NULL, -- Path in Supabase Storage
  preview_image_url TEXT, -- Main preview image
  file_format TEXT, -- 'stl', 'obj', 'gltf', 'glb'
  file_size_bytes BIGINT,

  -- 3D Model Metadata
  material TEXT, -- 'PLA', 'PETG', 'Resin', etc.
  print_time_hours DECIMAL(5,2),
  layer_height_mm DECIMAL(4,2),
  infill_percentage INTEGER,
  supports_required BOOLEAN DEFAULT FALSE,

  -- Additional technical details
  dimensions_mm TEXT, -- e.g., "100x100x50"
  weight_grams INTEGER,
  filament_used_grams INTEGER,

  -- Statistics
  upvote_count INTEGER DEFAULT 0,
  downvote_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,

  -- Future: Commerce (Phase 2/3)
  is_premium BOOLEAN DEFAULT FALSE, -- Tips enabled
  is_for_sale BOOLEAN DEFAULT FALSE, -- Can be purchased
  price_usd DECIMAL(10,2),
  license_type TEXT, -- 'free', 'personal', 'commercial'

  -- Status & Publishing
  status TEXT DEFAULT 'published', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Print Tags (many-to-many relationship)
CREATE TABLE public.print_tags (
  print_id UUID REFERENCES public.prints(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (print_id, tag_id)
);

-- Print Images (additional photos - build process, details, etc.)
CREATE TABLE public.print_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  print_id UUID REFERENCES public.prints(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Upvotes Table
CREATE TABLE public.upvotes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  print_id UUID REFERENCES public.prints(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, print_id)
);

-- Comments Table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  print_id UUID REFERENCES public.prints(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For nested replies
  content TEXT NOT NULL,
  upvote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites Table
CREATE TABLE public.favorites (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  print_id UUID REFERENCES public.prints(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, print_id)
);

-- Follows Table (user following system)
CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id) -- Can't follow yourself
);

-- Views Table (track print views)
CREATE TABLE public.views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  print_id UUID REFERENCES public.prints(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (for performance)
-- ============================================================================

-- Prints indexes
CREATE INDEX idx_prints_user_id ON public.prints(user_id);
CREATE INDEX idx_prints_category_id ON public.prints(category_id);
CREATE INDEX idx_prints_status ON public.prints(status);
CREATE INDEX idx_prints_created_at ON public.prints(created_at DESC);
CREATE INDEX idx_prints_upvote_count ON public.prints(upvote_count DESC);
CREATE INDEX idx_prints_view_count ON public.prints(view_count DESC);
CREATE INDEX idx_prints_published_at ON public.prints(published_at DESC);

-- Full-text search index on prints
CREATE INDEX idx_prints_search ON public.prints USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Comments indexes
CREATE INDEX idx_comments_print_id ON public.comments(print_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);

-- Upvotes index
CREATE INDEX idx_upvotes_print_id ON public.upvotes(print_id);

-- Print tags index
CREATE INDEX idx_print_tags_tag_id ON public.print_tags(tag_id);

-- Profiles index
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Views index (for analytics)
CREATE INDEX idx_views_print_id ON public.views(print_id);
CREATE INDEX idx_views_created_at ON public.views(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Prints Policies
CREATE POLICY "Published prints are viewable by everyone"
  ON public.prints FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Authenticated users can create prints"
  ON public.prints FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own prints"
  ON public.prints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prints"
  ON public.prints FOR DELETE
  USING (auth.uid() = user_id);

-- Print Tags Policies
CREATE POLICY "Print tags are viewable by everyone"
  ON public.print_tags FOR SELECT
  USING (true);

CREATE POLICY "Print owners can manage tags"
  ON public.print_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.prints
      WHERE prints.id = print_tags.print_id
      AND prints.user_id = auth.uid()
    )
  );

-- Print Images Policies
CREATE POLICY "Print images are viewable by everyone"
  ON public.print_images FOR SELECT
  USING (true);

CREATE POLICY "Print owners can manage images"
  ON public.print_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.prints
      WHERE prints.id = print_images.print_id
      AND prints.user_id = auth.uid()
    )
  );

-- Comments Policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Upvotes Policies
CREATE POLICY "Upvotes are viewable by everyone"
  ON public.upvotes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their own upvotes"
  ON public.upvotes FOR ALL
  USING (auth.uid() = user_id);

-- Favorites Policies
CREATE POLICY "Favorites are viewable by owner"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id);

-- Follows Policies
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own follows"
  ON public.follows FOR ALL
  USING (auth.uid() = follower_id);

-- Views Policies
CREATE POLICY "Anyone can insert views"
  ON public.views FOR INSERT
  WITH CHECK (true);

-- Categories and Tags (read-only for users)
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Tags are viewable by everyone"
  ON public.tags FOR SELECT
  USING (true);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.prints
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment upvote count on prints
CREATE OR REPLACE FUNCTION public.increment_print_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prints
  SET upvote_count = upvote_count + 1
  WHERE id = NEW.print_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for upvotes
CREATE TRIGGER on_upvote_added
  AFTER INSERT ON public.upvotes
  FOR EACH ROW EXECUTE FUNCTION public.increment_print_upvotes();

-- Function to decrement upvote count
CREATE OR REPLACE FUNCTION public.decrement_print_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prints
  SET upvote_count = upvote_count - 1
  WHERE id = OLD.print_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for removing upvotes
CREATE TRIGGER on_upvote_removed
  AFTER DELETE ON public.upvotes
  FOR EACH ROW EXECUTE FUNCTION public.decrement_print_upvotes();

-- Function to increment comment count
CREATE OR REPLACE FUNCTION public.increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prints
  SET comment_count = comment_count + 1
  WHERE id = NEW.print_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_added
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.increment_comment_count();

-- Function to decrement comment count
CREATE OR REPLACE FUNCTION public.decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prints
  SET comment_count = comment_count - 1
  WHERE id = OLD.print_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_removed
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.decrement_comment_count();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags
    SET usage_count = usage_count - 1
    WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_print_tag_change
  AFTER INSERT OR DELETE ON public.print_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

-- Function to update user print count
CREATE OR REPLACE FUNCTION public.update_user_print_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET print_count = print_count + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles
    SET print_count = print_count - 1
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_print_count_change
  AFTER INSERT OR DELETE ON public.prints
  FOR EACH ROW EXECUTE FUNCTION public.update_user_print_count();

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View for prints with all related data (for easier queries)
CREATE OR REPLACE VIEW prints_with_details AS
SELECT
  p.*,
  pr.username,
  pr.display_name,
  pr.avatar_url,
  c.name as category_name,
  c.slug as category_slug,
  COALESCE(
    (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
     FROM tags t
     JOIN print_tags pt ON pt.tag_id = t.id
     WHERE pt.print_id = p.id),
    '[]'::json
  ) as tags,
  EXISTS(
    SELECT 1 FROM upvotes u
    WHERE u.print_id = p.id AND u.user_id = auth.uid()
  ) as has_upvoted,
  EXISTS(
    SELECT 1 FROM favorites f
    WHERE f.print_id = p.id AND f.user_id = auth.uid()
  ) as has_favorited
FROM prints p
LEFT JOIN profiles pr ON p.user_id = pr.id
LEFT JOIN categories c ON p.category_id = c.id;

-- ============================================================================
-- SAMPLE DATA (optional - for testing)
-- ============================================================================

-- Uncomment to insert sample data:

-- INSERT INTO public.tags (name, slug) VALUES
--   ('Miniature', 'miniature'),
--   ('Large Print', 'large-print'),
--   ('Quick Print', 'quick-print'),
--   ('Weekend Project', 'weekend-project');

-- ============================================================================
-- COMPLETE!
-- ============================================================================

-- You should see "Success. No rows returned" if everything worked.
-- Your database is now ready!

-- Next steps:
-- 1. Set up Storage buckets (models, images)
-- 2. Configure storage policies
-- 3. Start building your app!
