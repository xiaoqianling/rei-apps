import { useNavigate } from "react-router";
import "./index.scss";

function ReiLOGO() {
  const navigate = useNavigate();

  const handleClick = () => {
    // 使用 navigate 函数来跳转到指定的路由
    navigate("/");
  };

  return (
    <div className="rei-logo" onClick={handleClick}>
      Rei.ALGO platform
    </div>
  );
}

export default ReiLOGO;
