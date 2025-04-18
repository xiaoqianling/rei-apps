import React from "react";
// import { makeStyles, Theme } from "@material-ui/core/styles";
// import { Slider } from "antd";
// import {
//   StepBackwardOutlined,
//   CaretLeftOutlined,
//   CaretRightOutlined,
//   StepForwardOutlined,
//   RedoOutlined,
//   PlayCircleFilled,
//   PauseOutlined,
// } from "@ant-design/icons";
import { C } from "../util";

type Props = {
  status: "stop" | "play" | "finish";
  speed: number;
  light?: boolean;
  className?: string;
  onPlay?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onChangeSpeed?: (speed: number) => void;
  onNext?: () => void;
};

const ControlTrack = (props: Props) => {
  const { className, speed, status, light = false } = props;
  // const classes = useStyles({ light });

  return (
    <div className={C(className)}>
      <div>
        <span>Speed</span>
        <div>
          {/* <Slider
            defaultValue={speed || 400}
            step={100}
            min={100}
            max={700}
            onChange={props.onChangeSpeed}
          /> */}
          <span>Slider</span>
        </div>
      </div>
      <div>
        {/* <StepBackwardOutlined className={classes.icon} /> */}
        <span>后退</span>
        {/* <CaretLeftOutlined className={classes.icon} /> */}
        <span>CaretLeftOutlined</span>
        {status === "stop" && (
          // <PlayCircleFilled className={classes.icon} onClick={props.onPlay} />
          <span>播放</span>
        )}
        {status === "play" && (
          // <PauseOutlined className={classes.icon} onClick={props.onStop} />
          <span>暂停</span>
        )}
        {status === "finish" && (
          // <RedoOutlined className={classes.icon} onClick={props.onRestart} />
          <span>重新播放</span>
        )}
        {/* <CaretRightOutlined className={classes.icon} onClick={props.onNext}/> */}
        <span>创建</span>
        {/* <StepForwardOutlined className={classes.icon} /> */}
        <span>前进</span>
      </div>
    </div>
  );
};

export default ControlTrack;

// const useStyles = makeStyles<Theme, { light: boolean }>({
//   controlTrack: {
//     height: 60,
//     backgroundColor: ({ light }) => (light ? "tranparent" : "#2c303a"),
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "5px",
//   },
//   speedContainer: {
//     display: "flex",
//     alignItems: "center",
//     width: "50%",
//     color: "white",
//     fontSize: "18px",
//     marginLeft: "15px",
//   },
//   speedSlider: {
//     width: "70%",
//     marginLeft: "10px",
//   },
//   speedTitle: {
//     color: ({ light }) => (light ? "#aeb4b7" : "white"),
//   },
//   icon: {
//     color: ({ light }) => (light ? "#3f51b5" : "white"),
//     fontSize: "27px",
//     marginRight: "20px",
//     "&:hover": {
//       cursor: "pointer",
//     },
//   },
//   iconGroup: {
//     marginRight: "60px",
//   },
// });
