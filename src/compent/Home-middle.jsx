import { useSelector } from "react-redux";
import "./Home-middle.scss";
import more from "../img/更多.png";
import { useMemo, useRef, useEffect } from "react";

import send from "../img/_图片.png";
import emoji from "../img/表情.png";
import add from "../img/文件.png";
import { Watermark } from "antd";

const HomeMiddle = ({ changeMiddle }) => {
  const chatList = useSelector((state) => state.comment.list);
  const messagesEndRef = useRef(null);

  const MessageShadow = useMemo(() => {
    if (!chatList?.theContentOfTheChat) return [];
    const newCount = chatList.theContentOfTheChat
      .map((item, index) => ({
        ...item,
        id: `msg-${index}-${item.time}`, // 组合 key 更稳健
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));
    console.log(newCount);
    return newCount;
  }, [chatList]);

  // 核心逻辑：监听消息数组，变化时滚动到底部
  const scrollToBottom = () => {
    //立刻滚动到底部
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [MessageShadow]);

  const inputRef = useRef(null);

  const handleInput = () => {
    const textarea = inputRef.current;
    if (!textarea) return;

    // 1. 重置高度，确保在内容减少时高度能缩回
    textarea.style.height = "auto";

    // 2. 获取内容的实际高度
    const scrollHeight = textarea.scrollHeight;

    // 3. 设置高度逻辑
    // 如果内容高度小于 50，保持 50；如果大于 100，固定在 100（溢出自动出滑轮）
    if (scrollHeight <= 50) {
      textarea.style.height = "50px";
      textarea.style.overflowY = "hidden";
    } else if (scrollHeight > 200) {
      textarea.style.height = "200px";
      textarea.style.overflowY = "auto"; // 超过 100px 出现滑轮
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    }

    // 4. 输入框高度变化时，保持聊天区域滚动到底部
    scrollToBottom();
  };

  // 如果没有数据，显示占位内容
  if (!chatList || chatList.length === 0) {
    return (
      // 设置文字提示，这里空荡荡的dang 表示“正在加载”
      <div className="title">
        <p>dang... 请选择一个聊天对象</p>
      </div>
    );
  }

  //

  return (
    <div className="middle-chat">
      <div className="headerImg">
        <img className="ImgSie" src={chatList.url} alt="" />
        <p className="textMessage">{chatList.name}</p>
        <img
          className="countMessage"
          onClick={changeMiddle}
          src={more}
          style={{ cursor: "pointer" }}
          alt=""
        />
      </div>

      <div className="top2">
        <Watermark content={["公司内部聊天，禁止外传"]} gap={[50, 50]}>
          {MessageShadow.map((item) => (
            <div key={item.id} className="message">
              {item.sender == "Alex Chen" ? (
                <>
                  <div className="my">
                    <p className="myMessage">{item.message}</p>
                    <img className="myImg" src={item.url} alt="" />
                    <p className="time">{item.time}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="other">
                    <img className="otherImg" src={item.url} alt="" />
                    <div className="otherMessage">
                      <p>{item.message}</p>
                      <p className="time">{item.time}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Watermark>
      </div>

      <div className="bottom">
        {/* <input type="text" placeholder="输入消息" ><img src={send} alt="" /></input> */}
        <img src={emoji} alt="" />
        <img src={add} alt="" />
        <img src={send} alt="" />
        <div className="send">
          <textarea
            ref={inputRef}
            onInput={handleInput}
            placeholder="输入消息"
            className="sendInput"
            style={{
              minHeight: "50px",
              maxHeight: "500px",
              resize: "none", // 禁止手动拉伸

              transition: "height 0.1s ease", // 平滑过渡
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeMiddle;
