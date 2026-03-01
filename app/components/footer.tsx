export const FooterSection = () => {
  return (
    <footer className="w-full bg-[#111111] font-sans pt-24 pb-12 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        <div className="flex flex-col items-center text-center w-full mb-20">
   
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-6 border-t-2 border-[#E43E3D] rounded-[50%] mb-2 opacity-80"></div>
            <span className="text-white font-bold tracking-[0.3em] text-sm uppercase">Unity Motors</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] max-w-4xl mb-12">
            Turn Every Ride Into A Statement With <br className="hidden sm:block"/>
            A Perfectly Maintained Car
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
            <a href="#booking" className="bg-[#E43E3D] hover:bg-[#c93231] text-white font-black text-xs sm:text-sm uppercase tracking-widest py-4 px-8 rounded-full transition-colors shadow-lg shadow-red-500/20 inline-block text-center">
              Get An Appointment
            </a>
            <a href="#booking" className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-black text-xs sm:text-sm uppercase tracking-widest py-4 px-8 rounded-full transition-colors inline-block text-center">
              Talk To Support Team
            </a>
          </div>
        </div>

        <div className="w-full h-px bg-gray-800 mb-16"></div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 mb-16">
         
          <div className="flex flex-col gap-12 border-l border-transparent lg:border-gray-800/0">
           
            <div>
              <h4 className="text-[#E43E3D] font-black text-lg uppercase tracking-wider mb-6">Website Navigation</h4>
              <ul className="flex flex-col gap-4 text-gray-300 font-medium text-sm">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#booking" className="hover:text-white transition-colors">Book Appointment</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-12 lg:border-l lg:border-gray-800 lg:pl-12">
            <div>
              <h4 className="text-[#E43E3D] font-black text-lg uppercase tracking-wider mb-6">Karnal Office</h4>
              <p className="text-gray-300 font-medium text-sm leading-relaxed max-w-62.5">
                Karnal,<br/>Karnal 132001
              </p>
            </div>
         
            <div>
              <h4 className="text-[#E43E3D] font-black text-lg uppercase tracking-wider mb-6">Phone</h4>
              <ul className="flex flex-col gap-4 text-gray-300 font-medium text-sm">
                <li><a href="tel:+917710777775" className="hover:text-white transition-colors">+91 7710777775</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-12 lg:border-l lg:border-gray-800 lg:pl-12">
            <div>
              <h4 className="text-[#E43E3D] font-black text-lg uppercase tracking-wider mb-6">Opening Hours</h4>
              <ul className="flex flex-col gap-4 text-gray-300 font-medium text-sm">
                <li>09:00 am - 06:00 pm</li>
                <li>Monday - Friday</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="w-full h-px bg-gray-800 mb-8"></div>

        <div className="w-full text-center">
          <p className="text-gray-500 text-xs font-medium">
            Unity Motors&copy;. All rights reserved. Designed by <span className="text-gray-400">Nikhil Dhanda</span>.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;
