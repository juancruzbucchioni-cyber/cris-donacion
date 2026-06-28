const sections = [
  {
    title: '1. Introduccion',
    paragraphs: [
      'Bienvenido a Cris Metal Escapes. Este sitio funciona como catalogo para consultar y comprar escapes 4 tiempos de competicion en acero inoxidable.',
    ],
  },
  {
    title: '2. Sobre los productos',
    paragraphs: [
      'Las imagenes, modelos y precios publicados son orientativos y pueden variar segun disponibilidad, medidas, anclajes y compatibilidad con cada moto.',
      'Antes de confirmar una compra recomendamos consultar por WhatsApp el modelo exacto de moto, uso esperado y configuracion requerida.',
    ],
  },
  {
    title: '3. Pagos y coordinacion',
    paragraphs: [
      'Los importes estan expresados en pesos argentinos (ARS), salvo que se indique lo contrario.',
      'Los medios de pago disponibles son efectivo y transferencia. No almacenamos datos de tarjetas de credito o debito.',
    ],
  },
  {
    title: '4. Disponibilidad y trabajos a medida',
    paragraphs: [
      'La disponibilidad puede cambiar sin previo aviso porque algunos productos se fabrican o ajustan a pedido.',
      'Los trabajos a medida se coordinan por WhatsApp y pueden requerir seña, medidas o fotos de referencia.',
    ],
  },
  {
    title: '5. Privacidad y datos personales',
    paragraphs: [
      'La informacion de contacto se utiliza solo para responder consultas, coordinar pedidos y dar seguimiento a compras de Cris Metal Escapes.',
    ],
  },
];

export default function Terms() {
  return (
    <section className="container py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-[0_18px_60px_rgba(255,255,255,0.06)] md:p-10">
        <h1 className="font-brand mb-8 text-3xl font-black text-white md:text-4xl">
          Terminos y condiciones de uso
        </h1>

        <div className="space-y-8">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="mb-3 text-xl font-bold text-white">{section.title}</h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-gray-200">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
