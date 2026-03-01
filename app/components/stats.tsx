import Image from "next/image";

export const StatsSection = () => {
  return (
    <section id="stats" className="relative w-full min-h-[80vh] flex items-center bg-[#0a0f12] overflow-hidden font-sans">
      
      {/* Background (Using Image as a placeholder for a Video) */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-50">
        {/* Placeholder image that looks like a still from a detailed car video */}
        <Image
          src="/stats_bg.png" 
          alt="Car Detailed Video Background Placeholder"
          fill
          className="object-cover animate-slow-pan"
        />
        {/* Dark Reddish Gradient Overlay to match design */}
        <div className="absolute inset-0 bg-[#2b1b1a]/70 mix-blend-multiply"></div>
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between z-10 py-20 gap-16">
        
        {/* Left Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-start pr-0 md:pr-10 text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[70px] font-black uppercase tracking-tighter text-white leading-[0.9] mb-8 drop-shadow-lg">
            We Have <br />
            Mastered The <br />
            Art of Detailing
          </h2>
          <p className="text-white/80 font-medium leading-[1.8] max-w-md drop-shadow-md">
            With years of dedication, we&apos;ve perfected the craft of car detailing, delivering unmatched care and precision to every vehicle we service.
          </p>
        </div>

        {/* Right Stats Card */}
        <div className="w-full md:w-1/2 max-w-lg bg-[#111111] p-10 sm:p-14 shadow-2xl relative">
          
          {/* Top Big Stat */}
          <div className="mb-14">
            <h3 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-2">12+</h3>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Years Experience</p>
          </div>

          {/* Stat Item 1 */}
          <div className="relative pl-6 mb-12">
            <div className="absolute left-0 top-1 bottom-1 w-0.75 bg-[#E43E3D]"></div>
            <h4 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-3">
              Professional Services
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 leading-[1.8] font-medium">
              From exterior washes to full interior detailing, we proudly provide a wide range of premium services carefully designed to keep your car spotless, protected, and always looking like new.
            </p>
          </div>

          {/* Stat Item 2 */}
          <div className="relative pl-6 mb-12">
            <div className="absolute left-0 top-1 bottom-1 w-0.75 bg-[#E43E3D]"></div>
            <h4 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-3">
              High-End Equipment
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 leading-[1.8] font-medium">
              We use advanced tools, eco-friendly products, and modern techniques to ensure the absolute highest level of quality, efficiency, and reliable, long-lasting care for your vehicle.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default StatsSection;
