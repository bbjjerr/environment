import "./Home.scss";
import HomeMiddle from "../compent/Home-middle";
import HomeLeft from "../compent/Hoem-left";
import { useState } from "react";
import HomeRight from "../compent/Home-right";

const Home = () => {
  const [getTheNewChat, setGetTheNewChat] = useState(null);
  const [isRightOpen, setIsRightOpen] = useState(false);

  const upDateMessage = (item) => {
    setGetTheNewChat(item);
  };

  const changeMiddle = () => {
    setIsRightOpen(!isRightOpen);
  };

  return (
    <div className="tpo1">
      <div className="left">
        <HomeLeft upDateMessage={upDateMessage} />
      </div>
      <div className="middle">
        <HomeMiddle getTheNewChat={getTheNewChat} changeMiddle={changeMiddle} />
      </div>
      <div className={`right ${isRightOpen ? "open" : ""}`}>
        <HomeRight getTheNewChat={getTheNewChat} />
      </div>
    </div>
  );
};

export default Home;
