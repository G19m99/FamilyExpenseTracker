# 👨‍👩‍👧‍👦 FamilyTracker

> **Convex + Resend Hackathon**: Real-time family expense tracking with automated email reports

**🚀 Live Demo: [family-expense-tracker.netlify.app](https://family-expense-tracker.netlify.app)**

## 🎯 Overview

FamilyTracker showcases the power of **Convex + Resend integration** through a family expense tracking SaaS. Multiple family members track shared expenses in real-time, while beautiful automated emails keep everyone informed with monthly spending reports.

## 🛠️ Tech Stack

- **Backend**: [Convex](https://convex.dev) - Real-time database & serverless functions
- **Email**: [Resend](https://resend.com) via [Convex Resend Component](https://www.convex.dev/components/resend)
- **Frontend**: React 19 + TypeScript + Vite
- **Email Templates**: [@react-email/components](https://react.email)
- **Auth**: [Convex Auth](https://auth.convex.dev) with Google OAuth
- **UI**: Tailwind CSS + shadcn/ui

## 📧 Email Features

### 1. **Family Invitation System**

- Beautiful React Email templates with secure token-based invitations
- Automatic email sending when family members are invited
- Gmail-compatible layouts (table-based, no flexbox)

### 2. **Automated Monthly Digest Emails**

- **Scheduled monthly reports** sent to all family members via Convex cron jobs
- **Rich spending analytics**: category breakdowns, top contributors, notable expenses
- **Month-over-month comparisons** with percentage changes
- **Real-time data integration** from Convex database

### 3. **Cross-Client Email Compatibility**

- Works perfectly in Gmail, Outlook, Apple Mail, and other email clients
- Responsive design with dark/light mode support
- Type-safe email data flow from Convex schema to templates

## 🚀 App Features

### Real-time Expense Tracking

- Add/edit/delete expenses with instant sync across family members
- Smart categorization with custom categories
- Advanced filtering and search capabilities

### Family Management

- Multi-user families with admin/member roles
- Email-based invitation system
- Real-time collaboration on shared expenses

## 🔧 Convex + Resend Integration

**Why This Showcases the Platform:**

1. **Real-time data → Real-time emails**: Expense changes trigger immediate notifications
2. **Type safety**: End-to-end type safety from Convex schema to email templates
3. **Serverless simplicity**: No email server management - pure business logic
4. **Automated scheduling**: Convex cron jobs handle monthly digest timing
5. **Scalable architecture**: Handles family growth and email volume automatically

## 📊 Database Schema

```typescript
// Real-time expense tracking with email automation
families: {
  (name, createdBy);
}
expenses: {
  (familyId, description, amount, category, date);
}
familyMembers: {
  (familyId, userId, role);
}
invitations: {
  (familyId, email, token, status);
}
```

## 🚀 Quick Start

```bash
npm install
npx convex dev
npm run dev  # Starts Vite + Convex
npm run email  # Preview email templates
```

## 🛣️ Roadmap

### Phase 1: Enhanced Features

- [ ] **Analytics Dashboard** - Visual spending insights and trends
- [ ] **Budget Tracking** - Set budgets with email alerts
- [ ] **Receipt Upload** - Photo-based expense entry

### Phase 2: AI Integration

- [ ] **Smart Categorization** - Auto-categorize expenses with AI
- [ ] **Spending Predictions** - Predictive analytics with email insights
- [ ] **Personalized Reports** - Custom email frequency and content

### Phase 3: Advanced Integrations

- [ ] **Bank Account Sync** - Automatic transaction import
- [ ] **Receipt OCR** - Extract data from receipt photos
- [ ] **Multi-currency Support** - Global family expense tracking
