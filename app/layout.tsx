import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Unity Motors - Premier Car Detailing in Karnal",
  description: "Experience Karnal's best car detailing service. At Unity Motors, we provide premium car wash, ceramic coating, paint protection, and deep cleaning services.",
  keywords: ["car detailing", "car wash Karnal", "ceramic coating Karnal", "paint protection", "auto detailing", "Unity Motors"],
  authors: [{ name: "Unity Motors" }],
  openGraph: {
    title: "Unity Motors - Premier Car Detailing in Karnal",
    description: "Experience Karnal's best car detailing service. At Unity Motors, we provide premium car wash, ceramic coating, paint protection, and deep cleaning services.",
    url: "https://unitymotors.in",
    siteName: "Unity Motors",
    images: [
      {
        url: "/hero_bg_unity.png", // Assuming this is present in the public folder and acts as a good OG image
        width: 1200,
        height: 630,
        alt: "Unity Motors Car Detailing",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unity Motors - Premier Car Detailing in Karnal",
    description: "Premium car detailing, ceramic coating, and deep cleaning services in Karnal.",
    images: ["/hero_bg_unity.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
