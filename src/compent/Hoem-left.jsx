import "./Hoem-left.scss";
import moreIcon from "../img/更多.png";
import phone from "../img/电话.png";
import poeple from "../img/人员-01.png";
import chat from "../img/chat.png";
import more from "../img/3.1 设置.png";
import exit from "../img/退出.png";
import { useState } from "react";
import { addComment, cleatComment } from "../store/modules/commentStore";
import { useDispatch } from "react-redux";

const HomeLeft = () => {
  const dispatch = useDispatch();
  const Allpeople = [
    {
      id: 1,
      name: "Sarah Wilson",

      time: "10:30",
      url: "https://i.pravatar.cc/150?img=2",
      theContentOfTheChat: [
        {
          time: "9:20",
          message: "你好",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },
        {
          time: "9:21",
          message: "这是新的项目需求",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },
        {
          time: "9:30",
          message: "那你觉得呢",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },

        {
          time: "10:30",
          message:
            ",好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你好的我整理完尽快的发给你",
          sender: "Alex Chen",
          url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
        },
        {
          time: "10:33",
          message: "发给你了",
          sender: "Alex Chen",
          url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
        },
        {
          time: "10:36",
          message: "收到",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },
        {
          time: "10:36",
          message: "收到",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },
        {
          time: "10:36",
          message: "收到",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },
        {
          time: "10:36",
          message: "收到",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },
        {
          time: "10:36",
          message: "收到",
          sender: "Sarah Wilson",
          url: "https://i.pravatar.cc/150?img=2",
        },
      ],
    },
    {
      id: 2,
      name: "Jack season",
      time: "10:30",
      url: "https://i.pravatar.cc/150?img=4",
      theContentOfTheChat: [
        {
          time: "10:36",
          message: "你好",
          sender: "Alex Chen",
          url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop4",
        },
      ],
    },
    {
      id: 3,
      name: "Mary hash",
      time: "10:30",
      url: "https://i.pravatar.cc/150?img=8",
      theContentOfTheChat: [],
    },
  ];
  const [messagePeople, setMessagePeople] = useState(Allpeople);

  const handleChatClick = (item) => {
    dispatch(cleatComment());
    dispatch(addComment(item));
  };

  console.log(setMessagePeople);
  return (
    <>
      <div className="leftH">
        <div className="header">
          <div className="ImgURL">
            <img
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop"
              alt=""
            />
          </div>
          <p className="nameMessge">
            Alex Chen<span>在线</span>
          </p>
          <div className="CountImg">
            <img src={moreIcon} alt="" />
          </div>
        </div>
        <div className="searchInput">
          <input type="text" name="" placeholder="进行搜搜" id="" />
        </div>
        <ul className="ulLI">
          <li>
            <img src={phone} alt="" />
            <span>chats</span>
          </li>
          <li>
            <img src={poeple} alt="" />
            <span>chats</span>
          </li>
          <li>
            <img src={chat} alt="" />
            <span>chats</span>
          </li>
          <li>
            <img src={more} alt="" />
            <span>chats</span>
          </li>
        </ul>
        <div className="hint clearfix">
          <span className="hint-left">最近会话</span>
          <span className="hint-right">+</span>
        </div>

        <div className="chatinformation">
          {messagePeople.map((item) => (
            <div
              className="informationDetails"
              key={item.id}
              onClick={() => handleChatClick(item)}
            >
              <img src={item.url} alt="" />
              <p>
                {item.name}
                <span>
                  {/* 如果是空消息就不展示任何的信息 */}
                  {item.theContentOfTheChat?.length > 0
                    ? (item.theContentOfTheChat[
                        item.theContentOfTheChat.length - 1
                      ].sender === item.name
                        ? "他："
                        : "我：") +
                      (item.theContentOfTheChat[
                        item.theContentOfTheChat.length - 1
                      ].message || "")
                    : ""}
                </span>
              </p>
              <p className="time">{item.time}</p>
            </div>
          ))}
        </div>

        <div className="endExit">
          <img src={exit} alt="" />
          <p className="textMEssage">退出登入</p>
        </div>
      </div>
    </>
  );
};

export default HomeLeft;
