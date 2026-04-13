"use client";

import { MessageCircle } from "lucide-react";
import { brandConfig } from "../../../brand.config";

export function WhatsAppButton() {
  const phone = brandConfig.contact.whatsapp.replace(/\+/g, "");
  return (
    <a
      href={`https://wa.me/${phone}?text=Merhaba, bilgi almak istiyorum.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      aria-label="WhatsApp ile iletisim"
    >
      <MessageCircle size={28} />
    </a>
  );
}
