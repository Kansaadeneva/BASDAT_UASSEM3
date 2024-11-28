"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProductWithUser = Product & { user: User };

export default function ProductDetail({
  product,
}: {
  product: ProductWithUser;
}) {
  const [quantity, setQuantity] = useState(1);

  const handleBuy = () => {
    // Implement buy functionality here
    console.log(`Buying ${quantity} of ${product.name}`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>By {product.user.fullName}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="aspect-square relative">
            <Image
              src={
                product.imageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/0/01/Teh_Botol_Sosro.jpg"
              }
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="space-y-4">
            <p>{product.description}</p>
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBuy} className="w-full">
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
