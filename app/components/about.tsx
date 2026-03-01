import Image from "next/image";

export const AboutSection = () => {
  return (
    <section id="about" className="relative w-full min-h-screen bg-white flex flex-col items-center justify-center font-sans tracking-wide py-20 px-4 overflow-hidden">
      
      {/* Top Heading */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black uppercase text-center text-[#111] leading-[0.9] tracking-tighter max-w-4xl mx-auto mb-16 sm:mb-24 z-10 relative">
        We Believe Car Care Should Be <br className="hidden sm:block" /> More Than Just A Rinse.
      </h2>

      {/* Center Image Fan (Polaroids) */}
      <div className="relative w-full max-w-3xl h-[250px] sm:h-[400px] flex items-center justify-center mb-16 sm:mb-24 perspective-1000">
        
        {/* Image 1 (Leftmost) */}
        <div className="absolute w-[140px] h-[200px] sm:w-[220px] sm:h-[320px] bg-white p-2 pb-6 sm:pb-8 shadow-2xl -translate-x-[45%] sm:-translate-x-[60%] rotate-[-12deg] z-10 transition-transform duration-500 hover:rotate-[-5deg] hover:scale-110 hover:z-50 cursor-pointer">
          <div className="relative w-full h-full bg-gray-200 overflow-hidden">
            <Image src="/hero1.avif" alt="Car Detail 1" fill className="object-cover" />
          </div>
        </div>

        {/* Image 2 (Mid-Left) */}
        <div className="absolute w-[150px] h-[220px] sm:w-[240px] sm:h-[340px] bg-white p-2 pb-6 sm:pb-8 shadow-2xl -translate-x-[15%] sm:-translate-x-[20%] rotate-[-4deg] z-20 transition-transform duration-500 hover:rotate-0 hover:scale-110 hover:z-50 cursor-pointer">
          <div className="relative w-full h-full bg-gray-200 overflow-hidden">
             <Image src="/car.png" alt="Car Detail 2" fill className="object-cover" />
          </div>
        </div>

        {/* Image 3 (Mid-Right) */}
        <div className="absolute w-[150px] h-[220px] sm:w-[240px] sm:h-[340px] bg-white p-2 pb-6 sm:pb-8 shadow-2xl translate-x-[15%] sm:translate-x-[20%] rotate-[4deg] z-30 transition-transform duration-500 hover:rotate-0 hover:scale-110 hover:z-50 cursor-pointer">
          <div className="relative w-full h-full bg-gray-200 overflow-hidden">
             <Image src="/carr.png" alt="Car Detail 3" fill className="object-cover" />
          </div>
        </div>

        {/* Image 4 (Rightmost) */}
        <div className="absolute w-[140px] h-[200px] sm:w-[220px] sm:h-[320px] bg-white p-2 pb-6 sm:pb-8 shadow-2xl translate-x-[45%] sm:translate-x-[60%] rotate-[12deg] z-40 transition-transform duration-500 hover:rotate-[5deg] hover:scale-110 hover:z-50 cursor-pointer">
          <div className="relative w-full h-full bg-gray-200 overflow-hidden">
             <Image src="/hero2.avif" alt="Car Detail 4" fill className="object-cover" />
          </div>
        </div>
        
      </div>

      {/* Bottom Description */}
      <div className="max-w-xl mx-auto text-center z-10">
        <p className="text-gray-600 font-medium text-sm sm:text-base leading-[1.8] mb-10 px-4">
          That&apos;s why we combine advanced detailing techniques, premium products, and a customer-first approach to deliver results that truly stand out.
        </p>

        {/* Buttons List */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-6">
          <a href="#about" className="bg-[#E43E3D] hover:bg-[#c93231] text-white font-black text-[11px] sm:text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors shadow-lg inline-block text-center">
            About Us
          </a>
          <a href="#services" className="bg-transparent border border-gray-300 hover:border-gray-500 text-black font-black text-[11px] sm:text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors shadow-sm inline-block text-center">
            Services
          </a>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;
