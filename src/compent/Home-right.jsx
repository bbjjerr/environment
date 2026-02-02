import "./Home-right.scss";
import { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import notmessage from "../img/铃铛.png";
import createGroup from "../img/添加人员.png";
import { Switch } from "antd";
import {
  PlusCircleOutlined,
  FileOutlined,
  PictureOutlined,
} from "@ant-design/icons";
const HomeRight = () => {
  const chatList = useSelector((state) => state.comment.currentConversation);

  const newPerson = useMemo(() => {
    // 如果 chatList 不存在，或者 participants 不存在/不是数组，返回空
    return chatList?.participants || [];
  }, [chatList]);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  // 这里的判断改为：如果数组长度为 0，说明还没拿到人，显示加载或提示
  if (newPerson.length === 0) {
    return <div className="rightMessage">请选择一个会话...</div>;
  }
  return (
    <>
      <div className="rightMessage">
        <div className="top">
          <p>详细信息</p>
        </div>
        <div className="middle-img">
          <img src={newPerson?.[0]?.avatarUrl} />
          <p>{newPerson?.[0]?.name}</p>
          <p>{newPerson?.[0]?.email}</p>
        </div>
        <div className="setting-per">
          <p className="p1">设置</p>
          <div className="notmessage">
            <img src={notmessage} alt="" />
            <p>消息免打扰</p>
            <Switch className="switch" defaultChecked onChange={onChange} />
          </div>
          <div className="createGroup">
            <img src={createGroup} alt="" />
            <p>创建群组</p>

            <PlusCircleOutlined className="switch" />
          </div>
        </div>
        <div className="setting">
          <p>媒体文件</p>
          <div className="settingUse">
            <div className="settingItem">
              <FileOutlined className="settingIcon" />
              <span>查看文件</span>
            </div>
            <div className="settingItem">
              <PictureOutlined className="settingIcon" />
              <span>查看图片</span>
            </div>
          </div>
        </div>
        <div className="settingDangerous">
          <p>隐私操作</p>
          <div className="dangerousUse">
            <p>屏蔽联系人</p>
            <p>删除联系人</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomeRight;
