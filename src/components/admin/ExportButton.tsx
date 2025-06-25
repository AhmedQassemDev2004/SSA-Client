import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertToCSV, downloadCSV } from "@/lib/export";
import { toast } from "sonner";

interface ExportButtonProps {
  data: any[];
  filename: string;
  className?: string;
}

export function ExportButton({ data, filename, className }: ExportButtonProps) {
  const handleExport = () => {
    try {
      if (!data.length) {
        toast.error("No data to export");
        return;
      }

      const csv = convertToCSV(data);
      downloadCSV(csv, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Button 
      variant="outline" 
      className={`border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-ssa-gold transition-colors ${className}`}
      onClick={handleExport}
    >
      <Download className="mr-2 h-4 w-4" />
      Export Data
    </Button>
  );
}
