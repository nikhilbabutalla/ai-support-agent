'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ticketCategories } from '@/lib/mock-data';
import Link from 'next/link';

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500/10 text-gray-500',
  medium: 'bg-blue-500/10 text-blue-500',
  high: 'bg-orange-500/10 text-orange-500',
  critical: 'bg-red-500/10 text-red-500',
};

interface AIAnalysis {
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  intent: string;
  suggestedCategory: string;
}

export default function CreateTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Simulate AI analysis when description changes
  const analyzeWithAI = useCallback(async () => {
    if (!subject || !description || description.length < 20) {
      setAiAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    // In production: const result = await aiApi.predictPriority(subject, description);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerDesc = description.toLowerCase();
    let priority: AIAnalysis['priority'] = 'medium';
    let intent = 'general_inquiry';
    let suggestedCategory = 'General';
    let confidence = 0.85;

    if (lowerDesc.includes('urgent') || lowerDesc.includes('critical') || lowerDesc.includes('immediately')) {
      priority = 'critical';
      confidence = 0.92;
    } else if (lowerDesc.includes('asap') || lowerDesc.includes('important')) {
      priority = 'high';
      confidence = 0.88;
    } else if (lowerDesc.includes('when you can') || lowerDesc.includes('not urgent')) {
      priority = 'low';
      confidence = 0.90;
    }

    if (lowerDesc.includes('refund') || lowerDesc.includes('money back')) {
      intent = 'refund_request';
      suggestedCategory = 'Refund';
    } else if (lowerDesc.includes('delivery') || lowerDesc.includes('shipping') || lowerDesc.includes('arrived')) {
      intent = 'delivery_inquiry';
      suggestedCategory = 'Delivery';
    } else if (lowerDesc.includes('payment') || lowerDesc.includes('charged')) {
      intent = 'payment_issue';
      suggestedCategory = 'Payment';
    } else if (lowerDesc.includes('wrong') || lowerDesc.includes('incorrect')) {
      intent = 'wrong_item';
      suggestedCategory = 'Wrong Item';
    } else if (lowerDesc.includes('return')) {
      intent = 'return_request';
      suggestedCategory = 'Refund';
    }

    setAiAnalysis({ priority, confidence, intent, suggestedCategory });
    if (!category) {
      setCategory(suggestedCategory);
    }
    setIsAnalyzing(false);
  }, [subject, description, category]);

  // Debounced analysis
  useState(() => {
    const timer = setTimeout(analyzeWithAI, 500);
    return () => clearTimeout(timer);
  });

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    // In production: await ticketsApi.create({ subject, description, category, attachments: files });
    await new Promise(resolve => setTimeout(resolve, 1000));

    router.push('/dashboard/tickets');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tickets">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Create New Ticket</h1>
          <p className="text-muted-foreground mt-1">
            Describe your issue and our AI will help categorize it
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief summary of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onBlur={analyzeWithAI}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe your issue in detail. Include any relevant order numbers, dates, or other information that might help us assist you."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={analyzeWithAI}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {ticketCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or{' '}
                  <label className="text-primary hover:underline cursor-pointer">
                    browse
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports images, PDFs, and documents up to 10MB
                </p>
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Card */}
        {(isAnalyzing || aiAnalysis) && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Analysis
              </CardTitle>
              <CardDescription>
                Our AI has analyzed your issue and predicted the following
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing your issue...
                </div>
              ) : aiAnalysis ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Priority</p>
                    <Badge variant="outline" className={priorityColors[aiAnalysis.priority]}>
                      {aiAnalysis.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-sm font-medium text-foreground">
                      {Math.round(aiAnalysis.confidence * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Detected Intent</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {aiAnalysis.intent.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Suggested Category</p>
                    <p className="text-sm font-medium text-foreground">
                      {aiAnalysis.suggestedCategory}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            All fields are required
          </p>
          <div className="flex gap-3">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/tickets">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting || !subject || !description || !category}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
