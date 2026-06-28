import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ImagePlus, LogOut, RefreshCw, Trash2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Product, ProductImage } from '../types/supabase';

type AdminForm = {
  name: string;
  moto: string;
  description: string;
  price: string;
  stock: string;
};

const emptyForm: AdminForm = {
  name: '',
  moto: '',
  description: '',
  price: '0',
  stock: '1',
};

const fieldClass =
  'mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500';

function groupImages(images: ProductImage[]) {
  return images.reduce<Record<string, ProductImage[]>>((acc, image) => {
    acc[image.product_id] = [...(acc[image.product_id] || []), image];
    return acc;
  }, {});
}

export default function AdminProducts() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<Record<string, ProductImage[]>>({});
  const [form, setForm] = useState<AdminForm>(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })),
    [products]
  );

  const loadProducts = async () => {
    const [{ data: productData, error: productError }, { data: imageData, error: imageError }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('product_images').select('*').order('display_order', { ascending: true }),
    ]);

    if (productError || imageError) {
      setMessage(productError?.message || imageError?.message || 'No se pudo cargar el catalogo.');
      return;
    }

    setProducts((productData || []) as Product[]);
    setProductImages(groupImages((imageData || []) as ProductImage[]));
  };

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      const logged = Boolean(data.session?.user);
      setIsLoggedIn(logged);
      if (logged) await loadProducts();
    }

    if (isSupabaseConfigured) checkSession();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(`No se pudo ingresar: ${error.message}`);
      return;
    }

    setIsLoggedIn(true);
    await loadProducts();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setProducts([]);
  };

  const uploadImages = async (productId: string) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const extension = file.name.split('.').pop() || 'jpg';
      const safeName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const path = `products/${productId}/${Date.now()}-${safeName}.${extension}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false });

      if (error) throw new Error(`No se pudo subir ${file.name}: ${error.message}`);

      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault();

    if (files.length === 0) {
      setMessage('Subi al menos una imagen para el producto.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        category: form.moto.trim(),
        image_url: '/branding/cris-metal-logo.png',
        colors: ['Consultar'],
      };

      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();

      if (productError) throw new Error(productError.message);

      const savedProduct = productData as Product;
      const imageUrls = await uploadImages(savedProduct.id);

      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: imageUrls[0] })
        .eq('id', savedProduct.id);

      if (updateError) throw new Error(updateError.message);

      const { error: imagesError } = await supabase.from('product_images').insert(
        imageUrls.map((imageUrl, index) => ({
          product_id: savedProduct.id,
          image_url: imageUrl,
          is_primary: index === 0,
          display_order: index + 1,
        }))
      );

      if (imagesError) throw new Error(imagesError.message);

      setForm(emptyForm);
      setFiles([]);
      setMessage('Producto publicado en el catalogo.');
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!confirm(`Seguro que queres borrar "${product.name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    setMessage(error ? `No se pudo borrar: ${error.message}` : 'Producto eliminado.');
    await loadProducts();
  };

  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 pb-16">
        <div className="rounded-lg border border-red-500/40 bg-zinc-950 p-6 text-gray-200">
          Falta configurar Supabase para usar el administrador.
        </div>
      </section>
    );
  }

  if (!isLoggedIn) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 pb-16">
        <form onSubmit={signIn} className="rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-[0_20px_60px_rgba(220,38,38,0.14)]">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-red-500">Admin</p>
          <h1 className="mt-3 text-4xl font-black text-white">Ingresar al catalogo</h1>
          <p className="mt-3 text-gray-300">Usa el usuario administrador de Supabase para subir productos.</p>
          <label className="mt-6 block text-sm font-bold text-gray-200">
            Email
            <input required type="email" className={fieldClass} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="mt-4 block text-sm font-bold text-gray-200">
            Contraseña
            <input required type="password" className={fieldClass} value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {message ? <p className="mt-4 rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-100">{message}</p> : null}
          <button className="mt-6 w-full rounded-md bg-red-600 px-5 py-3 font-black uppercase text-white transition hover:bg-red-500">
            Entrar
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.32em] text-red-500">Admin</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Subir productos</h1>
          <p className="mt-3 text-gray-300">Cargá publicaciones con una o varias imágenes para el catálogo.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadProducts} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-3 font-bold text-white transition hover:border-red-500">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-3 font-bold text-white transition hover:bg-red-600">
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </div>

      {message ? <p className="mb-6 rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-100">{message}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={saveProduct} className="rounded-lg border border-white/10 bg-zinc-950 p-5">
          <h2 className="text-2xl font-black text-white">Nueva publicacion</h2>
          <label className="mt-4 block text-sm font-bold text-gray-200">
            Nombre del escape
            <input required className={fieldClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="mt-4 block text-sm font-bold text-gray-200">
            Moto compatible
            <input required className={fieldClass} placeholder="Tornado, XR, Universal 4T..." value={form.moto} onChange={(event) => setForm({ ...form, moto: event.target.value })} />
          </label>
          <label className="mt-4 block text-sm font-bold text-gray-200">
            Descripcion corta
            <textarea required className={`${fieldClass} min-h-28`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block text-sm font-bold text-gray-200">
              Precio opcional
              <input type="number" min="0" className={fieldClass} value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </label>
            <label className="block text-sm font-bold text-gray-200">
              Stock opcional
              <input type="number" min="0" className={fieldClass} value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
            </label>
          </div>
          <label className="mt-4 block text-sm font-bold text-gray-200">
            Imagenes de la publicacion
            <input
              required
              multiple
              type="file"
              accept="image/*"
              className={fieldClass}
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
            />
          </label>
          {files.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {files.map((file) => (
                <img key={`${file.name}-${file.lastModified}`} src={URL.createObjectURL(file)} alt={file.name} className="aspect-square rounded-md object-cover" />
              ))}
            </div>
          ) : null}
          <button disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 font-black uppercase text-white transition hover:bg-red-500 disabled:opacity-60">
            <ImagePlus className="h-4 w-4" />
            {saving ? 'Subiendo...' : 'Publicar producto'}
          </button>
        </form>

        <div className="rounded-lg border border-white/10 bg-zinc-950 p-5">
          <h2 className="text-2xl font-black text-white">Productos cargados</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sortedProducts.map((product) => {
              const images = productImages[product.id] || [];
              const cover = images[0]?.image_url || product.image_url;

              return (
                <article key={product.id} className="overflow-hidden rounded-lg border border-white/10 bg-black">
                  <img src={cover} alt={product.name} className="aspect-[4/3] w-full object-cover" />
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{product.category}</p>
                      <h3 className="mt-1 text-xl font-black text-white">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">{images.length || 1} imagen{(images.length || 1) === 1 ? '' : 'es'}</p>
                    </div>
                    {images.length > 1 ? (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((image) => (
                          <img key={image.id} src={image.image_url} alt="" className="h-14 w-16 shrink-0 rounded border border-white/10 object-cover" />
                        ))}
                      </div>
                    ) : null}
                    <button onClick={() => deleteProduct(product)} className="inline-flex items-center gap-2 rounded-md bg-red-600/20 px-3 py-2 text-sm font-bold text-red-100 transition hover:bg-red-600">
                      <Trash2 className="h-4 w-4" />
                      Borrar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
