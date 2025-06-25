import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DeletePortfolioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    portfolioId: number;
    portfolioTitle: string;
    onSuccess: () => void;
}

export function DeletePortfolioDialog({ open, onOpenChange, portfolioId, portfolioTitle, onSuccess }: DeletePortfolioDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            const response = await api.delete(`/portfolios/${portfolioId}`);

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Portfolio deleted successfully",
                });
                onSuccess();
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Error deleting portfolio:", error);
            toast({
                title: "Error",
                description: "Failed to delete portfolio",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
                        Delete Portfolio
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Are you sure you want to delete the portfolio "{portfolioTitle}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Portfolio"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 