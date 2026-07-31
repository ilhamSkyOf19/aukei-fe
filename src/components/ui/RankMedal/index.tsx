import type { SVGProps } from "react";
import { getRankColor } from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";

interface RankMedalProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  rank: number;
  className?: string;
}

export function RankMedal({ rank, className = "", ...props }: RankMedalProps) {
  const colorClass = getRankColor(rank);

  return (
    <svg
      viewBox="0 0 512.02 512.02"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(colorClass, className)}
      {...props}
      width={25}
    >
      {/* Medal circle */}
      <path
        className="fill-current"
        d="M255.797,384c105.877,0,192-86.144,192-192s-86.123-192-192-192s-192,86.144-192,192S149.919,384,255.797,384z"
      />
      {/* Ribbon */}
      <path
        className="fill-current"
        d="M446.154,495.019l-47.531-126.72c-1.173-3.115-3.755-5.525-6.955-6.485c-3.136-0.939-6.677-0.341-9.344,1.664
        c-35.968,26.581-78.571,40.981-123.179,41.685c-0.704,0-1.323,0.363-1.984,0.512c-0.491-0.064-0.896-0.341-1.365-0.341
        c-45.739,0-89.451-14.485-126.528-41.856c-2.688-2.005-6.208-2.603-9.344-1.664c-3.2,0.939-5.781,3.349-6.955,6.485
        l-48.469,129.28c-1.536,4.117-0.427,8.747,2.837,11.669c2.005,1.813,4.544,2.752,7.125,2.752c1.621,0,3.243-0.363,4.779-1.131
        l79.787-39.893l58.859,39.232c2.688,1.792,6.101,2.24,9.195,1.28c3.115-1.003,5.589-3.371,6.699-6.4l23.296-62.144l20.587,61.781
        c1.067,3.157,3.52,5.632,6.677,6.72c3.136,1.067,6.613,0.64,9.365-1.216l58.859-39.232l79.787,39.893
        c1.536,0.747,3.157,1.109,4.779,1.109c0.171,0.021,0.32,0,0.427,0c5.888,0,10.667-4.779,10.667-10.667
        C448.223,498.965,447.455,496.789,446.154,495.019z"
      />
      {/* Rank number, centered in the medal circle */}
      <text
        x="255.797"
        y="192"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="180"
        fontWeight="700"
        fontFamily="sans-serif"
        fill="#ffffff"
      >
        {rank}
      </text>
    </svg>
  );
}

export default RankMedal;
