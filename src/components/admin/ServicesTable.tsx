import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DeleteServiceDialog} from "./DeleteServiceDialog";
import {api} from "@/lib/api";
import {useToast} from "@/hooks/use-toast";
import {stripHtml} from "@/lib/utils";
import LoadingSpinner from "../ui/loading-spinner";

interface Service {
    id: number;
    name: string;
    description: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    active: boolean;
    categoryId?: number;
    category: {
        id: number;
        name: string;
    } | null;
}

interface ServicesTableProps {
    onServicesLoaded?: (services: Service[]) => void;
    refresh?: number;
    query?: string;
}

const PAGE_SIZE = 10;

export function ServicesTable({refresh, onServicesLoaded, query}: ServicesTableProps) {
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {toast} = useToast();
    const [page, setPage] = useState(0);
    const [deletingService, setDeletingService] = useState<Service | null>(null);

    const loadServices = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/services");

            if (!response || response.status !== 200) {
                throw new Error("Failed to fetch services");
            }
            const data = response.data;
            setServices(data);
            onServicesLoaded?.(data);
        } catch (error) {
            console.error(
                "Error loading services:",
                error instanceof Error ? error.message : "Unknown error"
            );
        } finally {
            setIsLoading(false);
        }

        console.log("Loading services");
    };

    useEffect(() => {
        loadServices();
    }, [refresh]);

    const handleDeleteSuccess = () => {
        loadServices();
    };

    const handleActiveChange = async (serviceId: number, checked: boolean) => {
        try {
            const response = await api.patch(`/services/${serviceId}`, {
                active: checked
            });

            if (!response || response.status !== 200) {
                throw new Error("Failed to update service status");
            }

            setServices(services.map(service =>
                service.id === serviceId ? {...service, active: checked} : service
            ));

            toast({
                title: "Success",
                description: `Service ${checked ? 'activated' : 'deactivated'} successfully`,
            });
        } catch (error) {
            console.error("Error updating service status:", error);
            toast({
                title: "Error",
                description: "Failed to update service status",
                variant: "destructive",
            });
        }
    };

    // Filter services based on query if it exists
    const filteredServices = query
        ? services.filter((service) =>
            service.name.toLowerCase().includes(query.toLowerCase())
        )
        : services;

    useEffect(() => {
        if (query) {
            setPage(0);
        } else {
            loadServices();
        }
    }, [query]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    const nextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const previousPage = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="rounded-md border border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-gray-800/50">
                            <TableHead className="text-gray-400">ID</TableHead>
                            <TableHead className="text-gray-400">Name</TableHead>
                            <TableHead className="text-gray-400">Category</TableHead>
                            <TableHead className="text-gray-400">Description</TableHead>
                            <TableHead className="text-gray-400">Images</TableHead>
                            <TableHead className="text-gray-400">Created At</TableHead>
                            <TableHead className="text-gray-400">Active</TableHead>
                            <TableHead className="text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedServices.length > 0 ? (
                            paginatedServices.map((service) => (
                                <TableRow
                                    key={service.id}
                                    className="border-gray-700 hover:bg-gray-800/50 transition-colors"
                                >
                                    <TableCell className="text-gray-300">{service.id}</TableCell>
                                    <TableCell className="text-gray-300">
                                        {service.name}
                                    </TableCell>
                                    <TableCell className="text-gray-300 flex items-center gap-2 justify-center">
                                        {service?.category ? <span
                                            className="text-ssa-gold border-2 rounded-full border-ssa-gold px-2 py-1">{service.category.name}</span> : "No Category"}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {(() => {
                                            const textContent = stripHtml(service.description);
                                            return textContent.length > 20
                                                ? textContent.slice(0, 20) + "..."
                                                : textContent;
                                        })()}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {service.images.length} images
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {new Date(service.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={service.active}
                                            onCheckedChange={(checked) => handleActiveChange(service.id, checked)}
                                            className="data-[state=checked]:bg-ssa-gold"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 hover:bg-gray-800"
                                                >
                                                    <span className="sr-only">Open menu</span>
                                                    <ChevronDown className="h-4 w-4 text-gray-400"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-gray-800 border-gray-700"
                                            >
                                                <DropdownMenuCheckboxItem
                                                    onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                                                    className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold focus:bg-gray-700 focus:text-ssa-gold"
                                                >
                                                    Edit Service
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() => setDeletingService(service)}
                                                    className="text-gray-300 hover:bg-gray-700 hover:text-red-400 focus:bg-gray-700 focus:text-red-400"
                                                >
                                                    Delete Service
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-gray-500"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-gray-500 flex-1 text-sm">
                    {startIndex + 1}-{Math.min(endIndex, filteredServices.length)} of{" "}
                    {filteredServices.length} services
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={previousPage}
                        disabled={page === 0}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={page >= totalPages - 1}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <DeleteServiceDialog
                open={!!deletingService}
                onOpenChange={(open) => !open && setDeletingService(null)}
                serviceId={deletingService?.id || 0}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}

export default ServicesTable;
