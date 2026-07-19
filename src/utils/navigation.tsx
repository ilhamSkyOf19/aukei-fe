import type { ElementType } from "react";
import {
  Boxes,
  CalendarDays,
  ChartLine,
  Clock,
  History,
  LayoutDashboard,
  LucideArrowLeftSquare,
  LucideArrowRightSquare,
  Package,
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
    label: "Kredit",
    icon: CalendarDays,
    link: "/dashboard/kredit",
  },
  {
    label: "Booking",
    icon: Clock,
    link: "/dashboard/booking",
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
