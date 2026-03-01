'use client'

import Image from "next/image";


export const BookingSection = () => {
  return (
    <section id="booking" className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#0a0f12] overflow-hidden font-sans py-20">
      
      {/* Background with Slow Pan */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/booking_bg.png" 
          alt="Cinematic car windshield background"
          fill
          className="object-cover animate-slow-pan opacity-60"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* Left Side: Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-black uppercase text-white tracking-tighter leading-[0.85] mb-8">
            Let&apos;s Book An <br /> Appointment
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-md font-medium">
            Ready for a spotless ride? Book your appointment now and let our expert team take the best care of your car.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 max-w-lg bg-white p-8 sm:p-12 shadow-2xl relative">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-gray-600 text-xs font-semibold mb-2">Full name*</label>
                <input 
                  type="text" 
                  placeholder="Jay Sharma"
                  className="w-full border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#E43E3D] focus:ring-1 focus:ring-[#E43E3D] transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-gray-600 text-xs font-semibold mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="jaay123@email.com"
                  className="w-full border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#E43E3D] focus:ring-1 focus:ring-[#E43E3D] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-gray-600 text-xs font-semibold mb-2">Phone number*</label>
                <input 
                  type="tel" 
                  placeholder="+91 1234567890"
                  className="w-full border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#E43E3D] focus:ring-1 focus:ring-[#E43E3D] transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-gray-600 text-xs font-semibold mb-2">Vehicle type</label>
                <input 
                  type="text" 
                  placeholder="Honda City"
                  className="w-full border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#E43E3D] focus:ring-1 focus:ring-[#E43E3D] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-xs font-semibold mb-2">Additional requests*</label>
              <textarea 
                placeholder="Let us know if you have any specific needs or concerns..."
                rows={4}
                className="w-full border border-gray-300 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#E43E3D] focus:ring-1 focus:ring-[#E43E3D] transition-colors resize-none"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="mt-4 bg-[#E43E3D] hover:bg-[#c93231] text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-full transition-colors w-fit shadow-lg shadow-red-500/20"
            >
              Submit Message
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default BookingSection;
