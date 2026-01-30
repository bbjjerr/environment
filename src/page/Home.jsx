import "./Home.scss";
import HomeMiddle from "../compent/Home-middle";
import HomeLeft from "../compent/Hoem-left";
import { useState } from "react";
import { useRef } from "react";
const Home = () => {
  const [getTheNewChat, setGetTheNewChat] = useState(null);
  const [isRightOpen, setIsRightOpen] = useState(false); // 用状态来跟踪
  const upDateMessage = (item) => {
    setGetTheNewChat(item);
  };
  const middleRef = useRef(null);
  const rightRef = useRef(null);

  const changeMiddle = () => {
    if (middleRef.current && rightRef.current) {
      const dom = middleRef.current;
      const rightDom = rightRef.current;

      dom.style.transition = "all 0.3s ease";
      rightDom.style.transition = "all 0.3s ease";

      if (isRightOpen) {
        // 关闭右侧栏
        dom.style.width = "calc(100% - 400px)";
        rightDom.style.right = "-300px";
      } else {
        // 打开右侧栏
        dom.style.width = "calc(100% - 400px - 300px)";
        rightDom.style.right = "0px";
      }

      setIsRightOpen(!isRightOpen); // 切换状态
    }
  };

  return (
    <div className="tpo1">
      <div className="left">
        <HomeLeft upDateMessage={upDateMessage} />
      </div>
      <div className="middle" ref={middleRef}>
        <HomeMiddle getTheNewChat={getTheNewChat} changeMiddle={changeMiddle} />
      </div>
      <div className="right" ref={rightRef}></div>
    </div>
  );
};
export default Home;
