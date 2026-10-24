import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/products";
import { ArrowLeft } from "../../../components/icons";
import ProductForm from "./product-form";

export const metadata = {
  title: "Edit part · Unity Motors",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const product = isNew ? null : await getProductById(id);

  if (!isNew && !product) notFound();

  // So the dropdown offers categories the owner has already typed, instead of
  // making them retype one and risk a second spelling of it.
  const used = [
    ...new Set((await getProducts()).map((p) => p.category).filter(Boolean)),
  ];

  return (
    <main className="min-h-screen bg-[#0a0f12] font-sans">
      <header className="border-b border-[#23292d]">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 -ml-1 px-1 py-2.5 text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Parts
          </Link>
          <h1 className="text-white font-bold text-lg mt-2">
            {isNew ? "Add part" : "Edit part"}
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <ProductForm product={product} used={used} />
      </div>
    </main>
  );
}
