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

// #region Sample data
const COLORS = [
  "oklch(70.7% 0.165 254.624)",
  "oklch(76.5% 0.177 163.223)",
  "oklch(82.8% 0.189 84.429)",
  "oklch(71.4% 0.203 305.504)",
];

const data = [
  { name: "Group A", value: 400, fill: COLORS[0] },
  { name: "Group B", value: 300, fill: COLORS[1] },
  { name: "Group C", value: 300, fill: COLORS[2] },
  { name: "Group D", value: 200, fill: COLORS[3] },
];

// #endregion
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  // window size
  const windowSize = useSizeWindows();

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={windowSize === "sm" ? 10 : 18}
    >
      {formatNumber(value ?? 0)}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  const p = useActiveTooltipDataPoints();
  const isAnyPieActive = useIsTooltipActive();
  const isThisPieActive = isAnyPieActive && props.payload === p?.[0];
  let fillOpacity: number;
  if (isAnyPieActive && !isThisPieActive) {
    fillOpacity = 0.5;
  } else {
    fillOpacity = 1;
  }
  return (
    <Sector
      {...props}
      fill={props.payload?.fill}
      fillOpacity={fillOpacity}
      style={{ transition: "fill-opacity 0.3s ease" }}
    />
  );
};

type Props = {
  isAnimationActive?: boolean;
};

const GrafikPieMetodePembayaran: FC<Props> = ({ isAnimationActive = true }) => {
  return (
    <div className="md:flex-1 flex flex-col justify-start items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg py-2.5 px-2.5 md:p-0 h-60 md:h-90">
      {/* header */}
      <div className="w-full flex flex-col justify-start items-start px-4 pt-2">
        <h3 className="text-sm font-semibold text-base-content capitalize">
          Metode Pembayaran
        </h3>

        <span className="text-xs font-medium text-base-content/50">
          Jumlah metode pembayaran yang digunakan
        </span>
      </div>
      <div className="w-full flex flex-row justify-start items-center gap-2 md:gap-4">
        <div className="flex-1 flex flex-col justify-center items-center">
          <PieChart
            style={{
              width: "100%",
              height: "100%",
              marginLeft: -20,
            }}
            responsive
          >
            <Pie
              data={data}
              labelLine={false}
              label={renderCustomizedLabel}
              dataKey="value"
              isAnimationActive={isAnimationActive}
              shape={MyCustomPie}
            />
            <RechartsDevtools />
          </PieChart>
        </div>

        <div className="flex-1 h-full flex flex-col justify-center items-center gap-4">
          <ComponentData metodePembayaran="CASH" />
          <ComponentData metodePembayaran="TRANSFER" />
          <ComponentData metodePembayaran="QRIS" />
          <ComponentData metodePembayaran="TEMPO" />
        </div>
      </div>
    </div>
  );
};

// card
type ComponentDataProps = {
  metodePembayaran: PaymentMethodType;
};
const ComponentData: FC<ComponentDataProps> = ({ metodePembayaran }) => {
  return (
    <div className="grid grid-cols-7 md:grid-cols-9 md:gap-2 w-full">
      {/* status */}
      <div className="col-span-1">
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

      <div className="col-span-2 md:col-span-4">
        <span
          className={cn(
            "font-medium text-[0.625rem] lg:text-sm text-base-content/70",
            metodePembayaran === "QRIS" ? "uppercase" : "capitalize",
          )}
        >
          {metodePembayaran.toLowerCase()}
        </span>
      </div>
      <div className="col-span-4 md:col-span-4">
        <span className="text-[0.625rem] md:text-sm font-medium text-base-content">
          {formatNumber(2000)}{" "}
          <span className="text-base-content/50 text-[0.625rem] md:text-xs">
            (20%)
          </span>
        </span>
      </div>
    </div>
  );
};

export default GrafikPieMetodePembayaran;
