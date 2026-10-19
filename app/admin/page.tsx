import Link from "next/link";
import { getCars } from "@/lib/cars";
import { logout } from "./actions";
import CarRow from "./car-row";
import { Plus, Power } from "../components/icons";

// An admin view must never be served as build-time static HTML.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stock · Unity Motors",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const cars = await getCars();
  const sold = cars.filter((c) => c.sold).length;
  const live = cars.length - sold;
  // scripts/seed-demo.mts prefixes every row it creates. These carry invented
  // titles, prices and equipment claims, and each one links to a live WhatsApp
  // enquiry — so say so here rather than letting them pass as real stock.
  const demo = cars.filter((c) => c.slug.startsWith("demo-")).length;

  return (
    <main className="min-h-screen bg-[#0a0f12] font-sans">
      <header className="sticky top-0 z-10 bg-[#0a0f12] border-b border-[#23292d]">
        <div className="max-w-5xl mx-auto px-4 min-h-14 py-2 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 min-w-0">
            <span className="text-white font-black uppercase tracking-tight text-sm">
              Unity Motors
            </span>
            <span className="text-[#E43E3D] font-bold text-[10px] uppercase tracking-[0.18em]">
              Stock
            </span>
            {cars.length > 0 && (
              <span className="tnum text-gray-400 text-[11px]">
                {live} live · {sold} sold
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/cars"
              className="px-2.5 py-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
            >
              <span className="hidden sm:inline">View site</span>
              <span className="sm:hidden">Site</span>
            </Link>
            <Link
              href="/admin/car/new"
              className="inline-flex items-center gap-1.5 whitespace-nowrap bg-[#E43E3D] hover:bg-[#c7322f] text-white font-bold text-[11px] uppercase tracking-wider py-2 px-3.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add car</span>
              <span className="sm:hidden">Add</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                title="Log out"
                className="inline-flex items-center p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Power className="w-4 h-4" />
                <span className="sr-only">Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {demo > 0 && (
          <p className="mb-5 border-l border-[#E43E3D] bg-[#E43E3D]/10 px-4 py-3 text-[13px] text-gray-200">
            <span className="font-bold">
              {demo} demo {demo === 1 ? "car is" : "cars are"} live on the site.
            </span>{" "}
            Invented titles, prices and equipment — and the Enquire button really
            does open WhatsApp. Remove them with{" "}
            <code className="text-[#ff8a89]">npm run db:seed -- --clean</code>{" "}
            before launch.
          </p>
        )}

        {cars.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-white font-bold text-lg">No cars yet</p>
            <p className="text-gray-400 text-[13px] mt-2 mb-7">
              Add one and it goes live on the site immediately.
            </p>
            <Link
              href="/admin/car/new"
              className="inline-flex items-center gap-2 bg-[#E43E3D] hover:bg-[#c7322f] text-white font-bold text-[11px] uppercase tracking-wider py-2.5 px-5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add the first car
            </Link>
          </div>
        ) : (
          <div className="border-t border-[#1b2126]">
            {cars.map((car) => (
              <CarRow key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
