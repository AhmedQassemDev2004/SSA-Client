import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface ServiceOrder {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  serviceId: number;
  service: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ViewOrderDialogProps {
  order: ServiceOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewOrderDialog = ({ order, open, onOpenChange }: ViewOrderDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-ssa-gold">
            Order Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 p-4">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Client Information</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-white">{order.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Company</label>
                  <p className="text-white">{order.company}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{order.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <p className="text-white">{order.phone}</p>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Service Information</h3>
              <div>
                <label className="text-sm text-gray-400">Service Name</label>
                <p className="text-white">{order.service.name}</p>
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Message</h3>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-white whitespace-pre-wrap">{order.message}</p>
              </div>
            </div>

            {/* Order Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-400">Order ID</label>
                  <p className="text-white">#{order.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Created At</label>
                  <p className="text-white">
                    {format(new Date(order.createdAt), "PPP p")}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Last Updated</label>
                  <p className="text-white">
                    {format(new Date(order.updatedAt), "PPP p")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog; 