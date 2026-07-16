import type { FC } from "react";
import { cn } from "../../../utils/cn";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatRupiah, formatRupiahChartValue } from "../../../helpers/helpers";
import { RechartsDevtools } from "@recharts/devtools";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import DropDown from "../../inputs/DropDown";
import useGrafikLine from "./useGrafikLine";

// grafik line
type GrafikLineProps = {
  windowSize: "sm" | "md" | "lg";
};
const GrafikLine: FC<GrafikLineProps> = ({ windowSize }) => {
  const {
    isChoose,
    handleSetIsChoose,
    isLoading,
    dataChart,
    endDate,
    startDate,
  } = useGrafikLine();
  return (
    <div
      className={cn(
        "lg:flex-1 flex flex-col justify-start items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl lg:rounded-xl gap-4 h-80 md:h-100 lg:h-90",
      )}
    >
      {/* header */}
      <div className="w-full flex flex-row justify-between items-start px-2 md:px-4 pt-2 gap-4">
        {/* header */}
        <div className="flex flex-col justify-start items-start">
          <h3 className="text-sm font-semibold text-base-content capitalize">
            Grafik {isChoose}
          </h3>

          <span className="text-xs font-medium text-base-content/80">
            Grafik {isChoose} selama periode {formatTanggalPanjang(startDate)} -{" "}
            {formatTanggalPanjang(endDate)}
          </span>
        </div>

        {/* dropdown */}
        <DropDown
          value={isChoose}
          isLoading={isLoading}
          listChoose={[
            {
              label: "Omzet",
              value: "omzet",
            },
            {
              label: "Modal",
              value: "modal",
            },
            {
              label: "Laba",
              value: "laba",
            },
          ]}
          handleChange={(e) => handleSetIsChoose(e.target.value)}
          placeholder="Jenis"
          defaultValue="omzet"
          customWidth="w-40 md:w-30"
        />
      </div>

      {/* graifk  */}
      {isLoading ? (
        <div className="w-full h-full p-4">
          <div className="w-full h-full skeleton flex justify-center items-center">
            <span className="skeleton skeleton-text">
              Menampilkan grafik...
            </span>
          </div>
        </div>
      ) : (
        <AreaChart
          style={{
            width: "100%",
            height: "100%",
          }}
          responsive
          data={dataChart}
          margin={{
            top: 10,
            right: windowSize !== "sm" ? 35 : 30,
            left: windowSize !== "sm" ? -15 : -20,
            bottom: 15,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#cdde00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#cdde00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{
              fontSize: windowSize === "sm" ? 10 : 11,
              fontWeight: "500",
            }}
            interval={
              windowSize === "sm"
                ? 5
                : dataChart
                  ? dataChart?.length > 25
                    ? 3
                    : dataChart?.length > 16
                      ? 2
                      : dataChart?.length > 12
                        ? 1
                        : 0
                  : 0
            }
          />
          <YAxis
            width={60}
            tickFormatter={formatRupiahChartValue}
            tick={{
              fontSize: windowSize === "sm" ? 10 : 11,
              fontWeight: "500",
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const data = payload[0].payload;

              return (
                <div className="rounded-2xl border bg-base-100 p-4 shadow-xl w-50 flex flex-col justify-start items-start gap-2 border-base-content">
                  <p className="text-xs font-medium text-base-content/80">
                    {data.date}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      data.value < 0 ? "text-error" : "text-base-content",
                    )}
                  >
                    {formatRupiah(data.value)}
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#28484b"
            fillOpacity={1}
            fill="url(#colorValue)"
            isAnimationActive={true}
            animationBegin={200}
            animationDuration={500}
          />
          <RechartsDevtools />
        </AreaChart>
      )}
    </div>
  );
};

export default GrafikLine;
