import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
  type LabelProps,
} from "recharts";
import { formatNumber, formatNumberK } from "../../../helpers/helpers";
import type { FC } from "react";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { RechartsDevtools } from "@recharts/devtools";
import DropDown from "../../inputs/DropDown";
import {
  formatTanggalLengkap,
  formatTanggalPanjang,
} from "../../../helpers/formatDate";
import useGrafikBatang from "./useGrafikBatang";

const renderCustomizedLabel = (props: LabelProps) => {
  // window size
  const windowSize = useSizeWindows();

  const { x, y, width, value } = props;

  if (x == null || y == null || width == null) {
    return null;
  }
  const radius = 10;

  return (
    <g>
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) - radius}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={windowSize === "sm" ? 10 : 11}
        fontWeight={500}
      >
        {formatNumber(value?.toString() || "0")}
      </text>
    </g>
  );
};

// grafik batang
type GrafikBatangProps = {
  windowSize: "sm" | "md" | "lg";
};
const GrafikBatang: FC<GrafikBatangProps> = ({ windowSize }) => {
  const { isChoose, data, handleSetIsChoose } = useGrafikBatang();
  return (
    <div className="md:flex-1 flex flex-col justify-between items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg gap-4 h-80 md:h-90">
      {/* header */}
      <div className="w-full flex flex-row justify-between items-start px-2 md:px-4 pt-2 gap-4">
        {/* header */}
        <div className="flex flex-col justify-start items-start">
          <h3 className="text-sm font-semibold text-base-content capitalize">
            Grafik {isChoose}
          </h3>

          <span className="text-xs font-medium text-base-content/50">
            Grafik {isChoose} terjual selama periode{" "}
            {formatTanggalPanjang(new Date())} -{" "}
            {formatTanggalLengkap(new Date())}
          </span>
        </div>

        {/* dropdown */}
        <DropDown
          listChoose={[
            {
              label: "Produk",
              value: "produk",
            },
            {
              label: "Item",
              value: "item",
            },
          ]}
          handleChange={(e) => handleSetIsChoose(e.target.value)}
          placeholder="Jenis"
          defaultValue="produk"
          customWidth="w-40 md:w-30"
        />
      </div>
      <BarChart
        margin={{
          top: 20,
          right: windowSize === "sm" ? 15 : 20,
          left: -15,
          bottom: 15,
        }}
        responsive
        height="100%"
        width="100%"
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{
            fontSize: windowSize === "sm" ? 10 : 11,
            fontWeight: "500",
          }}
        />
        <YAxis
          tickFormatter={(value) => formatNumberK(value)}
          tick={{
            fontSize: windowSize === "sm" ? 10 : 11,
            fontWeight: "500",
          }}
        />

        {windowSize === "sm" && (
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const data = payload[0].payload;

              return (
                <div className="rounded-2xl border bg-base-100 p-4 shadow-xl w-30">
                  <p className="text-xs font-medium text-base-content/80">
                    {data.date}
                  </p>
                  <p className="text-sm font-semibold text-base-content">
                    {formatNumber(data.value)}
                  </p>
                </div>
              );
            }}
          />
        )}
        <Bar
          fill="#cdde00"
          stroke="#28484b"
          dataKey="value"
          isAnimationActive={true}
          barSize={windowSize === "sm" ? 25 : 40}
        >
          <LabelList
            dataKey="value"
            content={renderCustomizedLabel}
            offset={10}
          />
        </Bar>

        <RechartsDevtools />
      </BarChart>
    </div>
  );
};

export default GrafikBatang;
