import { MenuItem } from "rei-design/menu/type";
import styles from "./index.module.scss";
import { ReiMenu } from "rei-design/menu";
import { useNavigate } from "react-router";

function DocsSidebar() {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const menuData: MenuItem[] = [
    {
      path: "/",
      id: "start",
      label: "开始",
    },
    {
      path: "attribute",
      id: "attribute",
      label: "特性",
      subItems: [
        {
          path: "about",
          label: "关于",
          id: "Team",
          onClick: handleClick,
        },
        {
          path: "",
          label: "Company",
          id: "Company",
        },
      ],
    },
    {
      path: "",
      id: "使用",
      label: "使用",
      subItems: [
        {
          path: "",
          label: "Web Development 3123123123123123123",
          id: "Web Development",
          subItems: [
            {
              path: "",
              label: "Web Development2",
              id: "Web Development",
            },
          ],
        },
        {
          path: "",
          label: "App Development",
          id: "App Development",
        },
        {
          path: "getting-start",
          id: "起步",
          label: "起步",
          onClick: handleClick,
        },
      ],
    },
    {
      path: "",
      id: "拓展能力",
      label: "拓展能力",
    },
  ];
  return (
    <div className={styles.container}>
      <ReiMenu menuItems={menuData} />
    </div>
  );
}

export default DocsSidebar;

//-----
