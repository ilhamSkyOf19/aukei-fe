import { type FC } from "react";

type Props = {
  title: string;
  keterangan: string;
};
const TitleModalFormulir: FC<Props> = ({ keterangan, title }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      <h1 className="text-base-content font-semibold text-base lg:text-lg">
        {title}
      </h1>

      <p className="text-xs font-medium text-base-content/50">{keterangan}</p>
    </div>
  );
};

export default TitleModalFormulir;
