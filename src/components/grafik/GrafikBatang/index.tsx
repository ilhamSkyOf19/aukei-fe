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
import { formatTanggalPanjang } from "../../../helpers/formatDate";
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
  const {
    isChoose,
    handleSetIsChoose,
    isLoading,
    chartData,
    endDate,
    startDate,
  } = useGrafikBatang();
  return (
    <div className=" flex flex-col justify-between items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl gap-4 h-80 md:h-100">
      {/* header */}
      <div className="w-full flex flex-row justify-between items-start px-2 md:px-4 pt-2 gap-4">
        {/* header */}
        <div className="flex flex-col justify-start items-start">
          <h3 className="text-sm font-semibold text-base-content capitalize">
            Grafik {isChoose}
          </h3>

          <span className="text-xs font-medium text-base-content/50">
            Grafik {isChoose} terjual selama periode{" "}
            {formatTanggalPanjang(startDate)} - {formatTanggalPanjang(endDate)}
          </span>
        </div>

        {/* dropdown */}
        <DropDown
          value={isChoose}
          isLoading={isLoading}
          listChoose={[
            {
              label: "Produk Terjual",
              value: "produk",
            },
            {
              label: "Item terjual",
              value: "item",
            },
            {
              label: "Barang Rusak",
              value: "rusak",
            },
            {
              label: "Barang Hilang",
              value: "hilang",
            },
          ]}
          handleChange={(e) => handleSetIsChoose(e.target.value)}
          placeholder="Jenis"
          defaultValue="produk"
          customWidth="w-40"
        />
      </div>

      {isLoading ? (
        <div className="w-full h-full p-4">
          <div className="w-full h-full skeleton flex justify-center items-center">
            <span className="skeleton skeleton-text">
              Menampilkan grafik...
            </span>
          </div>
        </div>
      ) : (
        <BarChart
          margin={{
            top: 20,
            right: windowSize === "sm" ? 25 : 25,
            left: windowSize === "sm" ? -25 : -20,
            bottom: 15,
          }}
          responsive
          height="100%"
          width="100%"
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{
              fontSize: windowSize === "sm" ? 10 : 10,
              fontWeight: "500",
            }}
            interval={windowSize === "sm" ? 4 : 2}
          />
          <YAxis
            tickFormatter={(value) => formatNumberK(value)}
            tick={{
              fontSize: windowSize === "sm" ? 10 : 10,
              fontWeight: "500",
            }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const data = payload[0].payload;

              return (
                <div className="rounded-2xl border bg-base-100 p-4 shadow-xl w-30 border-base-content">
                  <p className="text-[0.7rem] font-medium text-base-content/80">
                    {data.date}
                  </p>
                  <p className="text-xs font-semibold text-base-content">
                    {formatNumber(data.value)}
                  </p>
                </div>
              );
            }}
          />
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
      )}
    </div>
  );
};

export default GrafikBatang;
