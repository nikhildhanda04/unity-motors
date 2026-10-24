import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrolling } from "./components/smooth-scrolling";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  // Without this, car openGraph images resolve against localhost.
  metadataBase: new URL("https://unitymotor.in"),
  title: "Unity Motors - Premier Car Detailing in Karnal",
  description: "Experience Karnal's best car detailing service. At Unity Motors, we provide premium car wash, ceramic coating, paint protection, and deep cleaning services.",
  keywords: ["car detailing", "car wash Karnal", "ceramic coating Karnal", "paint protection", "auto detailing", "Unity Motors"],
  authors: [{ name: "Unity Motors" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Unity Motors - Premier Car Detailing in Karnal",
    description: "Experience Karnal's best car detailing service. At Unity Motors, we provide premium car wash, ceramic coating, paint protection, and deep cleaning services.",
    url: "https://unitymotor.in",
    siteName: "Unity Motors",
    images: [
      {
        url: "/hero_bg_unity.png", 
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
      {/* Every photo is served from Cloudinary; opening the connection during
          HTML parse cuts the TLS handshake off the first image's critical path. */}
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        {/* Direction contract. display:contents so it adds no box; dangerouslySetInnerHTML
            because JSX comments never reach the emitted HTML and an unauditable
            contract is no contract. */}
        <div
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: `<!--
  THESIS: Stock as a register of prepared cars, not a classifieds grid. Refuses
  the uniform photo-card grid every used-car site ships, because our photos are
  phone snaps and our argument is preparation, not gloss.
  OWN-WORLD: Near-black grounds (#0a0f12 / #111 / black), one red #E43E3D.
  Poppins black uppercase at display scale, tracking-tighter. Hard edges, no
  rounded corners, hairline rules, heavy offset shadows. The incumbent
  hero/stats language, never the rounded-card language.
  STORY: A buyer scans a short serious register, sees the workshop prepared
  each car, opens one, and enquires on WhatsApp with that car named.
  FIRST VIEWPORT: STOCK at display scale over a hairline, count at the right,
  then two register entries already visible: year, locked photo crop, title,
  prep line, specs, price. Enquiry pinned on the car page.
  FORM: Auction-catalogue ledger. Candidate 3 of 7. Seed key ed6158d9.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, and DESIGN.md
-->` }}
        />

        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
