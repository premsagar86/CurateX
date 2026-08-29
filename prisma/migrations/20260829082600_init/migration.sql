-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'TEAM');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('WEBSITE', 'UI_UX_DESIGN', 'BRANDING', 'GRAPHIC_DESIGN', 'SOCIAL_MEDIA', 'CONTENT_CREATION', 'SEO', 'ECOMMERCE');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_25K', 'RANGE_25K_75K', 'RANGE_75K_2L', 'OVER_2L', 'NOT_SURE');

-- CreateEnum
CREATE TYPE "TimelineUrgency" AS ENUM ('ASAP', 'ONE_MONTH', 'ONE_TO_THREE_MONTHS', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "AcquisitionSource" AS ENUM ('REFERRAL', 'OUTREACH', 'INBOUND', 'PARTNER');

-- CreateEnum
CREATE TYPE "PackageTier" AS ENUM ('STARTER', 'GROWTH', 'PREMIUM', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ProjectState" AS ENUM ('ONBOARDING', 'ACTIVE', 'REVIEW', 'APPROVED', 'DELIVERED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'AWAITING_APPROVAL', 'APPROVED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "clientId" TEXT,
    "phone" TEXT,
    "notificationPrefs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "password" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "scope" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "service" "ServiceType" NOT NULL,
    "budgetRange" "BudgetRange" NOT NULL,
    "timeline" "TimelineUrgency" NOT NULL,
    "message" TEXT,
    "internalNotes" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "convertedClientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "industry" TEXT,
    "source" "AcquisitionSource" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "packageTier" "PackageTier" NOT NULL,
    "state" "ProjectState" NOT NULL DEFAULT 'ONBOARDING',
    "founderOwnerId" TEXT NOT NULL,
    "startDate" DATE,
    "targetDeliveryDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'UPCOMING',
    "dueDate" DATE,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "milestoneId" TEXT,
    "uploadedByUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "supersedesFileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "milestoneId" TEXT,
    "authorUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "number" TEXT NOT NULL,
    "amountTotal" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" DATE NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paymentReference" TEXT,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_item" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitAmount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "invoice_line_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retainer" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "monthlyAmount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" DATE NOT NULL,
    "billingDay" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "clientId" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "documentUrl" TEXT,
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_post" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_study" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "testimonialId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "services" JSONB,
    "challenge" TEXT NOT NULL,
    "approach" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_clientId_idx" ON "user"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "lead_status_idx" ON "lead"("status");

-- CreateIndex
CREATE INDEX "lead_createdAt_idx" ON "lead"("createdAt");

-- CreateIndex
CREATE INDEX "project_clientId_idx" ON "project"("clientId");

-- CreateIndex
CREATE INDEX "project_state_idx" ON "project"("state");

-- CreateIndex
CREATE INDEX "project_founderOwnerId_idx" ON "project"("founderOwnerId");

-- CreateIndex
CREATE INDEX "milestone_projectId_order_idx" ON "milestone"("projectId", "order");

-- CreateIndex
CREATE INDEX "file_projectId_idx" ON "file"("projectId");

-- CreateIndex
CREATE INDEX "file_milestoneId_idx" ON "file"("milestoneId");

-- CreateIndex
CREATE INDEX "comment_projectId_createdAt_idx" ON "comment"("projectId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_number_key" ON "invoice"("number");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_razorpayOrderId_key" ON "invoice"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "invoice_clientId_idx" ON "invoice"("clientId");

-- CreateIndex
CREATE INDEX "invoice_status_idx" ON "invoice"("status");

-- CreateIndex
CREATE INDEX "retainer_clientId_idx" ON "retainer"("clientId");

-- CreateIndex
CREATE INDEX "proposal_leadId_idx" ON "proposal"("leadId");

-- CreateIndex
CREATE INDEX "proposal_clientId_idx" ON "proposal"("clientId");

-- CreateIndex
CREATE INDEX "notification_userId_readAt_idx" ON "notification"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "content_post_slug_key" ON "content_post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "case_study_slug_key" ON "case_study"("slug");

-- CreateIndex
CREATE INDEX "audit_log_entityType_entityId_idx" ON "audit_log"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_convertedClientId_fkey" FOREIGN KEY ("convertedClientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_founderOwnerId_fkey" FOREIGN KEY ("founderOwnerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone" ADD CONSTRAINT "milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_supersedesFileId_fkey" FOREIGN KEY ("supersedesFileId") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retainer" ADD CONSTRAINT "retainer_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_post" ADD CONSTRAINT "content_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_study" ADD CONSTRAINT "case_study_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_study" ADD CONSTRAINT "case_study_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "testimonial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonial" ADD CONSTRAINT "testimonial_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
