import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { uploadResumes, clearUploadProgress } from '../../features/resumes/resumesSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface UploadResumesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

export const UploadResumesModal: React.FC<UploadResumesModalProps> = ({
  isOpen,
  onClose,
  jobId,
}) => {
  const dispatch = useAppDispatch();
  const { uploadProgress, isLoading } = useAppSelector((state) => state.resumes);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const validFiles = acceptedFiles.filter(file => 
      allowedTypes.includes(file.type)
    );
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      dispatch(uploadResumes(validFiles));
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Upload className="w-4 h-4 text-accent animate-pulse" />;
    }
  };

  const handleClose = () => {
    dispatch(clearUploadProgress());
    setUploadedFiles([]);
    onClose();
  };

  const allCompleted = uploadProgress.length > 0 && uploadProgress.every(p => p.status === 'completed');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Upload Resumes</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={`upload-dropzone cursor-pointer ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop resumes here' : 'Upload Resume Files'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag & drop resume files here, or click to select files
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Supported formats: PDF, DOC, DOCX</p>
              <p>Maximum 100+ files supported</p>
            </div>
          </div>

          {uploadProgress.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Upload Progress</h3>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {uploadProgress.map((file, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{file.fileName}</span>
                      </div>
                      {getStatusIcon(file.status)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {file.status === 'completed' ? 'Uploaded' : 
                           file.status === 'error' ? 'Failed' : 'Uploading...'}
                        </span>
                        <span>{file.progress}%</span>
                      </div>
                      <Progress 
                        value={file.progress} 
                        className={`h-2 ${
                          file.status === 'error' ? 'bg-destructive/20' : ''
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose}>
              {allCompleted ? 'Done' : 'Cancel'}
            </Button>
            
            {allCompleted && (
              <Button onClick={handleClose}>
                View Matched Resumes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};