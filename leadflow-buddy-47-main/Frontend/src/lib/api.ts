import axios from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("leadflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("leadflow_token");
      localStorage.removeItem("leadflow_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
] as const;

export const LEAD_SOURCES = [
  "Website",
  "LinkedIn",
  "Referral",
  "Cold Call",
  "Email",
  "Other",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface Lead {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  assignedTo: string;
  status: LeadStatus;
  dealValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  leadId: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface DashboardData {
  counts: {
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    qualifiedLeads: number;
    proposalSentLeads: number;
    wonLeads: number;
    lostLeads: number;
  };
  revenue: {
    totalDealValue: number;
    wonDealValue: number;
    lostDealValue: number;
  };
  recentLeads: Array<
    Pick<Lead, "_id" | "name" | "company" | "status" | "dealValue" | "createdAt">
  >;
}

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const statusColor: Record<LeadStatus, string> = {
  New: "bg-status-new/10 text-status-new border-status-new/20",
  Contacted: "bg-status-contacted/10 text-status-contacted border-status-contacted/20",
  Qualified: "bg-status-qualified/10 text-status-qualified border-status-qualified/20",
  "Proposal Sent": "bg-status-proposal/10 text-status-proposal border-status-proposal/20",
  Won: "bg-status-won/10 text-status-won border-status-won/20",
  Lost: "bg-status-lost/10 text-status-lost border-status-lost/20",
};
