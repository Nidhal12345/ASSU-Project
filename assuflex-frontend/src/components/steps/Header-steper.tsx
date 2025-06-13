import { PhoneCall } from "lucide-react";
import logo from "../../assets/Orange Minimalist Logo4444.svg"
import {Link} from "react-router-dom";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="flex-shrink-0">
        <div className="aspect-3/2 object-cover">
        <Link to={"/"}>
      <img src={logo} alt="" style={{ height:"60px" }} />
      </Link>
    </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center">
          <a href="tel:+330189600006" className="flex items-center gap-1 text-sm font-medium">
            <PhoneCall className="h-4 w-4 text-blue-500" />
            <span className="hidden sm:inline text-blue-500">+33 01 89 60 00 06</span>
          </a>
        </div>
        <div className="hidden md:block text-xs text-gray-500">
          Lun - Ven (09h00 - 18h30)
        </div>
      </div>
    </header>
  );
}
