import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const suwannaphum = localFont({
  src: "../../public/Suwannaphum-Regular.ttf",
  variable: "--font-suwannaphum",
  display: "swap",
});
