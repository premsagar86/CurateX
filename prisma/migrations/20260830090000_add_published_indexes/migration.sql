-- CreateIndex
CREATE INDEX "case_study_publishedAt_idx" ON "case_study"("publishedAt");

-- CreateIndex
CREATE INDEX "content_post_publishedAt_idx" ON "content_post"("publishedAt");

-- CreateIndex
CREATE INDEX "testimonial_approvedAt_idx" ON "testimonial"("approvedAt");
