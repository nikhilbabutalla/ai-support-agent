'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Bot,
  User,
  Clock,
  Paperclip,
  Send,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
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

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const ticket = mockTickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-foreground mb-2">Ticket not found</h2>
        <p className="text-muted-foreground mb-4">The ticket you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/dashboard/tickets">Back to Tickets</Link>
        </Button>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setNewMessage('');
    setIsSending(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link href="/dashboard/tickets">
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
          {/* AI Reasoning */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Detected Intent</p>
                  <p className="font-medium text-foreground capitalize">
                    {ticket.aiIntent.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="font-medium text-foreground">{Math.round(ticket.aiConfidence * 100)}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reasoning</p>
                <p className="text-sm text-foreground">{ticket.aiReasoning}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Suggested Resolution</p>
                <p className="text-sm text-foreground">{ticket.aiSuggestedResolution}</p>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Timeline */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? '' : ''}`}
                >
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

              {/* Add Message */}
              <div className="pt-4 border-t border-border">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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

          {/* Status Info */}
          {ticket.status === 'ESCALATED' && (
            <Card className="bg-warning/10 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Escalated Ticket</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This ticket has been escalated for urgent review by our support team.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/chat">
                  <Bot className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
