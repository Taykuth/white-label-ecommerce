import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/admin/edit-product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    db.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Urunu Duzenle</h1>
      <EditProductForm product={product} categories={categories} />
    </div>
  );
}
