'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  MessageSquare,
  Plus,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { mockTickets, suggestedPrompts } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tickets for current user (in production, filter by actual user ID)
  const userTickets = mockTickets.slice(0, 3);

  const stats = {
    open: userTickets.filter((t) => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(t.status)).length,
    resolved: userTickets.filter((t) => t.status === 'RESOLVED').length,
    pending: userTickets.filter((t) => t.status === 'WAITING_FOR_CUSTOMER').length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            How can we help you today?
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tickets/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Link>
        </Button>
      </div>

      {/* Search Support Articles */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search support articles, FAQs, or describe your issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button size="lg">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.open}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Assistant Quick Chat */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                AI Assistant
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/chat">
                  Open Chat
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get instant answers from our AI assistant. Ask about orders, returns, refunds, and more.
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  asChild
                >
                  <Link href={`/dashboard/chat?prompt=${encodeURIComponent(prompt)}`}>
                    {prompt}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Tickets
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/tickets">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {userTickets.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No tickets yet</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/dashboard/tickets/new">Create your first ticket</Link>
                </Button>
              </div>
            ) : (
              userTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="block p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className={statusColors[ticket.status]}>
                        {ticket.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className={priorityColors[ticket.priority]}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
