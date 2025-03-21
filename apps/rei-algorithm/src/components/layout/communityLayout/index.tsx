import { FC } from "react";
import { Outlet } from "react-router";

const CommunityLayout: FC = () => {
  return (
    <div>
      <h1>CommunityLayout</h1>
      <Outlet />
    </div>
  );
};

export default CommunityLayout;
