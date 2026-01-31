import "./Home-right.scss";
import { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import notmessage from "../img/铃铛.png";
import createGroup from "../img/添加人员.png";
import { Switch } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
const HomeRight = () => {
  const chatList = useSelector((state) => state.comment.list);
  const newPerson = useMemo(() => {
    if (!chatList) return [];
    return chatList;
  }, [chatList]);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <>
      <div className="rightMessage">
        <div className="top">
          <p>详细信息</p>
        </div>
        <div className="middle-img">
          <img src={newPerson.url} alt="" />
          <p>{newPerson.name}</p>
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
