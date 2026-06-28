-- Fix product_images schema for the /admin catalog uploader.
-- Run this in Supabase SQL Editor if the app says a product_images column is missing.

CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS is_primary boolean DEFAULT false;

ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE public.product_images
ALTER COLUMN image_url SET NOT NULL;

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images"
  ON public.product_images
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage product images" ON public.product_images;
CREATE POLICY "Authenticated users can manage product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
