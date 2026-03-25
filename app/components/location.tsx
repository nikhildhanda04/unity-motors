export const LocationSection = () => {
  return (
    <section id="location" className="w-full bg-[#0a0f12] py-24 sm:py-32 font-sans overflow-hidden relative border-t border-gray-900">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
        
        {/* Text Content */}
        <div className="w-full md:w-1/3 flex flex-col items-start text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 relative z-10">
            Find  Us
          </h2>
          <div className="w-16 h-1 bg-[#E43E3D] mb-8"></div>
          
          <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Unity Motors</h3>
          <p className="text-gray-400 font-medium leading-relaxed mb-8">
            Karnal, <br />
            Haryana 132001
          </p>
          
          <a href="https://maps.app.goo.gl/QENHWtHxqtNPQV277?g_st=iwb" target="_blank" rel="noopener noreferrer" className="bg-[#E43E3D] hover:bg-[#c93231] text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors shadow-lg shadow-red-500/20 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Get Directions
          </a>
        </div>

        {/* Map */}
        <div className="w-full md:w-2/3 h-100 sm:h-125 border-4 border-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl relative z-10 bg-[#111]">
          {/* Applying styling to make Google Maps match the dark theme feel via CSS filters */}
          <iframe 
            src="https://maps.google.com/maps?q=Unity+Motors,+Karnal&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full filter grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 hover:contrast-100 transition-all duration-700"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default LocationSection;
