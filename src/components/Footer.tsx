import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

<div>
  <h4 className="font-display font-semibold mb-3">Redes Sociales</h4>

  <div className="flex gap-3">
    {[
      {
        name: "Facebook",
        url: "https://facebook.com/tu_pagina",
        icon: FaFacebook,
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/cemos_uis?igsi=MTM1cWIzcnZha2NoMw==",
        icon: FaInstagram,
      },
      {
        name: "YouTube",
        url: "https://youtube.com/@tu_canal",
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