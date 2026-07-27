import {
  Pie,
  PieChart,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
  Sector,
  useActiveTooltipDataPoints,
  useIsTooltipActive,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { formatNumber } from "../../../helpers/helpers";
import type { PaymentMethodType } from "../../../types/constant.type";
import type { FC } from "react";
import { cn } from "../../../utils/cn";
import useSizeWindows from "../../../hooks/useSizeWindows";
import useGrafikPieMetodePembayaran from "./useGrafikPieMetodePembayaran";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import { CircleAlert } from "lucide-react";

// #endregion
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  // Hook harus dipanggil di paling atas, sebelum ada kemungkinan early return
  const windowSize = useSizeWindows();

  const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;

  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  if (!value) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={windowSize === "sm" ? 10 : 18}
      fontWeight={600}
    >
      {formatNumber(value ?? 0)}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  const activePoints = useActiveTooltipDataPoints();
  const isAnyPieActive = useIsTooltipActive();
  const isThisPieActive = isAnyPieActive && props.payload === activePoints?.[0];

  // payload di sini adalah item dataChart asli (punya field value)
  const value = (props.payload as { value?: number } | undefined)?.value ?? 0;
  const isEmptySlice = value === 0;

  let fillOpacity: number;
  if (isEmptySlice) {
    fillOpacity = 0.25; // slice kosong dibuat pudar, tetap kelihatan tapi jelas "tidak ada data"
  } else if (isAnyPieActive && !isThisPieActive) {
    fillOpacity = 0.5;
  } else {
    fillOpacity = 1;
  }

  // Efek "membesar sedikit" saat slice sedang di-hover, kecuali slice kosong
  const outerRadius =
    isThisPieActive && !isEmptySlice
      ? Number(props.outerRadius) + 6
      : props.outerRadius;

  return (
    <Sector
      {...props}
      outerRadius={outerRadius}
      fill={props.fill}
      fillOpacity={fillOpacity}
      style={{ transition: "all 0.25s ease" }}
    />
  );
};

type Props = {
  isAnimationActive?: boolean;
};

const GrafikPieMetodePembayaran: FC<Props> = ({ isAnimationActive = true }) => {
  const { dataChart, startDate, endDate, isLoading, isEmptyData } =
    useGrafikPieMetodePembayaran();

  return (
    <div className="lg:flex-1 flex flex-col justify-start items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 lg:p-0 h-60 md:h-80 lg:h-90">
      {/* header */}
      <div className="flex flex-row justify-start items-start gap-2 md:p-2.5">
        <h3 className="text-sm font-semibold text-base-content capitalize">
          Metode Pembayaran
        </h3>

        <div
          className="tooltip z-30 tooltip-custom"
          data-tip={`Data dari periode ${formatTanggalPanjang(startDate)} - ${formatTanggalPanjang(endDate)}`}
        >
          <button className="p-0.5">
            <CircleAlert className="size-4 text-base-content/50" />
          </button>
        </div>
      </div>
      <div className="w-full h-full flex flex-row justify-start items-center gap-2 md:gap-4">
        <div className="flex-3 h-full flex flex-col justify-start items-center">
          {isLoading ? (
            <div className="w-50 h-50 rounded-full skeleton flex justify-center items-center">
              <span className="text-sm skeleton-text skeleton">
                Menampilkan Grafik ...
              </span>
            </div>
          ) : !isEmptyData ? (
            <PieChart
              style={{
                width: "100%",
                height: "90%",
              }}
              responsive
            >
              <Pie
                data={dataChart ?? []}
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value"
                nameKey="label"
                innerRadius="30%"
                outerRadius="85%"
                paddingAngle={3}
                cornerRadius={6}
                minAngle={6}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={isAnimationActive}
                shape={MyCustomPie}
              />
              <RechartsDevtools />
            </PieChart>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-xs md:text-sm font-medium text-base-content/50">
                Tidak Ada Data Grafik
              </span>
            </div>
          )}
        </div>

        <div className="flex-2 h-full flex px-4 flex-col justify-center items-center gap-1 md:gap-4">
          {isLoading ? (
            <>
              <div className="w-full h-4 skeleton" />
              <div className="w-full h-4 skeleton" />
              <div className="w-full h-4 skeleton" />
              <div className="w-full h-4 skeleton" />
            </>
          ) : (
            dataChart?.map((item, index) => (
              <ComponentData
                key={index}
                metodePembayaran={item.label}
                persentase={item.persentase}
                value={item.value}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// card
type ComponentDataProps = {
  metodePembayaran: PaymentMethodType;
  value: number;
  persentase: number;
};
const ComponentData: FC<ComponentDataProps> = ({
  metodePembayaran,
  persentase,
  value,
}) => {
  const isEmpty = value === 0;

  return (
    <div
      className={cn(
        "grid grid-cols-7 md:grid-cols-9 md:gap-2 w-full rounded-lg px-1.5 py-1 transition-colors",
        "hover:bg-base-200/60",
        isEmpty && "opacity-50",
      )}
    >
      {/* status */}
      <div className="col-span-1 flex items-center">
        <div
          aria-label="status"
          className={cn(
            "status",
            metodePembayaran === "CASH" && "status-custom-green",
            metodePembayaran === "TRANSFER" && "status-custom-blue",
            metodePembayaran === "QRIS" && "status-custom-purple",
            metodePembayaran === "TEMPO" && "status-custom-yellow",
          )}
        />
      </div>

      <div className="col-span-2 md:col-span-4 flex items-center">
        <span
          className={cn(
            "font-medium text-[0.625rem] md:text-xs text-base-content/70",
            metodePembayaran === "QRIS" ? "uppercase" : "capitalize",
          )}
        >
          {metodePembayaran.toLowerCase()}
        </span>
      </div>
      <div className="col-span-4 md:col-span-4 flex items-center">
        <span className="text-[0.625rem] md:text-xs font-medium text-base-content">
          {value === 0 ? "0" : formatNumber(value)}{" "}
          <span className="text-base-content/50 text-[0.625rem] md:text-xs">
            ({persentase}%)
          </span>
        </span>
      </div>
    </div>
  );
};

export default GrafikPieMetodePembayaran;
