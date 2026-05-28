// Mock data for development and demonstration
// Replace with actual API calls in production

import type { Ticket, User, Document, Notification, AnalyticsData, ChatMessage } from './api';

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  role: 'user',
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockAdminUser: User = {
  id: '2',
  email: 'admin@company.com',
  name: 'Admin User',
  role: 'admin',
  createdAt: '2024-01-01T10:00:00Z',
};

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Order not delivered',
    description: 'I placed an order 2 weeks ago and it still has not arrived. Order number: #12345',
    category: 'Delivery',
    priority: 'high',
    status: 'PROCESSING',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    aiConfidence: 0.92,
    aiIntent: 'delivery_inquiry',
    aiReasoning: 'The customer is inquiring about a delayed delivery. Based on the order number provided, the shipment was delayed due to warehouse processing issues. According to our delivery policy, orders delayed beyond 10 days qualify for expedited reshipping.',
    aiSuggestedResolution: 'Offer expedited reshipping at no additional cost or provide a 15% refund on shipping fees.',
    attachments: [
      { id: '1', name: 'order_confirmation.pdf', url: '/files/order.pdf', type: 'application/pdf', size: 124000 }
    ],
    messages: [
      { id: '1', ticketId: 'TKT-001', content: 'I placed an order 2 weeks ago and it still has not arrived. Order number: #12345', sender: 'user', senderName: 'John Doe', createdAt: '2024-03-10T10:00:00Z' },
      { id: '2', ticketId: 'TKT-001', content: 'I understand your concern. Let me check the status of your order. Based on our records, there was a delay at our warehouse. We apologize for the inconvenience.', sender: 'ai', senderName: 'AI Assistant', createdAt: '2024-03-10T10:01:00Z' },
    ],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-12T14:30:00Z',
  },
  {
    id: 'TKT-002',
    subject: 'Refund request for damaged item',
    description: 'The product I received was damaged. I would like a full refund. Product: Wireless Headphones, Order: #12346',
    category: 'Refund',
    priority: 'medium',
    status: 'WAITING_ADMIN_APPROVAL',
    userId: '3',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    aiConfidence: 0.88,
    aiIntent: 'refund_request',
    aiReasoning: 'Customer received a damaged product and is requesting a refund. According to our return policy, damaged items are eligible for full refund or replacement within 30 days of delivery.',
    aiSuggestedResolution: 'Approve full refund and initiate return shipping label.',
    attachments: [
      { id: '2', name: 'damaged_product.jpg', url: '/files/damage.jpg', type: 'image/jpeg', size: 2500000 }
    ],
    messages: [
      { id: '3', ticketId: 'TKT-002', content: 'The product I received was damaged. I would like a full refund.', sender: 'user', senderName: 'Jane Smith', createdAt: '2024-03-11T15:00:00Z' },
    ],
    createdAt: '2024-03-11T15:00:00Z',
    updatedAt: '2024-03-11T15:05:00Z',
  },
  {
    id: 'TKT-003',
    subject: 'Payment issue - double charged',
    description: 'I was charged twice for my order. Please refund the duplicate charge. Order: #12347',
    category: 'Payment',
    priority: 'critical',
    status: 'ESCALATED',
    userId: '4',
    userName: 'Bob Wilson',
    userEmail: 'bob.wilson@example.com',
    aiConfidence: 0.65,
    aiIntent: 'payment_dispute',
    aiReasoning: 'Customer reports a duplicate charge. This requires verification with payment processing team. Low confidence due to need for financial record verification.',
    aiSuggestedResolution: 'Escalate to finance team for verification and immediate refund if duplicate charge confirmed.',
    attachments: [],
    messages: [
      { id: '4', ticketId: 'TKT-003', content: 'I was charged twice for my order. Please refund the duplicate charge.', sender: 'user', senderName: 'Bob Wilson', createdAt: '2024-03-12T09:00:00Z' },
      { id: '5', ticketId: 'TKT-003', content: 'This has been escalated to our finance team for immediate review.', sender: 'admin', senderName: 'Admin User', createdAt: '2024-03-12T09:30:00Z' },
    ],
    createdAt: '2024-03-12T09:00:00Z',
    updatedAt: '2024-03-12T09:30:00Z',
  },
  {
    id: 'TKT-004',
    subject: 'How to track my order?',
    description: 'Can you help me track my recent order? Order number: #12348',
    category: 'General',
    priority: 'low',
    status: 'RESOLVED',
    userId: '5',
    userName: 'Alice Brown',
    userEmail: 'alice.brown@example.com',
    aiConfidence: 0.98,
    aiIntent: 'order_tracking',
    aiReasoning: 'Simple order tracking inquiry. Tracking information has been automatically retrieved and shared with the customer.',
    aiSuggestedResolution: 'Provide tracking link and estimated delivery date.',
    attachments: [],
    messages: [
      { id: '6', ticketId: 'TKT-004', content: 'Can you help me track my recent order?', sender: 'user', senderName: 'Alice Brown', createdAt: '2024-03-09T11:00:00Z' },
      { id: '7', ticketId: 'TKT-004', content: 'Your order is currently in transit. Track here: https://tracking.example.com/12348. Estimated delivery: March 14, 2024.', sender: 'ai', senderName: 'AI Assistant', createdAt: '2024-03-09T11:01:00Z' },
    ],
    createdAt: '2024-03-09T11:00:00Z',
    updatedAt: '2024-03-09T11:01:00Z',
  },
  {
    id: 'TKT-005',
    subject: 'Wrong item received',
    description: 'I ordered a blue shirt but received a red one instead. Order: #12349',
    category: 'Wrong Item',
    priority: 'medium',
    status: 'NEW',
    userId: '6',
    userName: 'Charlie Davis',
    userEmail: 'charlie.davis@example.com',
    aiConfidence: 0.91,
    aiIntent: 'wrong_item',
    aiReasoning: 'Customer received incorrect item. This is a fulfillment error that requires exchange processing.',
    aiSuggestedResolution: 'Initiate exchange process - send correct item and provide return label for wrong item.',
    attachments: [
      { id: '3', name: 'wrong_item.jpg', url: '/files/wrong.jpg', type: 'image/jpeg', size: 1800000 }
    ],
    messages: [
      { id: '8', ticketId: 'TKT-005', content: 'I ordered a blue shirt but received a red one instead.', sender: 'user', senderName: 'Charlie Davis', createdAt: '2024-03-13T08:00:00Z' },
    ],
    createdAt: '2024-03-13T08:00:00Z',
    updatedAt: '2024-03-13T08:00:00Z',
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Return Policy.pdf',
    url: '/documents/return-policy.pdf',
    type: 'application/pdf',
    status: 'active',
    version: 3,
    uploadedAt: '2024-01-15T10:00:00Z',
    indexedAt: '2024-01-15T10:05:00Z',
  },
  {
    id: '2',
    name: 'Shipping Guidelines.pdf',
    url: '/documents/shipping.pdf',
    type: 'application/pdf',
    status: 'active',
    version: 2,
    uploadedAt: '2024-02-01T14:00:00Z',
    indexedAt: '2024-02-01T14:10:00Z',
  },
  {
    id: '3',
    name: 'FAQ Document.pdf',
    url: '/documents/faq.pdf',
    type: 'application/pdf',
    status: 'processing',
    version: 1,
    uploadedAt: '2024-03-10T09:00:00Z',
  },
  {
    id: '4',
    name: 'Refund Policy.pdf',
    url: '/documents/refund.pdf',
    type: 'application/pdf',
    status: 'active',
    version: 4,
    uploadedAt: '2024-03-01T11:00:00Z',
    indexedAt: '2024-03-01T11:15:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'AI needs more information',
    message: 'The AI assistant needs additional details for ticket TKT-001.',
    read: false,
    createdAt: '2024-03-13T10:00:00Z',
    ticketId: 'TKT-001',
  },
  {
    id: '2',
    type: 'success',
    title: 'Ticket Resolved',
    message: 'Your ticket TKT-004 has been resolved successfully.',
    read: false,
    createdAt: '2024-03-12T15:00:00Z',
    ticketId: 'TKT-004',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Ticket Escalated',
    message: 'Ticket TKT-003 has been escalated for urgent review.',
    read: true,
    createdAt: '2024-03-12T09:30:00Z',
    ticketId: 'TKT-003',
  },
  {
    id: '4',
    type: 'info',
    title: 'Admin Update',
    message: 'An admin has responded to your ticket TKT-002.',
    read: true,
    createdAt: '2024-03-11T16:00:00Z',
    ticketId: 'TKT-002',
  },
];

export const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Where is my order #12345?',
    createdAt: '2024-03-13T10:00:00Z',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'I can help you track your order! Let me look that up for you.\n\nYour order #12345 is currently **in transit** and is expected to arrive by **March 15, 2024**.\n\nHere are the details:\n- **Status**: Out for delivery\n- **Carrier**: Express Shipping\n- **Tracking Number**: EXP123456789\n\nWould you like me to help you with anything else regarding this order?',
    createdAt: '2024-03-13T10:00:05Z',
  },
];

export const mockAnalytics: AnalyticsData = {
  totalTickets: 156,
  highPriorityTickets: 23,
  escalatedTickets: 8,
  avgResolutionTime: 4.5,
  ticketsByCategory: [
    { category: 'Delivery', count: 45 },
    { category: 'Refund', count: 32 },
    { category: 'Payment', count: 28 },
    { category: 'General', count: 25 },
    { category: 'Wrong Item', count: 18 },
    { category: 'Other', count: 8 },
  ],
  ticketsByStatus: [
    { status: 'NEW', count: 15 },
    { status: 'PROCESSING', count: 28 },
    { status: 'WAITING_FOR_CUSTOMER', count: 12 },
    { status: 'WAITING_ADMIN_APPROVAL', count: 18 },
    { status: 'RESOLVED', count: 65 },
    { status: 'ESCALATED', count: 8 },
    { status: 'CLOSED', count: 10 },
  ],
  ticketsByPriority: [
    { priority: 'low', count: 45 },
    { priority: 'medium', count: 68 },
    { priority: 'high', count: 32 },
    { priority: 'critical', count: 11 },
  ],
  ticketTrends: [
    { date: '2024-03-07', count: 18 },
    { date: '2024-03-08', count: 24 },
    { date: '2024-03-09', count: 15 },
    { date: '2024-03-10', count: 22 },
    { date: '2024-03-11', count: 28 },
    { date: '2024-03-12', count: 31 },
    { date: '2024-03-13', count: 18 },
  ],
  aiConfidenceDistribution: [
    { range: '90-100%', count: 42 },
    { range: '80-89%', count: 38 },
    { range: '70-79%', count: 28 },
    { range: '60-69%', count: 22 },
    { range: 'Below 60%', count: 26 },
  ],
};

export const ticketCategories = [
  'Delivery',
  'Refund',
  'Payment',
  'General',
  'Wrong Item',
  'Product Quality',
  'Account',
  'Other',
];

export const suggestedPrompts = [
  'Where is my order?',
  'How do I return an item?',
  'What is your refund policy?',
  'I have a payment issue',
  'Track my shipment',
  'Cancel my order',
];
