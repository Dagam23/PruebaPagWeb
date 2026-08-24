import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "bot";
  text: string;
}

const botResponses: Record<string, string> = {
  default: "¡Hola! Soy AquaBot 🐟 Puedo ayudarte con información sobre acuaponía, cotizaciones y soporte técnico. ¿En qué te puedo ayudar?",
  acuaponia: "La acuaponía combina la acuicultura (cría de peces) con la hidroponía (cultivo de plantas sin suelo). Los desechos de los peces fertilizan las plantas, y las plantas purifican el agua para los peces. ¡Es un ciclo perfecto! 🌱🐟",
  precio: "Un sistema básico casero puede costar entre $200-500 USD. Un sistema mediano entre $1,000-3,000 USD. Para cotización personalizada, envíanos los detalles de tu espacio y necesidades a cemos@universidad.edu.co",
  peces: "Los peces más comunes en acuaponía son: Tilapia (más popular), Trucha (aguas frías), Carpa, Bagre y peces ornamentales como Koi. La tilapia es ideal para principiantes. 🐟",
  plantas: "Las mejores plantas para acuaponía son: Lechuga, Albahaca, Tomate, Pepino, Espinaca, Cilantro y Fresas. Las hojas verdes son las más fáciles para empezar. 🌿",
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("acuapon") || lower.includes("qué es") || lower.includes("sistema")) return botResponses.acuaponia;
  if (lower.includes("precio") || lower.includes("costo") || lower.includes("cotiza")) return botResponses.precio;
  if (lower.includes("pez") || lower.includes("peces") || lower.includes("tilapia")) return botResponses.peces;
  if (lower.includes("planta") || lower.includes("cultiv") || lower.includes("lechuga")) return botResponses.plantas;
  return "Gracias por tu pregunta. Te sugiero explorar nuestros módulos educativos para más información, o escríbenos a cemos@universidad.edu.co para consultas específicas. 😊";
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: botResponses.default },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getResponse(userMsg) }]);
    }, 600);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full gradient-nature flex items-center justify-center shadow-nature animate-pulse-glow transition-transform hover:scale-110"
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[28rem] glass-card flex flex-col overflow-hidden">
          <div className="gradient-nature px-4 py-3 flex items-center justify-between">
            <span className="font-display font-semibold text-primary-foreground">🐟 AquaBot</span>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={send} className="h-9 w-9 rounded-lg gradient-nature flex items-center justify-center text-primary-foreground">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
