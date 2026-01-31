import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import axios from "axios";
import { login, register } from "../api/login";
const Login = () => {
  const navigate = useNavigate();
  //用来获取邮箱的验证
  const BASE_URL = "https://api.bbjjerr.cloud/";
  const handleGetCode = async () => {
    if (!formData.email) {
      setError("请先输入邮箱");
      return;
    }

    try {
      const res = await axios.post(BASE_URL, {
        action: "send",
        email: formData.email,
      });
      console.log("验证码请求响应:", res.data);

      // 检查服务器返回的结果
      if (res.data?.success) {
        alert(res.data.msg || "验证码已发送");
      } else {
        // 显示服务器返回的错误信息（包括 60 秒等待提示）
        setError(res.data?.msg || "验证码发送失败");
      }
    } catch (error) {
      console.error("验证码发送失败:", error);
      setError("验证码发送失败，请重试");
    }
  };
  const [code, setCode] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // 清除错误信息
  };
  // 校验验证码

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. 基础表单验证
    if (!code) {
      setError("请输入验证码");
      return;
    }
    if (!formData.email || !formData.password) {
      setError("请填写所有必填字段");
      return;
    }
    if (!isLogin && !formData.username) {
      setError("请填写用户名");
      return;
    }
    if (!isLogin && formData.password.length < 6) {
      setError("密码长度至少为6位");
      return;
    }

    setIsLoading(true);

    try {
      // 2. 第一步：验证码校验
      console.log("开始验证码校验...", { email: formData.email, code });
      const verifyRes = await axios.post(BASE_URL, {
        action: "verify",
        email: formData.email,
        code: code,
      });
      console.log("验证码校验响应:", verifyRes.data);

      // 检查验证码是否正确
      if (!verifyRes.data?.success) {
        setError(verifyRes.data?.msg || "验证码错误");
        setIsLoading(false);
        return; // 验证码错误，直接返回，不执行后续登录/注册
      }

      console.log("✅ 验证码校验通过，开始执行登录/注册...");

      // 3. 第二步：验证码通过后执行登录或注册
      const { username, email, password } = formData;

      if (isLogin) {
        // 登录
        console.log("执行登录请求...", { email });
        const res = await login({ email, password });
        console.log("登录响应:", res);

        const token = res?.token;
        if (token) {
          localStorage.setItem("token_key", token);
          console.log("✅ Token 已保存，准备跳转...");
          navigate("/");
        } else {
          setError("登录失败：服务器未返回有效凭证");
        }
      } else {
        // 注册
        console.log("执行注册请求...", { name: username, email });
        await register({ name: username, email, password });
        console.log("✅ 注册成功");
        setIsLogin(true);
        setFormData({ username: "", email: "", password: "" });
        setCode("");
        alert("注册成功，请登录");
      }
    } catch (error) {
      console.error("❌ 操作失败:", error);
      console.log("错误响应数据:", error.response?.data);

      // 优先使用后端返回的错误信息
      let msg = "请求失败，请重试";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.response?.data?.msg) {
        msg = error.response.data.msg;
      } else if (error.response?.status === 401) {
        msg = "邮箱或密码错误";
      } else if (error.response?.status === 409) {
        msg = "该邮箱已被注册";
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="login-container">
      {/* 左侧装饰区域 */}
      <div className="login-left">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
        <div className="welcome-content">
          <h1>欢迎回来</h1>
          <p>与朋友和家人保持联系，随时随地畅聊</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>即时消息</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>安全加密</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <span>跨平台同步</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="logo">
            <span className="logo-icon">💬</span>
            <span className="logo-text">Chat</span>
          </div>

          <h2>{isLogin ? "登录账户" : "创建账户"}</h2>
          <p className="subtitle">
            {isLogin ? "请输入您的登录信息" : "填写以下信息完成注册"}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="请输入邮箱地址"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/*在这里获取验证码 */}
            <div className="form-group">
              <label htmlFor="code">验证码</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <input
                  type="text"
                  id="code"
                  name="code"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <button className="get-code" onClick={handleGetCode} style={{}}>
                  获取验证码
                </button>
              </div>
            </div>
            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>记住我</span>
                </label>
                <a href="#" className="forgot-password">
                  忘记密码?
                </a>
              </div>
            )}
            <button
              type="submit"
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : isLogin ? (
                "登录"
              ) : (
                "注册"
              )}
            </button>
          </form>

          <div className="divider">
            <span>或</span>
          </div>

          <div className="social-login">
            <button className="social-btn wechat">
              <span>微信登录</span>
            </button>
            <button className="social-btn qq">
              <span>QQ登录</span>
            </button>
          </div>

          <p className="toggle-mode">
            {isLogin ? "还没有账户? " : "已有账户? "}
            <button type="button" onClick={toggleMode}>
              {isLogin ? "立即注册" : "立即登录"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
