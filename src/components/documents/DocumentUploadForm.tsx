import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { validateFile, uploadFile, createDocumentRecord, formatFileSize } from "@/lib/documentHelpers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
});

const DOCUMENT_CATEGORIES = [
  "Passport",
  "Photo",
  "Educational Certificate",
  "Work Experience Letter",
  "Financial Document",
  "Birth Certificate",
  "Marriage Certificate",
  "Police Clearance",
  "Medical Report",
  "Other",
];

interface DocumentUploadFormProps {
  caseId: string;
  onUploadComplete: () => void;
  onCancel: () => void;
}

export default function DocumentUploadForm({ caseId, onUploadComplete, onCancel }: DocumentUploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  }, [files]);

  const handleFileSelection = (selectedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    if (validFiles.length + files.length > 5) {
      toast.error("Maximum 5 files per upload");
      return;
    }

    if (errors.length > 0) {
      toast.error(errors[0]);
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelection(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      setUploading(false);
      return;
    }

    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ 
        current: i + 1, 
        total: files.length, 
        percentage: Math.round(((i + 1) / files.length) * 100)
      });

      try {
        const { filePath } = await uploadFile(file, caseId);
        
        await createDocumentRecord({
          caseId,
          fileName: file.name,
          filePath,
          fileSize: file.size,
          fileType: file.type,
          category: values.category,
          userId: user.id
        });
        
        results.push({ success: true, fileName: file.name });
      } catch (error: any) {
        console.error('Upload error:', error);
        results.push({ success: false, fileName: file.name, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} document${successCount > 1 ? 's' : ''}`);
      
      // Create timeline entry
      await supabase.from('case_timeline').insert({
        case_id: caseId,
        updated_by: user.id,
        notes: `Uploaded ${successCount} document(s): ${values.category}`,
      });
    }

    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} document${failCount > 1 ? 's' : ''}`);
    }

    setUploading(false);
    setProgress({ current: 0, total: 0, percentage: 0 });
    setFiles([]);
    form.reset();
    onUploadComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            uploading && "pointer-events-none opacity-50"
          )}
          onClick={() => !uploading && document.getElementById('file-input')?.click()}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-foreground mb-1">
            Drag files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, JPG, PNG up to 10MB • Maximum 5 files
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Files ({files.length})</p>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-md border bg-card"
                >
                  {file.type === 'application/pdf' ? (
                    <FileText className="h-8 w-8 text-destructive" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-primary" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  {!uploading && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={uploading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading {progress.current} of {progress.total} files...</span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} />
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={uploading || files.length === 0} className="flex-1">
            {uploading ? "Uploading..." : "Upload Documents"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
