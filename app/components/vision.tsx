import Image from "next/image";

export const VisionSection = () => {
  return (
    <section id="vision" className="relative w-full bg-[#0a0f12] font-sans py-24 sm:py-32 flex flex-col items-center overflow-hidden border-t border-gray-900">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E43E3D] rounded-full blur-[150px] opacity-10 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center w-full">
        
        {/* Header Section */}
        <div className="text-center w-full mb-16 max-w-4xl flex flex-col items-center justify-center">
        
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 z-10">
            Our Vision
          </h2>
          
          <div className="mb-12 flex flex-col items-center">
            {/* Circular Image Container */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#E43E3D] relative shadow-[0_0_30px_rgba(228,62,61,0.2)] mb-6 z-10">
              <Image 
                src="/visionary_founder.png" 
                alt="Founder Unity Motors" 
                fill 
                className="object-cover"
              />
            </div>
            <h3 className="text-3xl font-bold text-white uppercase tracking-widest z-10">Deepak Bajaj</h3>
            <p className="text-[#E43E3D] font-bold tracking-widest text-sm uppercase mt-2 z-10">Founder</p>
          </div>

          <p className="text-xl sm:text-2xl font-light text-gray-300 italic leading-relaxed z-10 max-w-3xl">
            &quot;We don&apos;t just clean cars. We preserve the art of engineering. Every vehicle tells a story, and we make sure it&apos;s a masterpiece.&quot;
          </p>

        </div>

        {/* Horizontal Timeline Section */}
        <div className="w-full max-w-5xl mt-16 relative">
          
          {/* Horizontal Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-0.5 bg-gray-800 z-0"></div>

          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-12 md:gap-8">
            
            {/* Step 1 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/3 relative">
              <div className="md:hidden absolute left-7 top-14 -bottom-12 w-0.5 bg-gray-800 z-0"></div>
              <div className="w-14 h-14 shrink-0 rounded-full border-4 border-[#111] bg-[#E43E3D] z-10 shadow-[0_0_15px_rgba(228,62,61,0.6)] flex items-center justify-center text-white font-bold mb-0 md:mb-6 text-sm">
                &apos;14
              </div>
              <div className="pl-6 md:pl-0 mt-2 md:mt-0">
                <h4 className="font-black text-white text-xl uppercase tracking-tighter mb-2">The Inception</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">Started in Karnal with a passion for automotive excellence. We set out to redefine standard car washing into an art of detailing.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/3 relative">
              <div className="md:hidden absolute left-7 top-14 -bottom-12 w-0.5 bg-gray-800 z-0"></div>
              <div className="w-14 h-14 shrink-0 rounded-full border-4 border-[#111] bg-[#E43E3D] z-10 shadow-[0_0_15px_rgba(228,62,61,0.6)] flex items-center justify-center text-white font-bold mb-0 md:mb-6 text-sm">
                &apos;18
              </div>
              <div className="pl-6 md:pl-0 mt-2 md:mt-0">
                <h4 className="font-black text-white text-xl uppercase tracking-tighter mb-2">Expansion</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">Upgraded our facilities to include advanced ceramic coating and PPF. Word of mouth spread, making us the fastest-growing auto studio.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-1/3 relative">
              <div className="w-14 h-14 shrink-0 rounded-full border-4 border-[#111] bg-white z-10 shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center mb-0 md:mb-6">
                 <div className="w-4 h-4 bg-[#E43E3D] rounded-full animate-pulse"></div>
              </div>
              <div className="pl-6 md:pl-0 mt-2 md:mt-0">
                <div className="text-[#E43E3D] text-xs font-black uppercase tracking-widest mb-1 md:hidden">Today</div>
                <h4 className="font-black text-white text-xl uppercase tracking-tighter mb-2">Next Gen</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">Pioneering custom 3D printed OEM parts, extreme performance tuning, and the most comprehensive luxury detailing services.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default VisionSection;
