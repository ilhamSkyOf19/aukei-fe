import { type FC } from "react";
import { Helmet } from "react-helmet";

// props
type Props = {
  title: string;
};
const HeaderPage: FC<Props> = ({ title }: Props) => {
  return (
    <Helmet>
      <title>{title}</title>
      {/* <link rel="icon" href="/logos/FIKOM-1024x1017.png" /> */}
    </Helmet>
  );
};

export default HeaderPage;
