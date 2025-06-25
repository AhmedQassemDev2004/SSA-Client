import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contact } from "@/types/contact";

interface ViewContactDialogProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewContactDialog = ({ contact, isOpen, onClose }: ViewContactDialogProps) => {
  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-ssa-gold">
            Contact Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Name</h3>
            <p className="mt-1 text-gray-200">{contact.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Email</h3>
            <p className="mt-1 text-gray-200">{contact.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Subject</h3>
            <p className="mt-1 text-gray-200">{contact.subject}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Message</h3>
            <p className="mt-1 text-gray-200 whitespace-pre-wrap">{contact.message}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Date</h3>
            <p className="mt-1 text-gray-200">
              {new Date(contact.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 