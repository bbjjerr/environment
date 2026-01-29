import "./Home.scss";
import HomeMiddle from "../compent/Home-middle";
import HomeLeft from "../compent/Hoem-left";
import { useState } from "react";
const Home = () => {
  const [getTheNewChat, setGetTheNewChat] = useState(null);
  const upDateMessage = (item) => {
    setGetTheNewChat(item);
  };

  return (
    <div className="tpo1">
      <div className="left">
        <HomeLeft upDateMessage={upDateMessage} />
      </div>
      <div className="middle">
        <HomeMiddle getTheNewChat={getTheNewChat} />
      </div>
      <div className="right"></div>
    </div>
  );
};
export default Home;
