import { getProduct } from '../../../lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddButton from './AddButton';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProduct(id);
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square bg-white rounded-lg p-4 shadow-sm">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            priority
            loading="eager"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <p className="text-brand-700 text-xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{product.description}</p>
          <AddButton product={product} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
