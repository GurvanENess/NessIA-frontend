import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadCloud as CloudDownload, Upload, X, Check, AlertCircle, Trash2 } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

interface FileSelectModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onFileSelect?: (file: File) => void;
  onFilesChange?: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
}

const FileSelectModal: React.FC<FileSelectModalProps> = ({
  isOpen = true,
  onClose,
  onFileSelect,
  onFilesChange,
  acceptedTypes = ["jpg", "png", "gif"],
  maxSize = 10,
  multiple = true
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedTypes.includes(fileExtension)) {
      setErrorMessage(`Type de fichier non supporté. Formats acceptés : ${acceptedTypes.join(', ')}`);
      setUploadStatus('error');
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setErrorMessage(`Fichier trop volumineux. Taille maximum : ${maxSize}MB`);
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    // Create preview URL
    const preview = URL.createObjectURL(file);
    
    // Simulate upload process
    setTimeout(() => {
      const newFile: UploadedFile = {
        id: crypto.randomUUID(),
        file,
        preview,
        name: file.name
      };

      const updatedFiles = [...uploadedFiles, newFile];
      setUploadedFiles(updatedFiles);
      setUploadStatus('success');
      
      onFileSelect?.(file);
      onFilesChange?.(updatedFiles);
      
      // Reset to idle after success
      setTimeout(() => {
        setUploadStatus('idle');
      }, 1000);
    }, 1000);
  };

  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (multiple) {
        files.forEach(file => handleFileSelect(file));
      } else {
        handleFileSelect(files[0]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        Array.from(files).forEach(file => handleFileSelect(file));
      } else {
        handleFileSelect(files[0]);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <Check className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <CloudDownload className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Téléversement en cours...';
      case 'success':
        return 'Image téléversée avec succès !';
      case 'error':
        return 'Erreur lors du téléversement';
      default:
        return 'Téléverser une image';
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Téléverser un fichier</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Upload Area */}
          <div className="p-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${isDragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : uploadStatus === 'error'
                  ? 'border-red-300 bg-red-50'
                  : uploadStatus === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                }
              `}
            >
              {/* Status Icon */}
              <div className="flex justify-center mb-4">
                {getStatusIcon()}
              </div>

              {/* Status Text */}
              <h3 className={`text-lg font-semibold mb-2 ${getStatusColor()}`}>
                {getStatusText()}
              </h3>

              {/* File Types */}
              {uploadStatus === 'idle' && (
                <p className="text-sm text-gray-500 mb-6">
                  Fichiers acceptés : {acceptedTypes.join(', ')}
                </p>
              )}

              {/* Error Message */}
              {uploadStatus === 'error' && errorMessage && (
                <p className="text-sm text-red-600 mb-6">
                  {errorMessage}
                </p>
              )}

              {/* Success Message */}
              {uploadStatus === 'success' && (
                <p className="text-sm text-green-600 mb-6">
                  Votre fichier a été téléversé avec succès
                </p>
              )}

              {/* Divider */}
              {uploadStatus === 'idle' && (
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">ou</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
              )}

              {/* Upload Button */}
              {uploadStatus === 'idle' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleButtonClick}
                  className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D28D9] transition-colors flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Télécharger une image
                </motion.button>
              )}

              {/* Retry Button */}
              {uploadStatus === 'error' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setUploadStatus('idle');
                    setErrorMessage('');
                  }}
                  className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D28D9] transition-colors flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Réessayer
                </motion.button>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept={acceptedTypes.map(type => `.${type}`).join(',')}
                multiple={multiple}
                className="hidden"
              />
            </div>

            {/* File Size Info */}
            {uploadStatus === 'idle' && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Taille maximum : {maxSize}MB
              </p>
            )}
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Fichiers téléversés ({uploadedFiles.length})
                </h4>
                <div className="space-y-3">
                  <AnimatePresence>
                    {uploadedFiles.map((uploadedFile, index) => (
                      <motion.div
                        key={uploadedFile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        {/* File Preview */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={uploadedFile.preview}
                            alt={uploadedFile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(uploadedFile.file.size)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveFile(uploadedFile.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Supprimer le fichier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FileSelectModal;