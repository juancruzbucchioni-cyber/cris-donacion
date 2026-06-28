-- Simplified admin permissions for Cris Metal catalog.
-- Run this in Supabase SQL Editor if /admin shows a row-level security error.

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Authenticated users can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images"
  ON public.product_images
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated admins can manage product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated users can manage product images" ON public.product_images;
CREATE POLICY "Authenticated users can manage product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view product image files" ON storage.objects;
CREATE POLICY "Anyone can view product image files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated admins can upload product image files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product image files" ON storage.objects;
CREATE POLICY "Authenticated users can upload product image files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated admins can update product image files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product image files" ON storage.objects;
CREATE POLICY "Authenticated users can update product image files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated admins can delete product image files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product image files" ON storage.objects;
CREATE POLICY "Authenticated users can delete product image files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
