import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getImageUrl } from "@/lib/utils";

interface Service {
    id: number;
    name: string;
}

interface Portfolio {
    id: number;
    title: string;
    description: string;
    images: string[];
    serviceId: number;
    service: {
        name: string;
    };
}

interface EditPortfolioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    portfolio: Portfolio | null;
    onSuccess: () => void;
}

export function EditPortfolioDialog({ open, onOpenChange, portfolio, onSuccess }: EditPortfolioDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [serviceId, setServiceId] = useState<string>("");
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const { toast } = useToast();

    // Load services and set initial values when dialog opens
    useEffect(() => {
        if (open) {
            loadServices();
            if (portfolio) {
                setTitle(portfolio.title);
                setDescription(portfolio.description);
                setServiceId(portfolio.serviceId.toString());
                setExistingImages(portfolio.images);
            }
        }
    }, [open, portfolio]);

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

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages(Array.from(e.target.files));
        }
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!portfolio) return;
        setIsLoading(true);

        try {
            // Upload new images
            const uploadedImages: string[] = [];
            for (const image of newImages) {
                const imageFormData = new FormData();
                imageFormData.append('file', image);
                const uploadResponse = await api.post('/upload', imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (uploadResponse.data.path) {
                    uploadedImages.push(uploadResponse.data.path);
                }
            }

            // Combine existing and new images
            const allImages = [...existingImages, ...uploadedImages];

            // Update portfolio
            const portfolioData = {
                title,
                description,
                serviceId: parseInt(serviceId),
                images: allImages,
            };

            const response = await api.patch(`/portfolios/${portfolio.id}`, portfolioData);

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Portfolio updated successfully",
                });
                onSuccess();
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Error updating portfolio:", error);
            toast({
                title: "Error",
                description: "Failed to update portfolio",
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
                        Edit Portfolio
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
                            <label className="text-sm font-medium text-gray-300">Description</label>
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
                            <label className="text-sm font-medium text-gray-300">Existing Images</label>
                            <div className="mt-2 grid grid-cols-3 gap-4">
                                {existingImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={getImageUrl(image)}
                                            alt={`Portfolio image ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">Add New Images</label>
                            <div className="mt-1 flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleNewImageChange}
                                    />
                                </label>
                            </div>
                            {newImages.length > 0 && (
                                <p className="mt-2 text-sm text-gray-400">
                                    {newImages.length} new image(s) selected
                                </p>
                            )}
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
                                    Updating...
                                </>
                            ) : (
                                "Update Portfolio"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 