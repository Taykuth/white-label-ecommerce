import type { Product, Category, ProductImage, ProductVariant, Order, OrderItem, User, Address } from "@prisma/client";

export type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category | null;
};

export type ProductWithImages = Product & {
  images: ProductImage[];
};

export type CategoryWithChildren = Category & {
  children: Category[];
  _count?: { products: number };
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
  user: Pick<User, "id" | "name" | "surname" | "email">;
};

export type CartItemType = {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  variantName?: string;
};

export type AddressWithUser = Address & {
  user: Pick<User, "id" | "name" | "surname">;
};
