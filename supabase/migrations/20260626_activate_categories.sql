-- Activa todas las categorias existentes y limpia espacios al final del nombre.
-- Ejecutar en Supabase SQL editor si alguna categoria no aparece por estar oculta.

UPDATE public.categories
SET
  activo = true,
  name = trim(name);
