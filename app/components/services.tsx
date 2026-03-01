import Image from "next/image";

const servicesData = [
  {
    title: "CAR WASH",
    description: "A comprehensive cleaning process inside and out. We ensure every nook and cranny of your vehicle is spotless, restoring its original showroom shine with our top-tier washing approach.",
    image: "/car_wash.png"
  },
  {
    title: "CERAMIC COATING",
    description: "A protective liquid polymer applied to a vehicle's exterior, bonding with the paint to form a highly durable, hydrophobic shield that ensures long-lasting protection and a brilliant, glossy shine.",
    image: "/ceramic_coating.png"
  },
  {
    title: "PAINT PROTECTION FILM",
    description: "An invisible layer of defense against rock chips, scratches, and elemental damage. Our precise PPF installation keeps your car looking pristine without compromising the original paint.",
    image: "/ppf_installation.png"
  },
  {
    title: "WINDOW TINT",
    description: "Enhance privacy, reduce glare, and protect your interior from harmful UV rays. We use premium tint films that offer superior heat rejection and a sleek dark finish.",
    image: "/window_tint.png"
  },
  {
    title: "ECU REMAP",
    description: "Unlock your engine's true potential. Our advanced ECU remapping improves horsepower, torque, and fuel efficiency by fine-tuning your vehicle's software parameters.",
    image: "/engine_remap.png"
  },
  {
    title: "PERFORMANCE TUNING",
    description: "Elevate your driving experience. From suspension upgrades to exhaust modifications, our high-performance tuning services guarantee optimal vehicle dynamics on the road.",
    image: "/performance_tuning.png"
  }
];

export const ServicesList = () => {
  return (
    <section id="services" className="w-full bg-white relative font-sans text-black py-24 sm:py-32 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-16 lg:gap-32">
        
        {/* Left Side: Sticky Information */}
        <div className="w-full md:w-[35%] lg:w-[30%]">
          <div className="md:sticky md:top-32 border-l-4 border-[#E43E3D] pl-6 flex flex-col items-start text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-[#111] mb-6">
              Complex <br /> Services
            </h2>
            <p className="text-gray-600 font-medium leading-relaxed mb-10 max-w-sm">
              Splash offers a range of customizable services to cater to your specific needs.
            </p>
            <a href="#services" className="bg-transparent border border-gray-800 text-[#111] hover:bg-gray-100 hover:border-black font-black text-xs uppercase tracking-widest py-3 px-8 rounded-full transition-all inline-block text-center">
              View All Services
            </a>
          </div>
        </div>

        {/* Right Side: Scrollable List items */}
        <div className="w-full md:w-[65%] lg:w-[70%] flex flex-col gap-20">
          {servicesData.map((service, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14 w-full">
              {/* Image side */}
              <div className="w-full lg:w-1/2 overflow-hidden bg-gray-100 max-h-125">
                <div className="relative w-full aspect-4/5 sm:aspect-3/4 lg:aspect-4/5">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2 flex flex-col items-start justify-center lg:pt-10 text-left">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-[#111] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-[1.8] font-medium mb-8">
                  {service.description}
                </p>
                <a href="#services" className="uppercase font-black text-xs tracking-widest text-[#111] hover:text-[#E43E3D] transition-colors border-b-2 border-transparent hover:border-[#E43E3D] pb-1">
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesList;
