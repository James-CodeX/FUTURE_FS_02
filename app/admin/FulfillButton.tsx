"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FulfillButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const onClick = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "PATCH" });
      if (!res.ok) setFailed(true);
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center rounded border border-green-600 px-3 py-1 text-[11px] font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Marking…" : "Mark Fulfilled"}
      </button>
      {failed && <p className="mt-1 text-[11px] text-red-600">Failed. Retry.</p>}
    </div>
  );
}
