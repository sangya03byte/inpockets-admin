// Shapes returned by the backend admin API (see /openapi.json). Money is a decimal STRING.
export type AppStatus =
  | "DRAFT" | "SUBMITTED" | "PROCESSING" | "PENDING_ADDITIONAL_INFORMATION" | "MANUAL_REVIEW"
  | "APPROVED" | "REJECTED" | "CANCELLED" | "EXPIRED";

export type Me = {
  admin_id: string; user_id: string; role: string; permissions: string[];
  mfa_enabled: boolean; mfa_required: boolean; mfa_enrollment_required: boolean;
};
export type QueueItem = {
  id: string; application_number: string; user_id: string; customer_name: string | null; phone_last4: string | null;
  status: AppStatus; requested_amount: string; requested_tenure_days: number; submitted_at: string | null; created_at: string;
};
export type Queue = { items: QueueItem[]; total: number; page: number; page_size: number };
export type Application = {
  id: string; application_number: string; user_id: string; status: AppStatus;
  requested_amount: string; requested_tenure_days: number; submitted_at: string | null; created_at: string; updated_at: string;
};
export type AppEvent = {
  id: string; event_type: string; previous_status: string | null; new_status: string; actor_type: string;
  reason: string | null; created_at: string;
};
export type Decision = {
  id: string; loan_application_id: string; decision: "APPROVED" | "REJECTED"; approved_amount: string | null;
  reason: string; decided_by_admin_user_id: string; created_at: string;
} | null;
export type Customer = {
  customer_id: string; phone_number: string; status: string; first_name: string | null; last_name: string | null;
  onboarding_status: string | null; onboarding_step: string | null; created_at: string;
  pan_status?: string | null; pan_number_masked?: string | null; kyc_status?: string | null; identity_verification_status?: string | null;
};
export type CustomerList = { items: Customer[]; page: number; page_size: number; total: number };
export type Offer = {
  id: string; loan_application_id: string; version: number; principal_amount: string; tenure_days: number;
  commercial_terms: Record<string, string>; issued_at: string | null; expires_at: string | null; accepted_at: string | null;
  kfs_document_id: string | null; agreement_document_id: string | null; created_at: string; status: string;
  effective_status?: string; user_id: string;
};
export type ESignAdmin = {
  id: string; status: string; provider: string; provider_ref: string | null; failure_reason: string | null;
  signed_at: string | null; expires_at: string; events: { status?: string; outcome?: string; received_at?: string }[];
};
export type BankVerification = {
  id: string; user_id: string; status: string; account_number_masked: string; ifsc: string; bank_name: string | null;
  name_match_result: string | null; failure_code: string | null; requested_at: string; verified_at: string | null;
};
export type Disbursement = {
  id: string; user_id: string; loan_application_id: string; loan_offer_id: string; status: string; amount: string;
  currency: string; account_number_masked: string; ifsc: string; attempt: number; provider: string;
  provider_ref: string | null; utr: string | null; failure_code: string | null; review_reason: string | null;
  dispatch_attempts: number; requested_at: string; dispatched_at: string | null; last_polled_at: string | null;
  completed_at: string | null; reversed_at: string | null;
  events?: { provider_event_id: string; reported_status: string; outcome: string; received_at: string }[];
};
export type Staff = { id: string; user_id: string; phone_last4: string | null; role: string; is_active: boolean; mfa_enabled: boolean; created_at: string };
