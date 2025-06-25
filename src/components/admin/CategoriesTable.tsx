import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesTableProps {
  query: string;
  refresh: number;
  onCategoriesLoaded: (categories: Category[]) => void;
}

const CategoriesTable = ({ query, refresh, onCategoriesLoaded }: CategoriesTableProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/categories");
      if (!response || response.status !== 200) {
        throw new Error("Failed to fetch categories");
      }
      const data = response.data;
      setCategories(data);
      onCategoriesLoaded(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [refresh]);

  useEffect(() => {
    if (query) {
      setCategories(categories.filter((category) => 
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.description.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      loadCategories();
    }
  }, [query]);

  const handleToggleActive = async (category: Category) => {
    try {
      await api.patch(`/categories/${category.id}`, {
        active: !category.active,
      });
      loadCategories();
      toast({
        title: "Success",
        description: "Category status updated successfully",
      });
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast({
        title: "Error",
        description: "Failed to update category status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-ssa-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Description</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Created At</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-4">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-gray-200">{category.name}</TableCell>
                  <TableCell className="text-gray-400">{category.description}</TableCell>
                  <TableCell>
                    <Switch
                      checked={category.active}
                      onCheckedChange={() => handleToggleActive(category)}
                      className="data-[state=checked]:bg-ssa-gold"
                    />
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-ssa-gold hover:bg-gray-800"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                        onClick={() => setDeletingCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null);
            loadCategories();
          }}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
          onSuccess={() => {
            setDeletingCategory(null);
            loadCategories();
          }}
        />
      )}
    </>
  );
};

export default CategoriesTable; 