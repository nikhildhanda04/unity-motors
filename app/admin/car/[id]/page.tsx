import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarById } from "@/lib/cars";
import { ArrowLeft } from "../../../components/icons";
import CarForm from "./car-form";

export const metadata = {
  title: "Edit car · Unity Motors",
  robots: { index: false, follow: false },
};

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const car = isNew ? null : await getCarById(id);

  if (!isNew && !car) notFound();

  return (
    <main className="min-h-screen bg-[#0a0f12] font-sans">
      <header className="border-b border-[#23292d]">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 -ml-1 px-1 py-2.5 text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Stock
            </Link>
            <h1 className="text-white font-bold text-lg mt-2">
              {isNew ? "Add car" : "Edit car"}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <CarForm car={car} />
      </div>
    </main>
  );
}
