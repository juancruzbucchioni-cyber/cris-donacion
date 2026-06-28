export default function About() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16">
      <div className="rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.32em] text-red-500">Nosotros</p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">Fabricamos escapes para motos</h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          Somos un emprendimiento dedicado a fabricar escapes para motos 4 tiempos, buscando calidad,
          rendimiento y buen sonido en cada trabajo. Cuidamos la terminacion, los materiales y la
          respuesta del escape para que cada moto tenga una presencia deportiva y confiable.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {['Calidad', 'Rendimiento', 'Buen sonido'].map((item) => (
            <div key={item} className="rounded-md border border-white/10 bg-black p-5 text-center">
              <p className="text-xl font-black text-white">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
