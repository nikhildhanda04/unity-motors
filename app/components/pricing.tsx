export const PricingSection = () => {
    
  return (
    <section id="pricing" className="w-full bg-[#111111] py-24 sm:py-32 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-4">
              Select Services
            </h2>
            <p className="text-gray-400 font-medium leading-[1.8] text-sm sm:text-base">
              Choose from flexible packages with the perfect option for your car, from a quick wash to complete full detailing.
            </p>
          </div>
          <a href="#pricing" className="bg-[#E43E3D] hover:bg-[#c93231] text-white font-black text-xs uppercase tracking-widest py-3 px-8 rounded-full transition-colors whitespace-nowrap shadow-lg shadow-red-500/20 inline-block text-center mt-6 md:mt-0">
            View All
          </a>
        </div>

        {/* Pricing Cards */}
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-0.5">
          
          {/* Card 1 */}
          <div className="flex-1 bg-white p-10 flex flex-col">
            <h3 className="text-5xl sm:text-6xl font-black text-[#E43E3D] tracking-tighter mb-4">
              <span className="text-3xl sm:text-4xl align-top mr-1">$</span>4000
            </h3>
            <h4 className="text-2xl sm:text-3xl font-black text-[#111] uppercase tracking-tighter mb-4">
              Exterior Interior Revive
            </h4>
            <p className="text-gray-600 text-sm leading-[1.8] font-medium grow mb-10">
              Complete overhaul of both the outside and inside of your vehicle, bringing it back to a showroom state.
            </p>
            <a href="#booking" className="self-start border border-[#E43E3D] text-[#111] hover:bg-[#E43E3D] hover:text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] py-3.5 px-8 rounded-full transition-colors inline-block text-center mt-auto">
              Book Now
            </a>
          </div>

          {/* Card 2 (Highlighted) */}
          <div className="flex-1 bg-[#E43E3D] p-10 flex flex-col relative z-10 md:scale-105 shadow-2xl">
            <h3 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-4">
              <span className="text-3xl sm:text-4xl align-top mr-1">$</span>20k
            </h3>
            <h4 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-4">
              Ceramic 3M
            </h4>
            <p className="text-white/90 text-sm leading-[1.8] font-medium grow mb-10">
              Protect your car&apos;s paint with a durable 3M ceramic coating that resists scratches, UV rays, and chemicals while boosting gloss.
            </p>
            <a href="#booking" className="self-start border border-white text-white hover:bg-white hover:text-[#E43E3D] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] py-3.5 px-8 rounded-full transition-colors inline-block text-center mt-auto">
              Book Now
            </a>
          </div>

          {/* Card 3 */}
          <div className="flex-1 bg-white p-10 flex flex-col">
            <h3 className="text-5xl sm:text-6xl font-black text-[#E43E3D] tracking-tighter mb-4">
              <span className="text-3xl sm:text-4xl align-top mr-1">$</span>20k
            </h3>
            <h4 className="text-2xl sm:text-3xl font-black text-[#111] uppercase tracking-tighter mb-4">
              20L Polish
            </h4>
            <p className="text-gray-600 text-sm leading-[1.8] font-medium grow mb-10">
              Renew your car&apos;s brilliance with expert polishing that clears swirl marks, scratches, and oxidation for a sleek glossy finish.
            </p>
            <a href="#booking" className="self-start border border-[#E43E3D] text-[#111] hover:bg-[#E43E3D] hover:text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] py-3.5 px-8 rounded-full transition-colors inline-block text-center mt-auto">
              Book Now
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PricingSection;
