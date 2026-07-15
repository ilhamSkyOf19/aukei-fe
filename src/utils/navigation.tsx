import type { ElementType } from "react";
import {
  Boxes,
  ChartLine,
  CheckCircle2,
  History,
  LayoutDashboard,
  LucideArrowLeftSquare,
  LucideArrowRightSquare,
  Package,
  RefreshCcw,
  ShoppingCart,
  Store,
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
  {
    label: "Statistik",
    icon: ChartLine,
    link: "/dashboard/statistik",
  },
  {
    label: "Pelanggan",
    icon: UsersRound,
    link: "/dashboard/pelanggan",
  },
  {
    label: "Riwayat Transaksi",
    icon: History,
    link: "/dashboard/riwayat-transaksi",
  },
];

export const NAVIGATION_LIST_KASIR: {
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
    label: "Kasir",
    icon: Store,
    link: "/dashboard/kasir",
  },
  {
    label: "Keranjang",
    icon: ShoppingCart,
    link: "/dashboard/keranjang",
  },
  {
    label: "Pengajuan Barang Masuk",
    icon: LucideArrowRightSquare,
    link: "/dashboard/pengajuan-barang-masuk",
  },
  {
    label: "Pengajuan Barang Keluar",
    icon: LucideArrowLeftSquare,
    link: "/dashboard/pengajuan-barang-keluar",
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
