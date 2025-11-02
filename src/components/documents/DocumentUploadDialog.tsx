import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DocumentUploadForm from "./DocumentUploadForm";

interface DocumentUploadDialogProps {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export default function DocumentUploadDialog({
  caseId,
  open,
  onOpenChange,
  onUploadComplete,
}: DocumentUploadDialogProps) {
  const handleUploadComplete = () => {
    onUploadComplete?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload documents for this case. Files will be reviewed by your assigned consultant.
          </DialogDescription>
        </DialogHeader>
        <DocumentUploadForm
          caseId={caseId}
          onUploadComplete={handleUploadComplete}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
