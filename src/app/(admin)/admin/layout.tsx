import Link from "next/link";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings, ArrowLeft } from "lucide-react";
import { brandConfig } from "../../../../brand.config";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Urunler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/siparisler", label: "Siparisler", icon: ShoppingCart },
  { href: "/admin/musteriler", label: "Musteriler", icon: Users },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shrink-0 hidden md:block">
        <div className="p-4 border-b border-gray-800">
          <h1 className="font-bold text-lg">{brandConfig.logoText}</h1>
          <p className="text-xs text-gray-400">Yonetim Paneli</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Siteye Don
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        {/* Mobile header */}
        <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
          <h1 className="font-bold">{brandConfig.logoText} Admin</h1>
          <Link href="/" className="text-sm text-gray-400">Siteye Don</Link>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden bg-gray-800 overflow-x-auto">
          <div className="flex p-2 gap-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded text-xs text-gray-300 hover:bg-gray-700 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
