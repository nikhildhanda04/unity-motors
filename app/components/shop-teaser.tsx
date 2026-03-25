import Image from "next/image";

const teaserItems = [
  {
    name: "Precision Turbochargers",
    image: "/turbocharger.png",
    tag: "Performance"
  },
  {
    name: "Titanium Exhaust Tips",
    image: "/exhaust_tips.png",
    tag: "Aesthetics & Exhaust"
  },
  {
    name: "Coilover Suspensions",
    image: "/suspension.png",
    tag: "Handling & Stance"
  }
];

export const ShopTeaserSection = () => {
  return (
    <section className="w-full bg-[#0a0f12] py-24 sm:py-32 font-sans relative overflow-hidden border-t border-gray-900">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-[#111] to-transparent z-0 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col items-start text-left">
            <span className="text-[#E43E3D] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 py-1.5 px-4 border border-[#E43E3D]/30 rounded-full bg-[#E43E3D]/10 shadow-[0_0_15px_rgba(228,62,61,0.2)]">
              Coming Soon
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
              Exclusive Parts <br />
              <span className="text-gray-500">Store</span>
            </h2>
            <div className="w-16 h-1 bg-[#E43E3D] mb-4"></div>
            <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
              We&apos;re launching our curated selection of high-performance aftermarket parts. Unleash your vehicle&apos;s true potential with exactly the same premium parts we use in our shop.
            </p>
          </div>
          
          <button disabled className="bg-[#111] border border-gray-800 text-gray-500 font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-full cursor-not-allowed">
            Shop Opening Soon
          </button>
        </div>

        {/* Teaser Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {teaserItems.map((item, idx) => (
            <div key={idx} className="group flex flex-col items-center">
              
              <div className="w-full h-80 sm:h-105 relative overflow-hidden rounded-2xl bg-[#0e1418] border border-gray-800/80 shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:border-red-900/40 transition-colors duration-500">
                {/* Custom glowing overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0f12] via-[#0a0f12]/40 to-transparent opacity-90 z-10 transition-opacity duration-500 group-hover:opacity-60"></div>
                
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[0.4] group-hover:grayscale-0"
                />
                
                <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[#E43E3D] font-bold text-[10px] uppercase tracking-widest mb-2 block">
                    {item.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    {item.name}
                  </h3>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ShopTeaserSection;
