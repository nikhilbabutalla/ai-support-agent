'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText,
  Upload,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  Loader2,
  X,
} from 'lucide-react';
import { mockDocuments } from '@/lib/mock-data';
import { format } from 'date-fns';
import type { Document } from '@/lib/api';

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  processing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  active: CheckCircle,
  processing: Clock,
  archived: Archive,
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [reindexingId, setReindexingId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setShowUploadDialog(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowUploadDialog(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    // Add new document
    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedFile.name,
      url: `/documents/${selectedFile.name}`,
      type: selectedFile.type,
      status: 'processing',
      version: 1,
      uploadedAt: new Date().toISOString(),
    };

    setDocuments(prev => [newDoc, ...prev]);
    setIsUploading(false);
    setSelectedFile(null);
    setShowUploadDialog(false);

    // Simulate processing completion
    setTimeout(() => {
      setDocuments(prev => prev.map(d => 
        d.id === newDoc.id ? { ...d, status: 'active' as const, indexedAt: new Date().toISOString() } : d
      ));
    }, 3000);
  };

  const handleReindex = async (docId: string) => {
    setReindexingId(docId);
    
    // Simulate reindexing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, indexedAt: new Date().toISOString() } : d
    ));
    setReindexingId(null);
  };

  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Document Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage policy documents for AI reference
          </p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a PDF or document to add to the AI knowledge base
              </DialogDescription>
            </DialogHeader>
            
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span className="text-foreground">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your document here, or{' '}
                  <label className="text-primary hover:underline cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX, TXT up to 10MB
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upload Drop Zone */}
      <Card 
        className={`bg-card border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Drag and drop documents here to upload
          </p>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            {documents.length} documents in the knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Last Indexed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No documents uploaded yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => {
                  const StatusIcon = statusIcons[doc.status];
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[doc.status]}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">v{doc.version}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {doc.indexedAt ? format(new Date(doc.indexedAt), 'MMM d, yyyy') : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Re-index"
                            onClick={() => handleReindex(doc.id)}
                            disabled={reindexingId === doc.id}
                          >
                            {reindexingId === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
