import AdminTabs from "./tabs";

/**
 * A dynamic route with no loading boundary has nothing prefetchable: the
 * router can't cache the prefetch, so every <Link> to it re-prefetches on each
 * render and the real click queues behind a pile of identical in-flight RSC
 * requests. This boundary gives the admin routes a static shell — prefetched
 * once, painted instantly — while the list streams in behind it.
 *
 * AdminTabs reads usePathname, which is already the destination here, so the
 * Cars/Parts switch highlights the new tab before the server has answered.
 */
export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#0a0f12] font-sans">
      <header className="sticky top-0 z-10 bg-[#0a0f12] border-b border-[#23292d]">
        <div className="max-w-5xl mx-auto px-4 min-h-14 py-2 flex items-center">
          <AdminTabs />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="border-t border-[#1b2126] animate-pulse">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-[57px] border-b border-[#1b2126] bg-[#0e1316]" />
          ))}
        </div>
      </div>
    </main>
  );
}
