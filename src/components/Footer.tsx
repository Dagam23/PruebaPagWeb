import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => (
  <footer className="gradient-nature text-primary-foreground mt-20">
    <div className="container py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display font-bold text-xl mb-3">Semillero CEMOS Acuaponia</h3>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            Desarrollo de soluciones de automatización, sensado y control aplicadas a sistemas acuapónicos, calidad del agua y bioingeniería
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> semillerocemos@e3t.uis.edu.co</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +57 300 123 4567</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Colombia</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Redes Sociales</h4>
          <div className="flex gap-3">
            {[
              {
                name: "LinkedIn",
                url: "https://www.linkedin.com/company/cemos-acuapon%C3%ADa-uis/",
                icon: FaLinkedin,
              },
              {
                name: "Instagram",
                url: "https://www.instagram.com/cemos_uis?igsi=MTM1cWIzcnZha2NoMw==",
                icon: FaInstagram,
              },
              {
                name: "YouTube",
                url: "https://www.youtube.com/watch?v=QL72fPF1Bu0",
                icon: FaYoutube,
              },
            ].map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-sm transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/60">
        © 2026 Semillero CEMOS — Todos los derechos reservados
      </div>
    </div>
  </footer>
);

export default Footer;