import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ImageUploader } from "@/components/shared/ImageUploader";
import AdminLayout from "@/components/admin/AdminLayout";

interface Service {
    id: number;
    name: string;
}

interface Portfolio {
    id: number;
    title: string;
    description: string;
    images: string[];
    links: string[];
    serviceId: number;
    service: {
        name: string;
    };
}

export default function EditPortfolioPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [serviceId, setServiceId] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [links, setLinks] = useState<string[]>([]);

    useEffect(() => {
        if (id) {
            loadPortfolio();
            loadServices();
        }
    }, [id]);

    const loadPortfolio = async () => {
        try {
            const response = await api.get(`/portfolios/${id}`);
            const portfolioData = response.data;
            setPortfolio(portfolioData);
            setTitle(portfolioData.title);
            setDescription(portfolioData.description || "");
            setServiceId(portfolioData.serviceId.toString());
            setImages(portfolioData.images || []);
            setLinks(portfolioData.links || []);
        } catch (error) {
            console.error("Error loading portfolio:", error);
            toast({
                title: "Error",
                description: "Failed to load portfolio",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
        if (!portfolio) return;
        
        setIsSaving(true);

        try {
            const portfolioData = {
                title,
                description: description || undefined,
                serviceId: parseInt(serviceId),
                images,
                links: links.filter(link => link.trim() !== ""),
            };

            const response = await api.patch(`/portfolios/${portfolio.id}`, portfolioData);

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Portfolio updated successfully",
                });
                navigate("/admin/portfolios");
            }
        } catch (error) {
            console.error("Error updating portfolio:", error);
            toast({
                title: "Error",
                description: "Failed to update portfolio",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-ssa-gold" />
                </div>
            </AdminLayout>
        );
    }

    if (!portfolio) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-gray-400">Portfolio not found</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/admin/portfolios")}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Portfolios
                        </Button>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-ssa-gold to-yellow-400 bg-clip-text text-transparent">
                            Edit Portfolio
                        </h1>
                    </div>

                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-300">Portfolio Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter portfolio description"
                                        className="mt-1 bg-gray-800/50 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:border-ssa-gold focus:ring-ssa-gold"
                                        rows={4}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300">Images</label>
                                    <div className="mt-2">
                                        <ImageUploader
                                            images={images}
                                            onChange={setImages}
                                            maxImages={10}
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

                                <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/admin/portfolios")}
                                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-gradient-to-r from-ssa-gold to-ssa-gold hover:px-5 text-gray-900 font-medium transition-all"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AdminLayout>
    );
} 