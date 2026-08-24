import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import aquaLogo from "@/assets/aquaponics-logo.png";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Comparativa", path: "/comparativa" },
  { label: "Minijuego", path: "/juego" },
  { label: "Simulación", path: "/simulacion" },
  { label: "Monitoreo", path: "/monitoreo" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img src={aquaLogo} alt="CEMOS Acuaponía" className="h-10 w-10" width={40} height={40} />
          <div>
            <span className="font-display font-bold text-lg text-foreground">CEMOS Acuaponia</span>
            <span className="hidden sm:block text-xs text-muted-foreground">Semillero de Investigación</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-card p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
