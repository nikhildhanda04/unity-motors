import Image from "next/image";

const navbar = () => {
  return (
    <div className="flex bg-black flex-row justify-center md:justify-center items-center w-full px-4 sm:px-8 md:px-20 py-4 md:py-6">

        <div className="flex flex-col items-center gap-0 sm:gap-0 lg:gap-0">
            <div className="relative w-12 h-12 md:w-26 md:h-26 shrink-0">
                <Image src="/logo.jpeg" alt="Unity Motors Logo" fill className="object-contain" priority />
            </div>
            <div className="font-primary text-5xl md:text-6xl text-gray-500 text-center">
                Unity Motors
            </div>
        </div>

    </div>
  )
}

export default navbar;
