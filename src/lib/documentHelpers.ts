import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const validateFile = (file: File) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${file.name}: Invalid file type. Only PDF and images allowed.`);
  }
  
  if (file.size > maxSize) {
    throw new Error(`${file.name}: File too large. Maximum size is 10MB.`);
  }
  
  return true;
};

export const uploadFile = async (file: File, caseId: string) => {
  // Sanitize filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${caseId}/${timestamp}-${sanitizedName}`;
  
  // Upload to storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('case-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (storageError) throw storageError;
  
  return { filePath, storagePath: storageData.path };
};

export const createDocumentRecord = async (fileData: {
  caseId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  category: string;
  userId: string;
}) => {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      case_id: fileData.caseId,
      name: fileData.fileName,
      file_path: fileData.filePath,
      file_size: fileData.fileSize,
      file_type: fileData.fileType,
      document_category: fileData.category,
      uploaded_by: fileData.userId,
      status: 'pending_review'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const downloadDocument = async (filePath: string, fileName: string) => {
  try {
    // Get signed URL (valid for 60 seconds)
    const { data, error } = await supabase.storage
      .from('case-documents')
      .createSignedUrl(filePath, 60);
    
    if (error) throw error;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = data.signedUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Failed to download document');
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
