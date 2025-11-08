import React from "react";
import Image from "next/image";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/api";

export const revalidate = 300;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const products = await getProducts();
  const qRaw = sp.q;
  const catRaw = sp.cat;
  const q = (Array.isArray(qRaw) ? qRaw[0] : qRaw || "").toLowerCase();
  const cat = Array.isArray(catRaw) ? catRaw[0] : catRaw || "";
  const filtered = products.filter(
    (p) => (q ? p.title.toLowerCase().includes(q) : true) && (cat ? p.category === cat : true)
  );
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Pick a random product for the hero section each load (SSR)
  const hero = products.length ? products[Math.floor(Math.random() * products.length)] : null;

  return (
    <div className="space-y-6">
      {hero && (
        <section className="relative overflow-hidden rounded-2xl border bg-white">
          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-widest text-zinc-500">Trending now</p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">{hero.title}</h1>
              <p className="mt-3 text-sm text-zinc-600 line-clamp-3">{hero.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`/products/${hero.id}`} className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Shop now</a>
                <a href={`/?cat=${encodeURIComponent(hero.category)}`} className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50">More in {hero.category}</a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-10 -top-10 hidden h-64 w-64 rounded-full border-2 border-zinc-200 md:block" />
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50">
                <Image
                  src={hero.image}
                  alt={hero.title}
                  fill
                  className="object-contain"
                  priority
                  loading="eager"
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="mt-3 text-right text-sm font-semibold text-brand-700">${hero.price.toFixed(2)}</div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Browse products</h2>
        <form className="grid gap-4 md:grid-cols-3" action="/" method="get">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search products..."
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <select
            name="cat"
            defaultValue={cat}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button className="inline-flex w-full items-center justify-center rounded-md border border-sky-600 px-4 py-2 font-medium text-sky-700 transition hover:bg-sky-50" type="submit">
              Apply Filters
            </button>
          </div>
        </form>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
