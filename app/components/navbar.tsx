import Image from "next/image";

const navbar = () => {
  return (
    <div className="flex bg-black flex-row justify-center md:justify-center items-center w-full px-4 sm:px-8 md:px-20 py-4 md:py-6">

        <div className="relative flex flex-col mt-4 items-center justify-center gap-0 sm:gap-0 lg:gap-0">
            <div className="absolute inset-0 mx-auto my-auto w-48 h-48 md:w-48 md:h-48 shrink-0 opacity-50 z-0">
                <Image src="/logo.jpeg" alt="Unity Motors Logo" fill className="object-contain" priority />
            </div>
            <div className="relative uppercase z-10 font-secondary tracking-tight text-7xl font-extrabold md:text-7xl text-gray-500 text-center">
                Unity Motors
            </div>
        </div>

    </div>
  )
}

export default navbar;
