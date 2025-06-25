import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageUploader } from "@/components/shared/ImageUploader";

interface Service {
    id: number;
    name: string;
}

interface AddPortfolioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddPortfolioDialog({ open, onOpenChange, onSuccess }: AddPortfolioDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [serviceId, setServiceId] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [links, setLinks] = useState<string[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const { toast } = useToast();

    // Load services when dialog opens
    const loadServices = async () => {
        try {
            const response = await api.get("/services");
            if (response.status === 200) {
                setServices(response.data);
            }
        } catch (error) {
            console.error("Error loading services:", error);
            toast({
                title: "Error",
                description: "Failed to load services",
                variant: "destructive",
            });
        } finally {
            setIsLoadingServices(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadServices();
        }
    }, [open]);

    const handleAddLink = () => {
        setLinks([...links, ""]);
    };

    const handleRemoveLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const portfolioData = {
                title,
                description: description || undefined,
                serviceId: parseInt(serviceId),
                images,
                links: links.filter(link => link.trim() !== ""),
            };

            const response = await api.post("/portfolios", portfolioData);

            if (response.status === 201) {
                toast({
                    title: "Success",
                    description: "Portfolio added successfully",
                });
                onSuccess();
                onOpenChange(false);
                // Reset form
                setTitle("");
                setDescription("");
                setServiceId("");
                setImages([]);
                setLinks([]);
            }
        } catch (error) {
            console.error("Error adding portfolio:", error);
            toast({
                title: "Error",
                description: "Failed to add portfolio",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
                        Add New Portfolio
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300">Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter portfolio title"
                                className="mt-1 bg-gray-800/50 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
                            <div className="mt-1 bg-gray-800/50 border border-gray-700 rounded-md">
                                <ReactQuill
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Enter portfolio description"
                                    className="bg-gray-800 text-gray-300"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                            ['link'],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">Service</label>
                            <Select
                                value={serviceId}
                                onValueChange={setServiceId}
                                required
                            >
                                <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700 text-gray-300">
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {isLoadingServices ? (
                                        <div className="flex items-center justify-center p-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-ssa-gold" />
                                        </div>
                                    ) : (
                                        services.map((service) => (
                                            <SelectItem
                                                key={service.id}
                                                value={service.id.toString()}
                                                className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold"
                                            >
                                                {service.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">Images</label>
                            <div className="mt-1">
                                <ImageUploader
                                    images={images}
                                    onChange={setImages}
                                    maxImages={5}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">Links (Optional)</label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddLink}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Link
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {links.map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={link}
                                            onChange={(e) => handleLinkChange(index, e.target.value)}
                                            placeholder="Enter link URL (e.g., https://example.com)"
                                            className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveLink(index)}
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-red-400"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {links.length === 0 && (
                                    <p className="text-sm text-gray-500">
                                        No links added. Click "Add Link" to add project links.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
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
                            className="bg-gradient-to-r from-ssa-gold to-ssa-gold hover:px-5 text-gray-900 font-medium transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Portfolio"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 