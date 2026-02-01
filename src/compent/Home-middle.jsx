import { useSelector, useDispatch } from "react-redux";
import "./Home-middle.scss";
import more from "../img/更多.png";
import { useMemo, useRef, useEffect, useState } from "react";
import send from "../img/_图片.png";
import emoji from "../img/表情.png";
import add from "../img/文件.png";
import { Watermark } from "antd";
import { sendMessage } from "../api/login";
import { addMessage } from "../store/modules/commentStore";

const HomeMiddle = ({ changeMiddle }) => {
  const currentConversation = useSelector(
    (state) => state.comment.currentConversation,
  );
  const messages = useSelector((state) => state.comment.messages);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  // 处理消息列表
  const MessageShadow = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    const userId = localStorage.getItem("userId");

    return messages
      .map((item, index) => {
        const senderIdStr =
          typeof item.senderId === "object"
            ? item.senderId?._id?.toString()
            : item.senderId?.toString();

        return {
          ...item,
          id: item._id || `msg-${index}`,
          message: item.body,
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString()
            : "",
          url: item.sender?.avatarUrl || "https://i.pravatar.cc/150",
          senderName: item.sender?.name || "Unknown",
          isMine: senderIdStr === userId,
        };
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [messages]);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [MessageShadow]);

  const inputRef = useRef(null);

  const handleInput = (e) => {
    setInputValue(e.target.value);
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;

    if (scrollHeight <= 50) {
      textarea.style.height = "50px";
      textarea.style.overflowY = "hidden";
    } else if (scrollHeight > 200) {
      textarea.style.height = "200px";
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    }
    scrollToBottom();
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentConversation) return;

    try {
      const res = await sendMessage(currentConversation._id, {
        body: inputValue,
      });
      console.log("发送消息成功:", res);

      // 添加到本地消息列表
      dispatch(addMessage(res));

      // 清空输入框
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.style.height = "50px";
      }
    } catch (e) {
      console.log("发送消息失败:", e);
    }
  };

  // 按 Enter 发送消息
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 获取聊天对象信息
  const chatPartner = currentConversation?.participants?.[0] || {};
  const chatName = currentConversation?.name || chatPartner.name || "未知用户";
  const chatAvatar = chatPartner.avatarUrl || "https://i.pravatar.cc/150";

  // 如果没有选中会话，显示占位内容
  if (!currentConversation) {
    return (
      <div className="title">
        <p>请选择一个聊天对象</p>
      </div>
    );
  }

  return (
    <div className="middle-chat">
      <div className="headerImg">
        <img className="ImgSie" src={chatAvatar} alt="" />
        <p className="textMessage">{chatName}</p>
        <img
          className="countMessage"
          onClick={changeMiddle}
          src={more}
          style={{ cursor: "pointer" }}
          alt=""
        />
      </div>

      <Watermark
        content={["公司内部聊天，禁止外传"]}
        gap={[50, 50]}
        className="watermark-container"
      >
        <div className="top2">
          {MessageShadow.length === 0 ? (
            <div className="empty-messages">
              <p>暂无消息，发送第一条消息开始聊天吧！</p>
            </div>
          ) : (
            MessageShadow.map((item) => (
              <div key={item.id} className="message">
                {item.isMine ? (
                  <div className="my">
                    <p className="myMessage">{item.message}</p>
                    <img className="myImg" src={item.url} alt="" />
                    <p className="time">{item.time}</p>
                  </div>
                ) : (
                  <div className="other">
                    <img className="otherImg" src={item.url} alt="" />
                    <div className="otherMessage">
                      <p>{item.message}</p>
                      <p className="time">{item.time}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </Watermark>

      <div className="bottom">
        <img src={emoji} alt="" />
        <img src={add} alt="" />
        <img src={send} alt="" />
        <div className="send">
          <textarea
            ref={inputRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="输入消息"
            className="sendInput"
            style={{
              minHeight: "50px",
              maxHeight: "500px",
              resize: "none",
              transition: "height 0.1s ease",
            }}
          />
          <button
            className="sendButton"
            onClick={handleSendMessage}
            style={{
              padding: "8px 16px",
              background: "#4f45e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeMiddle;
