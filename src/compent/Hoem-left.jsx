import "./Hoem-left.scss";
import moreIcon from "../img/更多.png";
import phone from "../img/电话.png";
import poeple from "../img/人员-01.png";
import chat from "../img/chat.png";
import more from "../img/3.1 设置.png";
import exit from "../img/退出.png";
import { useState, useEffect, useMemo } from "react";
import { setCurrentChat, addMessage } from "../store/modules/commentStore";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  createConversation,
  getConversationList,
  searchUser,
  getConversationDetail,
  resetUnread,
  getConversationMessages,
} from "../api/login";
import { connectSocket, onNewMessage, offNewMessage } from "../api/socket";
import { SmileOutlined } from "@ant-design/icons";
import { notification } from "antd";

const HomeLeft = () => {
  //利用Allpeople，来存储会话列表，存储的是左侧的会话列表
  const [Allpeople, setAllpeople] = useState([]);

  useEffect(() => {
    getConversationList().then((res) => {
      setAllpeople(res.data || []);
      console.log("开始查找缓存的聊天数据", res.data);
    });
  }, []);

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const handleSearch = async () => {
    if (searchValue.length < 0) {
      alert("请输入搜索内容");
      return;
    }
    try {
      const res = await searchUser({
        search: searchValue,
        page: 1,
        limit: 10,
      });
      console.log(res);
      setSearchResult(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const searchResultFunction = useMemo(() => {
    return searchResult;
  }, [searchResult]);
  // 使用 useState 控制弹窗显示/隐藏
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const closeSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  //创建新的聊天
  const creatNewChat = async (item) => {
    try {
      const res = await createConversation({
        participantIds: [item._id],
        type: "direct",
      });
      alert("创建成功");
      setIsSearchOpen(false); // 自动关闭搜索弹窗
      await updateConversationList(); // 重新拉取最新的会话列表
    } catch (e) {
      console.log(e);
    }
  };
  //更新回话列表
  const updateConversationList = async () => {
    try {
      const res = await getConversationList();
      setAllpeople(res.data || []);
    } catch (e) {
      console.log("更新列表失败:", e);
    }
  };

  const [userInfo, setUserInfo] = useState({}); //后端链接获取用户信息，
  const dispatch = useDispatch();

  // 监听会话列表刷新信号（当自己发送消息后触发）
  const conversationListVersion = useSelector(
    (state) => state.comment.conversationListVersion,
  );

  // 当刷新版本变化时，重新获取会话列表
  useEffect(() => {
    if (conversationListVersion > 0) {
      updateConversationList();
    }
  }, [conversationListVersion]);

  // 消息通知
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message) => {
    api.open({
      message: `${message.sender?.name || "新消息"}`,
      description: message.body,
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  useEffect(() => {
    getCurrentUser().then((res) => {
      setUserInfo(res);

      localStorage.setItem("userId", res._id);

      // 连接 Socket
      connectSocket(res._id);

      // 监听新消息
      onNewMessage((message) => {
        console.log("收到新消息:", message);
        openNotification(message);
        dispatch(addMessage(message));
        updateConversationList();
      });
    });

    return () => {
      offNewMessage();
    };
  }, []);
  //在这里获取用户的身份信息-end

  const [messagePeople, setMessagePeople] = useState(Allpeople);

  // 点击会话，加载历史消息------------------------------------------------------------------------
  const handleChatClick = async (item) => {
    console.log("点击会话:", item.name || item.participants[0]?.name);
    try {
      const res = await getConversationMessages(item._id, {
        page: 1,
        limit: 50,
      });
      console.log("获取消息:", res);
      resetUnread(item._id);
      // 立即更新本地的 unreadCount 为 0，这样 UI 会立刻消失
      setAllpeople((prev) =>
        prev.map((conv) =>
          conv._id === item._id ? { ...conv, unreadCount: 0 } : conv,
        ),
      );

      dispatch(
        setCurrentChat({
          conversation: item,
          messages: res.data || [],
        }),
      );
      return res.data || [];
    } catch (e) {
      console.log("获取消息失败:", e);
      // 即使没有消息也设置当前会话
      dispatch(
        setCurrentChat({
          conversation: item,
          messages: [],
        }),
      );
    }
  };

  return (
    <>
      {contextHolder}
      {/* 搜索弹窗 - 根据 isSearchOpen 状态显示/隐藏 */}
      {isSearchOpen && (
        <div className="searchForPopUps">
          <div className="searchBox" onClick={(e) => e.stopPropagation()}>
            <p className="close" onClick={closeSearch}>
              X
            </p>
            <div style={{ position: "relative", marginTop: "30px" }}>
              <input
                className="searchInput"
                type="text"
                placeholder="搜索用户"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className="searchButton" onClick={handleSearch}>
                查找
              </button>
            </div>
            <div className="searchResult">
              {searchResultFunction.map((item) => (
                <div className="searchResultItem" key={item._id}>
                  <p>{item.name}</p>
                  <p>{item.email}</p>
                  <p
                    className={`status ${item.status === "online" ? "online" : "offline"}`}
                  >
                    {item.status === "online" ? "在线" : "离线"}
                  </p>
                  <p className="addChat" onClick={() => creatNewChat(item)}>
                    添加到聊天
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="leftH">
        <div className="header">
          <div className="ImgURL">
            <img
              src={
                userInfo.avatar ? userInfo.avatar : "https://i.pravatar.cc/150"
              }
            />
          </div>
          <p className="nameMessge">
            {userInfo.name}
            <span>{userInfo.status === "online" ? "在线" : "离线"}</span>
          </p>
          <div className="CountImg">
            <img src={moreIcon} alt="" />
          </div>
        </div>
        <div className="searchInput">
          <input
            style={{
              boxShadow: "0 0 4px 4px #ccc",
            }}
            type="text"
            name=""
            placeholder="搜索点什么吧"
            id=""
          />
        </div>
        <ul className="ulLI">
          <li>
            <img src={phone} alt="" />
            <span style={{ fontSize: "16px" }}>电话</span>
          </li>
          <li className="people" onClick={closeSearch}>
            <img src={poeple} alt="" />
            <span style={{ fontSize: "16px" }}>人员</span>
          </li>
          <li>
            <img src={chat} alt="" />
            <span style={{ fontSize: "16px" }}>聊天</span>
          </li>
          <li>
            <img src={more} alt="" />
            <span style={{ fontSize: "16px" }}>设置</span>
          </li>
        </ul>
        <div className="hint clearfix">
          <span className="hint-left">最近会话</span>
          <span className="hint-right">+</span>
        </div>
        <div className="chatinformation">
          {Allpeople.map((item) => {
            const otherParticipant = item.participants[0];
            const isOnline = otherParticipant?.status === "online";
            // 截断消息长度（超过20个字符就截断）
            console.log("item", item);
            const lastMessageText =
              item.lastMessage?.senderId === userInfo._id
                ? `我：${item.lastMessage?.body}`
                : `他：${item.lastMessage?.body}`;
            const truncatedMessage =
              lastMessageText.length > 20
                ? lastMessageText.substring(0, 20) + "..."
                : lastMessageText;
            const unreadCount = item.unreadCount;
            console.log("unreadCount", unreadCount);

            return (
              <div
                className="informationDetails"
                key={item._id}
                onClick={() => handleChatClick(item)} //点击会话，加载历史消息
              >
                {/* 头像容器，带在线状态指示器 */}
                <div className="avatarWrapper">
                  <img
                    src={otherParticipant?.avatarUrl || "default_vatar.png"}
                    alt=""
                  />
                  {unreadCount > 0 && (
                    <span className="unreadCount">{unreadCount}</span>
                  )}
                  <span
                    className={`onlineIndicator ${isOnline ? "online" : "offline"}`}
                  ></span>
                </div>
                <div className="messageContent">
                  <p className="userName">
                    {item.name || otherParticipant?.name}
                  </p>
                  <p className="lastMessage">{truncatedMessage}</p>
                </div>
                <p className="time">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleTimeString()
                    : ""}
                </p>
              </div>
            );
          })}
        </div>

        <div className="endExit">
          <img src={exit} alt="" />
          <p
            onClick={() => {
              localStorage.removeItem("token_key");
              window.location.href = "/login";
            }}
            className="textMEssage"
          >
            退出登入
          </p>
        </div>
      </div>
    </>
  );
};

export default HomeLeft;
