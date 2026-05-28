'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Download,
  Calendar,
} from 'lucide-react';
import { mockAnalytics } from '@/lib/mock-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const commonComplaints = [
  { issue: 'Delivery Delays', count: 45, trend: 12 },
  { issue: 'Wrong Item Received', count: 32, trend: -5 },
  { issue: 'Refund Not Processed', count: 28, trend: 8 },
  { issue: 'Payment Failed', count: 24, trend: -3 },
  { issue: 'Product Quality Issues', count: 18, trend: 15 },
];

const aiMetrics = [
  { metric: 'Accuracy Rate', value: 94.5, target: 95, unit: '%' },
  { metric: 'Avg Response Time', value: 1.2, target: 2, unit: 's' },
  { metric: 'Auto-Resolution Rate', value: 68, target: 70, unit: '%' },
  { metric: 'Customer Satisfaction', value: 4.6, target: 4.5, unit: '/5' },
];

const refundTrends = [
  { month: 'Jan', requested: 120, approved: 105, rejected: 15 },
  { month: 'Feb', requested: 145, approved: 128, rejected: 17 },
  { month: 'Mar', requested: 132, approved: 118, rejected: 14 },
  { month: 'Apr', requested: 158, approved: 140, rejected: 18 },
  { month: 'May', requested: 142, approved: 125, rejected: 17 },
  { month: 'Jun', requested: 135, approved: 122, rejected: 13 },
];

const escalationTrends = [
  { week: 'W1', count: 12, resolved: 10 },
  { week: 'W2', count: 8, resolved: 7 },
  { week: 'W3', count: 15, resolved: 12 },
  { week: 'W4', count: 10, resolved: 9 },
];

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('week');
  const analytics = mockAnalytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Insights into support performance and AI accuracy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiMetrics.map((metric, index) => {
          const isAboveTarget = metric.value >= metric.target;
          return (
            <Card key={index} className="bg-card border-border/50">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{metric.metric}</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-semibold text-foreground">
                    {metric.value}{metric.unit}
                  </span>
                  <span className={`text-sm flex items-center gap-1 mb-1 ${isAboveTarget ? 'text-green-500' : 'text-orange-500'}`}>
                    {isAboveTarget ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    Target: {metric.target}{metric.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ticket Volume Trends */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Ticket Volume Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.ticketTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tickets by Priority */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.ticketsByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="priority"
                  >
                    {analytics.ticketsByPriority.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Common Complaints */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Most Common Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonComplaints.map((complaint, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{complaint.issue}</span>
                      <span className="text-sm text-muted-foreground">{complaint.count} tickets</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(complaint.count / commonComplaints[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs flex items-center gap-1 w-16 ${complaint.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {complaint.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(complaint.trend)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refund Statistics */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Refund Request Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={refundTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="approved" name="Approved" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Trends */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Escalation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={escalationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="Escalated" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ticketsByStatus} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="status" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    width={100}
                    tickFormatter={(value) => value.replace(/_/g, ' ')}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => value.replace(/_/g, ' ')}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
