import type { FC } from "react";
import { highlightName } from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";

type Props = {
  nama: string;
  index?: number;
  xs?: boolean;
};

const avatarColors = [
  { bg: "bg-red-100", text: "text-red-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
];

const defaultColor = {
  bg: "bg-custom-primary",
  text: "text-custom-secondary",
};

const Avatar: FC<Props> = ({ index, nama, xs }) => {
  const color =
    index === undefined || index === null
      ? defaultColor
      : avatarColors[Math.abs(index) % avatarColors.length];

  return (
    <div className="avatar avatar-placeholder">
      <div className={cn("rounded-full", color.bg, xs ? "w-10" : "w-11")}>
        <span className={`text-base font-medium uppercase ${color.text}`}>
          {highlightName(nama)}
        </span>
      </div>
    </div>
  );
};

export default Avatar;
