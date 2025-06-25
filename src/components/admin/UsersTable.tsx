import {useState, useEffect, useCallback} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {MoreHorizontal, Pencil, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {api} from "@/lib/api";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

interface UsersTableProps {
    setUsers?: (users: User[]) => void;
    query?: string;
    refresh?: number;
}

export default function UsersTable({setUsers, query, refresh}: UsersTableProps) {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Form state for editing
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
    });
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get("/user/");
            const userData = Array.isArray(response.data) ? response.data : [];
            setAllUsers(userData);
            setFilteredUsers(userData);
            setUsers?.(userData); // Update parent component if setUsers is provided
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users");
            toast.error("Failed to fetch users");
            setAllUsers([]);
            setFilteredUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [setUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, refresh]);

    useEffect(() => {
        if (query) {
            const filtered = allUsers.filter((user) =>
                user.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(allUsers);
        }

        console.log("Users updated.....")
    }, [query, allUsers]);

    const handleDelete = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.delete(`/user/${userId}`);
            toast.success("User deleted successfully");
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    const handleEdit = (userId: number) => {
        const user = allUsers.find(u => u.id === userId);
        if (user) {
            setEditingUser(user);
            setEditForm({
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            await api.patch(`/user/${editingUser.id}`, editForm);
            toast.success("User updated successfully");
            setIsEditDialogOpen(false);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user");
        }
    };

    const handleEditInputChange = (field: string, value: string) => {
        setEditForm(prev => ({...prev, [field]: value}));
    };

    if (isLoading) {
        return <div className="text-gray-400">Loading users...</div>;
    }

    if (error) {
        return <div className="text-red-400">{error}</div>;
    }

    if (!filteredUsers.length) {
        return <div className="text-gray-400">No users found</div>;
    }

    console.log(filteredUsers)
    return (
        <>
            <div className="rounded-md border border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-gray-800/50">
                            <TableHead className="text-gray-300">Name</TableHead>
                            <TableHead className="text-gray-300">Email</TableHead>
                            <TableHead className="text-gray-300">Phone</TableHead>
                            <TableHead className="text-gray-300">Role</TableHead>
                            <TableHead className="text-gray-300">Created At</TableHead>
                            <TableHead className="text-gray-300 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/50">
                                <TableCell className="font-medium text-gray-200">{user.name}</TableCell>
                                <TableCell className="text-gray-300">{user.email}</TableCell>
                                <TableCell className="text-gray-300">{user.phone}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`${
                                            user.role === "admin"
                                                ? "border-ssa-gold text-ssa-gold"
                                                : "border-gray-500 text-gray-400"
                                        }`}
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-300">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-gray-800"
                                            >
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4 text-gray-400"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="bg-gray-800 border-gray-700"
                                        >
                                            <DropdownMenuItem
                                                className="text-gray-300 hover:bg-gray-700 hover:text-ssa-gold cursor-pointer"
                                                onClick={() => handleEdit(user.id)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4"/>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-400 hover:bg-gray-700 hover:text-red-300 cursor-pointer"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-[#1a1a1a] border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-200">Name</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => handleEditInputChange("name", e.target.value)}
                                className="bg-[#2a2a2a] border-gray-600 text-white"
                                placeholder="Enter name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-200">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => handleEditInputChange("email", e.target.value)}
                                className="bg-[#2a2a2a] border-gray-600 text-white"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-200">Phone</Label>
                            <Input
                                id="phone"
                                value={editForm.phone}
                                onChange={(e) => handleEditInputChange("phone", e.target.value)}
                                className="bg-[#2a2a2a] border-gray-600 text-white"
                                placeholder="Enter phone"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-gray-200">Role</Label>
                            <Input
                                id="role"
                                value={editForm.role}
                                onChange={(e) => handleEditInputChange("role", e.target.value)}
                                className="bg-[#2a2a2a] border-gray-600 text-white"
                                placeholder="Enter role"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-ssa-gold text-[#131212] hover:bg-ssa-gold/90"
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
