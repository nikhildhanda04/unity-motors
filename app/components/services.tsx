import Image from "next/image";
import { FadeIn } from "./scroll-anim";

const serviceCategories = [
  {
    category: "Detailing",
    description: "Premium detailing services to make your car look brand new, inside and out.",
    image: "/9.jpg",
    services: [
      "Normal car wash",
      "All type of Skirting ",
      "Denting & Painting",
      "Deep car wash (includes degreaser)",
      "Semi ceramic",
      "Ceramic (T-Gloss, 3M, Wave X)",
      "Graphene coating",
      "PPF (Paint Protection Film)",
      "Vinyl wraps",
      "Peelable Paint",
      "Hydrodipping",
      "Legally Paint Change"
    ]
  },
  {
    category: "Engine",
    description: "Performance upgrades and engine maintenance for maximum power and reliability.",
    image: "/5.jpg",
    services: [
      "Service",
      "Deep clog clean",
      "ECU Remap",
      "Engine upgrade",
      "Exhaust system",
      "Flames",
      "Air suspension",
      "Suspension upgrade"
    ]
  },
  {
    category: "Exclusive",
    description: "Custom 3D printing solutions for rare and expensive parts.",
    image: "/7.jpg",
    services: [
      "3D Printing OEM",
      "No more expensive German OEM parts. Make your own - come to our office and tell us the part description."
    ]
  }
];

export const ServicesList = () => {
  return (
    <section id="services" className="w-full bg-[black]  font-sans text-white py-24 sm:py-32 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col xl:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Sticky Information */}
        <div className="w-full xl:w-[30%]">
          <div className="xl:sticky xl:top-32">
            <FadeIn>
              <div className="border-l-4 border-[#E43E3D] pl-6 flex flex-col items-start text-left">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6">
                  Complex <br /> Services
                </h2>
                <p className="text-gray-400 font-medium leading-relaxed mb-10 max-w-sm">
                  We offer a comprehensive range of customizable services to cater to your specific automotive needs. From detailing to serious engine upgrades.
                </p>
                {/* <a href="#services" className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600 font-black text-xs uppercase tracking-widest py-3 px-8 rounded-full transition-all inline-block text-center">
                  View All Services
                </a> */}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right Side: Scrollable List items */}
        <div className="w-full xl:w-[70%] flex flex-col gap-24">
          {serviceCategories.map((cat, idx) => (
            <FadeIn key={idx}>
              <div className="flex flex-col w-full group">
                {/* Category Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-2 flex items-center gap-4">
                      <span className="text-[#E43E3D] text-xl font-bold">0{idx + 1}</span> 
                      {cat.category}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base font-medium max-w-xl">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Image side */}
                  <div className="w-full lg:w-1/2 overflow-hidden bg-[#1a1a1a] relative max-h-100 lg:h-auto min-h-75">
                    <Image
                      src={cat.image}
                      alt={cat.category}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Services List */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <ul className="flex flex-col gap-4">
                      {cat.services.map((service, s_idx) => (
                        <li key={s_idx} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center shrink-0 border border-gray-800 mt-0.5">
                            <svg className="w-3 h-3 text-[#E43E3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-base font-bold text-gray-200 leading-snug">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesList;
