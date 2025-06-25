import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, ExternalLink } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeletePortfolioDialog } from "./DeletePortfolioDialog";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
    createdAt: string;
    updatedAt: string;
}

interface PortfoliosTableProps {
    onPortfoliosLoaded?: (portfolios: Portfolio[]) => void;
    refresh?: number;
    query?: string;
}

const PAGE_SIZE = 10;

export function PortfoliosTable({ refresh, onPortfoliosLoaded, query }: PortfoliosTableProps) {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [deletingPortfolio, setDeletingPortfolio] = useState<Portfolio | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    const loadPortfolios = async () => {
        try {
            const response = await api.get("/portfolios");
            if (response.status === 200) {
                setPortfolios(response.data);
                onPortfoliosLoaded?.(response.data);
            }
        } catch (error) {
            console.error("Error loading portfolios:", error);
            toast({
                title: "Error",
                description: "Failed to load portfolios",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPortfolios();
    }, [refresh]);

    const handleDeleteSuccess = () => {
        loadPortfolios();
    };

    // Filter portfolios based on query if it exists
    const filteredPortfolios = query
        ? portfolios.filter((portfolio) =>
            portfolio.title.toLowerCase().includes(query.toLowerCase()) ||
            (portfolio.description && portfolio.description.toLowerCase().includes(query.toLowerCase()))
        )
        : portfolios;

    useEffect(() => {
        if (query) {
            setPortfolios(prevPortfolios =>
                prevPortfolios.filter((portfolio) =>
                    portfolio.title.toLowerCase().includes(query.toLowerCase()) ||
                    (portfolio.description && portfolio.description.toLowerCase().includes(query.toLowerCase()))
                )
            );
            setPage(0);
        } else {
            loadPortfolios();
        }
    }, [query]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredPortfolios.length / PAGE_SIZE);
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedPortfolios = filteredPortfolios.slice(startIndex, endIndex);

    const nextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const previousPage = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-ssa-gold"/>
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
                            <TableHead className="text-gray-400">Title</TableHead>
                            <TableHead className="text-gray-400">Service</TableHead>
                            <TableHead className="text-gray-400">Description</TableHead>
                            <TableHead className="text-gray-400">Images</TableHead>
                            <TableHead className="text-gray-400">Links</TableHead>
                            <TableHead className="text-gray-400">Created At</TableHead>
                            <TableHead className="text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPortfolios.length > 0 ? (
                            paginatedPortfolios.map((portfolio) => (
                                <TableRow
                                    key={portfolio.id}
                                    className="border-gray-700 hover:bg-gray-800/50 transition-colors"
                                >
                                    <TableCell className="text-gray-300">{portfolio.id}</TableCell>
                                    <TableCell className="text-gray-300">
                                        {portfolio.title}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        <span className="text-ssa-gold border-2 rounded-full border-ssa-gold px-2 py-1">
                                            {portfolio.service.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {portfolio.description && portfolio.description.length > 20
                                            ? portfolio.description.slice(0, 20) + "..."
                                            : portfolio.description || "No description"}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {portfolio.images.length} images
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {portfolio.links && portfolio.links.length > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <span className="text-ssa-gold">{portfolio.links.length}</span>
                                                <ExternalLink className="h-3 w-3 text-ssa-gold" />
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">No links</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {new Date(portfolio.createdAt).toLocaleDateString()}
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
                                                    onClick={() => navigate(`/admin/portfolios/edit/${portfolio.id}`)}
                                                    className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold focus:bg-gray-700 focus:text-ssa-gold"
                                                >
                                                    Edit Portfolio
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() => setDeletingPortfolio(portfolio)}
                                                    className="text-gray-300 hover:bg-gray-700 hover:text-red-400 focus:bg-gray-700 focus:text-red-400"
                                                >
                                                    Delete Portfolio
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
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
                    {startIndex + 1}-{Math.min(endIndex, filteredPortfolios.length)} of{" "}
                    {filteredPortfolios.length} portfolios
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

            <DeletePortfolioDialog
                open={!!deletingPortfolio}
                onOpenChange={(open) => !open && setDeletingPortfolio(null)}
                portfolioId={deletingPortfolio?.id || 0}
                portfolioTitle={deletingPortfolio?.title || ""}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}

export default PortfoliosTable; 