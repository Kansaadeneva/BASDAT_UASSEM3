import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import ProductDetail from "@/components/blocks/product-detail";

const prisma = new PrismaClient();

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
    </div>
  );
}
