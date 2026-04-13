import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { brandConfig } from "../../../brand.config";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              {brandConfig.logoText}
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              {brandConfig.storeDescription}
            </p>
            <div className="flex gap-4">
              {brandConfig.social.instagram && (
                <a
                  href={brandConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hizli Erisim</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/urunler" className="hover:text-white transition-colors">
                  Tum Urunler
                </Link>
              </li>
              <li>
                <Link href="/hesabim" className="hover:text-white transition-colors">
                  Hesabim
                </Link>
              </li>
              <li>
                <Link href="/hesabim/siparisler" className="hover:text-white transition-colors">
                  Siparis Takibi
                </Link>
              </li>
              <li>
                <Link href="/sepet" className="hover:text-white transition-colors">
                  Sepetim
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Hakkimizda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Mesafeli Satis Sozlesmesi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Gizlilik Politikasi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Iade ve Degisim
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  KVKK Aydinlatma Metni
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Iletisim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{brandConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <span>{brandConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                <span>{brandConfig.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {brandConfig.legal.companyName}. Tum haklari
            saklidir.
          </p>
          <div className="flex items-center gap-2">
            <span className="bg-gray-800 px-2 py-1 rounded">iyzico ile guvenli odeme</span>
            <span className="bg-gray-800 px-2 py-1 rounded">256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
