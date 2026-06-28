export type ExhaustProduct = {
  id: string;
  name: string;
  moto: string;
  description: string;
  image: string;
};

export const products: ExhaustProduct[] = [
  {
    id: 'escape-4t-competicion',
    name: 'Escape 4T Competicion',
    moto: 'Universal 4T',
    description: 'Linea deportiva en acero inoxidable para mejorar salida, presencia y sonido.',
    image: '/products/escape-4t-competicion.svg',
  },
  {
    id: 'escape-tornado-xr',
    name: 'Escape Tornado / XR',
    moto: 'Honda Tornado / XR',
    description: 'Modelo pensado para motos de calle y enduro con sonido firme y terminacion prolija.',
    image: '/products/escape-tornado.svg',
  },
  {
    id: 'silenciador-inox',
    name: 'Silenciador Inoxidable',
    moto: '150cc / 250cc',
    description: 'Silenciador de acero inoxidable con terminacion metalica y estilo deportivo.',
    image: '/products/silenciador-inox.svg',
  },
  {
    id: 'sistema-a-medida',
    name: 'Sistema Completo a Medida',
    moto: 'A medida',
    description: 'Fabricacion personalizada segun modelo, anclajes y uso de la moto.',
    image: '/products/sistema-a-medida.svg',
  },
];

export const motos = ['Todas', ...Array.from(new Set(products.map((product) => product.moto)))];
