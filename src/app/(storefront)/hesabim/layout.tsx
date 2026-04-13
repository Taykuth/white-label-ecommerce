import Link from "next/link";
import { User, Package, MapPin } from "lucide-react";

const sidebarLinks = [
  { href: "/hesabim", label: "Hesabim", icon: User },
  { href: "/hesabim/siparisler", label: "Siparislerim", icon: Package },
  { href: "/hesabim/adresler", label: "Adreslerim", icon: MapPin },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <h2 className="font-bold text-lg mb-4">Hesabim</h2>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
