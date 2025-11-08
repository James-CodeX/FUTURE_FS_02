"use client";
import React from 'react';

interface Props { value: string; onChange: (v: string) => void; }
export function SearchBar({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search products..."
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-300"
    />
  );
}
