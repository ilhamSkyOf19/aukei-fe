import { CheckCircle, Clock, Inbox, XCircle } from "lucide-react";

export const statusStyle = {
  REJECTED: {
    badge: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "bg-rose-600",
    borderDot: "border-rose-500",
    icon: <XCircle size={16} />,
  },
  POSTED: {
    badge: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "bg-emerald-600",
    borderDot: "border-emerald-500",
    icon: <CheckCircle size={16} />,
  },
  PENDING: {
    badge: "bg-amber-100 text-amber-600",
    dot: "bg-amber-600 ",
    bg: "bg-amber-50",
    text: "bg-amber-600",
    borderDot: "border-amber-600",
    icon: <Clock size={16} />,
  },
  DRAFT: {
    badge: "bg-blue-100 text-blue-600",
    dot: "bg-blue-600",
    bg: "bg-blue-50",
    text: "bg-blue-600",
    borderDot: "border-blue-600",
    icon: <Inbox size={16} />,
  },
  CANCELLED: {
    badge: "bg-gray-100 text-gray-600",
    dot: "bg-gray-600",
    bg: "bg-gray-50",
    text: "bg-gray-600",
    borderDot: "border-gray-600",
    icon: <XCircle size={16} />,
  },
} as const;

export const statusMetodePembayaranStyle = {
  CASH: {
    badge: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
    borderDot: "border-emerald-500",
  },
  TRANSFER: {
    badge: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
    borderDot: "border-blue-500",
  },
  QRIS: {
    badge: "bg-purple-100 text-purple-600",
    dot: "bg-purple-500",
    borderDot: "border-purple-500",
  },
} as const;

export const statusStyleReturBarang = {
  REJECTED: {
    badge: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "bg-rose-600",
    borderDot: "border-rose-500",
    icon: <XCircle size={16} />,
  },
  APPROVED: {
    badge: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "bg-emerald-600",
    borderDot: "border-emerald-500",
    icon: <CheckCircle size={16} />,
  },
  PENDING: {
    badge: "bg-amber-100 text-amber-600",
    dot: "bg-amber-600 ",
    bg: "bg-amber-50",
    text: "bg-amber-600",
    borderDot: "border-amber-600",
    icon: <Clock size={16} />,
  },
  DRAFT: {
    badge: "bg-blue-100 text-blue-600",
    dot: "bg-blue-600",
    bg: "bg-blue-50",
    text: "bg-blue-600",
    borderDot: "border-blue-600",
    icon: <Inbox size={16} />,
  },
  CANCELLED: {
    badge: "bg-gray-100 text-gray-600",
    dot: "bg-gray-600",
    bg: "bg-gray-50",
    text: "bg-gray-600",
    borderDot: "border-gray-600",
    icon: <XCircle size={16} />,
  },
} as const;
