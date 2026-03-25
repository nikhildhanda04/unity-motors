import Image from "next/image";

const navbar = () => {
  return (
    <div className="flex bg-black flex-row justify-center md:justify-between items-center w-full px-4 sm:px-8 md:px-20 py-4 md:py-6">

        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <div className="relative w-12 h-12 md:w-26 md:h-26 shrink-0">
                <Image src="/logo.jpeg" alt="Unity Motors Logo" fill className="object-contain" priority />
            </div>
            <div className="font-primary text-5xl md:text-6xl text-white text-center pt-2">
                Unity Motors
            </div>
        </div>

    </div>
  )
}

export default navbar;
