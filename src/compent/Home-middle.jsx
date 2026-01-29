import { useSelector } from "react-redux";
const HomeMiddle = () => {
  const getTheNewChat = useSelector((state) => state.comment.list);
  console.log("获取到的聊天数据：", getTheNewChat.theContentOfTheChat);
  return <div className="middle-chat"></div>;
};

export default HomeMiddle;
