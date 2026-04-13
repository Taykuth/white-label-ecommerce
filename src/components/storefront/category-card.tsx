import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string | null;
  productCount?: number;
}

export function CategoryCard({ name, slug, image, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/kategori/${slug}`}
      className="group relative overflow-hidden rounded-lg aspect-[4/3] block"
    >
      {image && (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-semibold text-lg">{name}</h3>
        {productCount !== undefined && (
          <p className="text-white/70 text-sm">{productCount} urun</p>
        )}
      </div>
    </Link>
  );
}
