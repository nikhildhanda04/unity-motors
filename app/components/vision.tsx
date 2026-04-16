import Image from "next/image";

export const VisionSection = () => {
  return (
    <section id="vision" className="relative w-full bg-[#0a0f12] font-sans py-24 sm:py-32 flex flex-col items-center overflow-hidden border-t border-gray-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E43E3D] rounded-full blur-[150px] opacity-10 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center w-full">
        <div className="text-center w-full max-w-5xl flex flex-col items-center justify-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 z-10">
            Our Vision
          </h2>

          <div className="mb-10 flex flex-col items-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#E43E3D] relative shadow-[0_0_30px_rgba(228,62,61,0.2)] mb-6 z-10">
              <Image
                src="/vision.jpeg"
                alt="Owner Unity Motors"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="text-left max-w-4xl w-full">
            <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed mb-8">
              Unity Motors – Built from Passion, Driven by Vision.
            </p>

            <div className="relative pl-8 sm:pl-10 space-y-7">
              <div className="absolute left-2.5 sm:left-3 top-2 bottom-2 w-px bg-gray-700"></div>

              <div className="relative">
                <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-[#E43E3D] shadow-[0_0_10px_rgba(228,62,61,0.7)]"></div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Started in childhood by washing cars with my father, which built my love for detailing and care.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-[#E43E3D] shadow-[0_0_10px_rgba(228,62,61,0.7)]"></div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Built business discipline through Coca-Cola distribution and non-ferrous metals importing.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-[#E43E3D] shadow-[0_0_10px_rgba(228,62,61,0.7)]"></div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Even with success in other industries, my automotive passion always remained.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-[#E43E3D] shadow-[0_0_10px_rgba(228,62,61,0.7)]"></div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Unity Motors was created as a one-stop automotive hub under one roof.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-[#E43E3D] shadow-[0_0_10px_rgba(228,62,61,0.7)]"></div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Services cover A-to-Z needs: repair, detailing, mods, tuning, ECU, suspension, and genuine parts.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-[#E43E3D] shadow-[0_0_10px_rgba(228,62,61,0.7)]"></div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  The mission is to deliver the best people, service, and results for every car enthusiast and customer.
                </p>
              </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default VisionSection;
