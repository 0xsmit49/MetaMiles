import { Geist, Geist_Mono, Holtwood_One_SC } from "next/font/google";
import "@workspace/ui/globals.css";


const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Add Holtwood One SC
const fontHoltwood = Holtwood_One_SC({
  weight: "400", // Only available weight
  subsets: ["latin"],
  variable: "--font-holtwood",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Your existing font links */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Lato:wght@100;300;400;700;900&family=Source+Sans+Pro:wght@200;300;400;600;700;900&family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Add Holtwood One SC */}
        <link
          href="https://fonts.googleapis.com/css2?family=Holtwood+One+SC&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontHoltwood.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}