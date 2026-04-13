"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { brandConfig } from "../../../brand.config";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4 md:p-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 max-w-2xl">
          {brandConfig.legal.kvkkText}{" "}
          Bu site, deneyiminizi iyilestirmek icin cerezler kullanmaktadir.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={accept}>
            Reddet
          </Button>
          <Button size="sm" onClick={accept}>
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}
