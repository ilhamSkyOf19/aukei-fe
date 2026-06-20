import type { ElementType } from "react";
import {
  Boxes,
  CheckCircle2,
  LayoutDashboard,
  Package,
  RefreshCcw,
  UsersRound,
} from "lucide-react";

export const NAVIGATION_LIST_OWNER: {
  label: string;
  link: string;
  icon: ElementType;
}[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
  {
    label: "Produk",
    icon: Boxes,
    link: "/dashboard/produk",
  },
  {
    label: "Inventori",
    icon: Package,
    link: "/dashboard/inventori",
  },
  {
    label: "Pegawai",
    icon: UsersRound,
    link: "/dashboard/pegawai",
  },
];

export const statusStyle = {
  REVISION: {
    badge: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
    borderDot: "border-rose-500",
    icon: <RefreshCcw size={16} />,
  },
  APPROVED: {
    badge: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
    borderDot: "border-emerald-500",
    icon: <CheckCircle2 size={16} />,
  },
  PENDING: {
    badge: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500 ",
    borderDot: "border-amber-500",
    icon: <RefreshCcw size={16} />,
  },
} as const;
