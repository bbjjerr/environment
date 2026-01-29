// src/router/index.jsx
import AuthRoute from "./AuthRoute";

import { createBrowserRouter } from "react-router-dom";
import Login from "../page/Login";
import Home from "../page/Home";

const router = createBrowserRouter([
  {
    path: "/",
    // 🌟 这里是重点！用 AuthRoute 把 Layout 包起来
    // 这样进入 / 及其所有子路由（二级路由）之前，都会先运行 AuthRoute 的逻辑
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />, // 登录页不需要保安，否则谁也进不去
  },
]);
export default router;
