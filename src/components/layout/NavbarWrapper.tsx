import Navbar from "./Navbar";
import { useLocation } from "react-router";

export default function NavbarWrapper() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/dashboard")) return null;
  return <Navbar />;
}