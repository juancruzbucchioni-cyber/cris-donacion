-- Cris Metal Escapes catalog seed.
-- Run this after the base schema migrations to prepare the catalog for 4T stainless competition exhausts.

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS orden integer NOT NULL DEFAULT 0;

INSERT INTO public.categories (name, description, image_url, activo, orden)
VALUES
  ('Escapes 4T', 'Escapes 4 tiempos de competicion fabricados en acero inoxidable.', '/branding/cris-metal-logo.png', true, 1),
  ('Competicion', 'Productos pensados para alto rendimiento y uso deportivo.', '/branding/cris-metal-logo.png', true, 2),
  ('Acero inoxidable', 'Lineas con terminacion inoxidable, durables y listas para exigir.', '/branding/cris-metal-logo.png', true, 3),
  ('A medida', 'Trabajos personalizados segun modelo, uso y configuracion de la moto.', '/branding/cris-metal-logo.png', true, 4)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  activo = EXCLUDED.activo,
  orden = EXCLUDED.orden;

INSERT INTO public.products (name, description, price, image_url, category, stock)
VALUES
  (
    'Escape 4T competicion inoxidable',
    'Escape Cris Metal para motos 4 tiempos, fabricado en acero inoxidable con terminacion de competicion. Consultar compatibilidad por modelo.',
    0,
    '/branding/cris-metal-logo.png',
    'Escapes 4T',
    1
  ),
  (
    'Sistema completo 4T a medida',
    'Sistema completo fabricado a medida para mejorar salida, sonido y rendimiento en motores 4 tiempos.',
    0,
    '/branding/cris-metal-logo.png',
    'A medida',
    1
  ),
  (
    'Escape competicion alto rendimiento',
    'Linea de competicion Cris Metal con acero inoxidable, soldaduras reforzadas y sonido deportivo.',
    0,
    '/branding/cris-metal-logo.png',
    'Competicion',
    1
  ),
  (
    'Silenciador inoxidable 4T',
    'Silenciador de acero inoxidable para configuraciones 4 tiempos. Consultar diametro, anclajes y modelo compatible.',
    0,
    '/branding/cris-metal-logo.png',
    'Acero inoxidable',
    1
  )
ON CONFLICT (name, category) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  stock = EXCLUDED.stock;

INSERT INTO public.testimonials (nombre, mensaje, foto_url, activo, orden)
VALUES
  ('Cris Metal Escapes', 'Fabricacion de escapes 4 tiempos de competicion en acero inoxidable.', '/branding/avatar-placeholder.svg', true, 1),
  ('Acero inoxidable', 'Terminaciones resistentes, sonido deportivo y consultas por modelo.', '/branding/avatar-placeholder.svg', true, 2),
  ('Fabricando rendimiento', 'Catalogo orientado a motos 4T de calle, enduro y competicion.', '/branding/avatar-placeholder.svg', true, 3)
ON CONFLICT DO NOTHING;
