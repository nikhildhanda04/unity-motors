import Image from "next/image";

export const Hero = () => {
  return (
    <section id="home" className="relative w-full bg-white flex flex-col font-sans">
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pb-48 flex flex-col lg:flex-row items-center lg:items-start z-10 space-y-16 lg:space-y-0">
        
        <div className="w-full lg:w-[55%] pt-10 flex flex-col items-start text-left">
          <p className="text-[#E43E3D] font-bold text-xs sm:text-sm tracking-widest uppercase mb-4">
            #1 Detailing Car Services in Karnal
          </p>
          <h1 className="text-6xl sm:text-7xl xl:text-[90px] font-black text-[#111] leading-[0.85] uppercase tracking-tighter mb-8">
            Keep Your Car <br /> Clean Always
          </h1>
          <p className="text-gray-600 text-lg max-w-md mb-10 leading-relaxed font-medium">
            Unity Motors is a brand which is literally going to change the people think car cleaning.
          </p>
          <a href="#booking" className="bg-[#E43E3D] hover:bg-[#c93231] text-white font-bold py-4 px-8 rounded-full transition-colors uppercase tracking-wider text-sm shadow-xl shadow-red-500/20 inline-block text-center">
            Get An Appointment
          </a>
        </div>

        <div className="w-full lg:w-[45%] relative flex lg:justify-end mt-16 lg:mt-0">
       
          <div className="hidden lg:block absolute -top-5 right-0 w-48 h-48 bg-[#E43E3D] z-0"></div>
          
          <div className="relative z-10 flex flex-col w-full max-w-md bg-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] lg:-mr-4 xl:mr-0">
         
            <div className="relative w-full h-70 sm:h-87.5 bg-gray-200">
               <Image
                src="/carr.png"
                alt="Car Wash Detail"
                fill
                className="object-cover"
                priority
              />
            </div>
       
            <div className="bg-[#A32A29] p-10 text-white flex flex-col justify-between items-start h-70">
              <div>
                <h3 className="text-3xl sm:text-4xl font-black uppercase mb-3 tracking-tighter leading-none">
                  Drive Clean. <br/> Drive Proud.
                </h3>
                <p className="text-[13px] text-white/90 leading-[1.8] mb-6 font-light">
                  Your car deserves more than a wash &mdash; it deserves a transformation. Experience Karnal&apos;s best car detailing service today.
                </p>
              </div>
              <a href="#about" className="uppercase tracking-widest font-bold text-xs hover:text-red-200 transition-colors">
                Learn More About Us
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="relative w-full h-100 lg:h-125 -mt-50 lg:-mt-87.5 z-0">
        <Image
          src="/hero_bg_unity_front.png" 
          alt="Car background overlay"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0f12] via-[#0a0f12]/60 to-transparent"></div>
 
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-[#0a0f12] to-transparent"></div>
      </div>

    </section>
  );
};

export default Hero;
