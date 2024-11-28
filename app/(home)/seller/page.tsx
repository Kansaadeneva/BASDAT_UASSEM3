"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useCookies } from "react-cookie";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Make imageUrl optional
  username: string;
};

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  imageUrl?: string; // Make imageUrl optional
  username: string;
};

export default function ProductsCRUD() {
  const [products, setProducts] = useState<Product[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [cookies] = useCookies(["user"]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !cookies.user) {
      router.push("/signin");
    } else if (isClient) {
      fetchProducts();
    }
  }, [isClient, cookies.user, router]);

  const fetchProducts = async () => {
    try {
      const username = cookies.user?.username || "";
      const response = await axios.get("/api/product", {
        params: { username },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: ProductFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      username: cookies.user?.username || "",
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      handleCloseDialogs();
      fetchProducts();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to submit product");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Product submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (data: ProductFormData) => {
    console.log(data);
    await axios.post("/api/product", null, { params: data });
  };

  const updateProduct = async (id: string, data: ProductFormData) => {
    await axios.put("/api/product", null, { params: { id, ...data } });
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete("/api/product", { params: { id } });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    }
  };

  const handleCloseDialogs = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setEditingProduct(null);
    setError(null);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setError(null);
    setIsEditOpen(true);
  };

  if (!isClient) {
    return null;
  }

  if (!cookies.user) {
    return null;
  }

  const username = cookies.user.username;

  return (
    <div className="container mx-auto py-10">
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialogs();
          else openCreateModal();
        }}
      >
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Create Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            username={username}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialogs();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            initialData={editingProduct}
            username={username}
          />
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={
                    product.imageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/0/01/Teh_Botol_Sosro.jpg"
                  }
                  width={100}
                  height={100}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.username}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-2"
                  onClick={() => openEditModal(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface ProductFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  initialData?: Product | null;
  username: string;
}

function ProductForm({
  onSubmit,
  isLoading,
  error,
  initialData,
  username,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Product name"
          defaultValue={initialData?.name}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Product description"
          defaultValue={initialData?.description}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="Product price"
          defaultValue={initialData?.price}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          placeholder="https://example.com/image.jpg"
          defaultValue={initialData?.imageUrl}
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={username}
          required
          disabled={true}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
