import {useState} from "react";
import {api} from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {useToast} from "@/hooks/use-toast";

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const AddCategoryDialog = ({
                                      open,
                                      onOpenChange,
                                      onSuccess,
                                  }: AddCategoryDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        active: true
    });
    const [errors, setErrors] = useState({
        name: "",
        description: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({...prev, [name]: ""}));
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({...prev, active: checked}));
    };

    const validate = () => {
        const newErrors = {
            name: "",
            description: ""
        };
        let isValid = true;

        if (!formData.name || formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
            isValid = false;
        }

        // if (!formData.description || formData.description.length < 10) {
        //     newErrors.description = "Description must be at least 10 characters";
        //     isValid = false;
        // }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post("/categories", formData);
            if (!response || response.status !== 201) {
                throw new Error("Failed to create category");
            }
            setFormData({
                name: "",
                description: "",
                active: true
            });
            onSuccess();
            toast({
                title: "Success",
                description: "Category created successfully",
            });
        } catch (error) {
            console.error("Error creating category:", error);
            toast({
                title: "Error",
                description: "Failed to create category",
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
                    <DialogTitle className="text-ssa-gold">Add New Category</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Create a new category for your services.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-gray-300 block mb-2">Name</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter category name"
                            className="bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-gray-300 block mb-2">Description</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter category description"
                            className="bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>
                    <div className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                            <label className="text-gray-300">Active Status</label>
                            <div className="text-sm text-gray-400">
                                Enable or disable this category
                            </div>
                        </div>
                        <Switch
                            checked={formData.active}
                            onCheckedChange={handleSwitchChange}
                            className="data-[state=checked]:bg-ssa-gold"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-ssa-gold to-ssa-gold/70 hover:from-ssa-gold/90 hover:to-ssa-gold/60 text-gray-900 font-medium"
                        >
                            {isLoading ? "Creating..." : "Create Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

