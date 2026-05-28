'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  ArrowLeft,
  Bot,
  User,
  Clock,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Loader2,
} from 'lucide-react';
import { mockTickets } from '@/lib/mock-data';
import { formatDistanceToNow, format } from 'date-fns';

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  PROCESSING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  WAITING_FOR_CUSTOMER: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  WAITING_ADMIN_APPROVAL: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  RESOLVED: 'bg-green-500/10 text-green-500 border-green-500/20',
  REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
  ESCALATED: 'bg-orange-600/10 text-orange-600 border-orange-600/20',
  CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500/10 text-gray-500',
  medium: 'bg-blue-500/10 text-blue-500',
  high: 'bg-orange-500/10 text-orange-500',
  critical: 'bg-red-500/10 text-red-500',
};

export default function AdminTicketReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [adminResponse, setAdminResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const ticket = mockTickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-foreground mb-2">Ticket not found</h2>
        <p className="text-muted-foreground mb-4">The ticket you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/admin/tickets">Back to Tickets</Link>
        </Button>
      </div>
    );
  }

  const handleAction = async (action: 'approve' | 'reject' | 'escalate' | 'modify') => {
    setIsProcessing(true);
    
    // Simulate API call
    // In production: await ticketsApi.updateStatus(ticket.id, newStatus, adminResponse);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsProcessing(false);
    router.push('/admin/tickets');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link href="/admin/tickets">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="font-mono">{ticket.id}</span>
            <span>•</span>
            <span>{ticket.category}</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{ticket.subject}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={statusColors[ticket.status]}>
              {ticket.status.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline" className={priorityColors[ticket.priority]}>
              {ticket.priority} priority
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Issue */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Issue
              </CardTitle>
              <CardDescription>
                From {ticket.userName} ({ticket.userEmail})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Analysis & Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-card">
                  <p className="text-xs text-muted-foreground">Detected Intent</p>
                  <p className="text-sm font-medium text-foreground capitalize mt-1">
                    {ticket.aiIntent.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-card">
                  <p className="text-xs text-muted-foreground">Confidence Score</p>
                  <p className={`text-sm font-medium mt-1 ${
                    ticket.aiConfidence >= 0.9 ? 'text-green-500' :
                    ticket.aiConfidence >= 0.7 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {Math.round(ticket.aiConfidence * 100)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-card">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium text-foreground mt-1">{ticket.category}</p>
                </div>
                <div className="p-3 rounded-lg bg-card">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge variant="outline" className={`mt-1 ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">AI Reasoning</h4>
                <div className="p-4 rounded-lg bg-card border border-border/50">
                  <p className="text-sm text-foreground">{ticket.aiReasoning}</p>
                </div>
              </div>

              {/* Retrieved Policies */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Retrieved Policy Documents</h4>
                <div className="space-y-2">
                  {['Return Policy.pdf', 'Shipping Guidelines.pdf'].map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{doc}</span>
                      <Badge variant="outline" className="ml-auto text-xs">Matched</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Resolution */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Suggested Resolution</h4>
                <div className="p-4 rounded-lg bg-card border border-border/50">
                  <p className="text-sm text-foreground">{ticket.aiSuggestedResolution}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Timeline */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Conversation Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.sender === 'ai' ? 'bg-primary/10' : message.sender === 'admin' ? 'bg-accent/10' : 'bg-muted'}>
                      {message.sender === 'ai' ? (
                        <Bot className="w-4 h-4 text-primary" />
                      ) : message.sender === 'admin' ? (
                        <User className="w-4 h-4 text-accent" />
                      ) : (
                        <span className="text-xs">{message.senderName[0]}</span>
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{message.senderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm text-foreground">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Admin Response */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Modify AI Response
              </CardTitle>
              <CardDescription>
                Edit the suggested response before sending to customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your response or modify the AI suggestion..."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Actions */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-green-500/10 hover:bg-green-500/20 text-green-500"
                variant="ghost"
                onClick={() => handleAction('approve')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Approve & Send
              </Button>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full justify-start bg-red-500/10 hover:bg-red-500/20 text-red-500"
                    variant="ghost"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Ticket</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this ticket.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setShowRejectDialog(false);
                        handleAction('reject');
                      }}
                      disabled={!rejectReason.trim()}
                    >
                      Confirm Rejection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary"
                variant="ghost"
                onClick={() => handleAction('modify')}
                disabled={isProcessing || !adminResponse.trim()}
              >
                <Edit className="w-4 h-4 mr-2" />
                Send Modified Response
              </Button>

              <Button
                className="w-full justify-start bg-orange-500/10 hover:bg-orange-500/20 text-orange-500"
                variant="ghost"
                onClick={() => handleAction('escalate')}
                disabled={isProcessing}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Escalate
              </Button>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No attachments</p>
              ) : (
                <div className="space-y-2">
                  {ticket.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      {attachment.type.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(attachment.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ticket Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-foreground">{format(new Date(ticket.updatedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Messages</span>
                <span className="text-foreground">{ticket.messages.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
