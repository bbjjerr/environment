import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { login, register } from "../api/login";
const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 表单验证
    if (!formData.email || !formData.password) {
      setError("请填写所有必填字段");
      return;
    }

    if (!isLogin) {
      if (!formData.username) {
        setError("请填写用户名");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("两次输入的密码不一致");
        return;
      }
      if (formData.password.length < 6) {
        setError("密码长度至少为6位");
        return;
      }
    }

    setIsLoading(true);
    const { username, email, password } = formData;

    try {
      if (isLogin) {
        // 登录
        const res = await login({ email, password });
        console.log("登录成功:", res);
        // 保存 token
        if (res.token) {
          localStorage.setItem("token_key", res.token);
        }
        navigate("/");
      } else {
        // 注册
        const res = await register({ name: username, email, password });
        console.log("注册成功:", res);
        // 注册成功后切换到登录
        setIsLogin(true);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        alert("注册成功，请登录");
      }
    } catch (error) {
      console.error("请求失败:", error);
      setError(error.response?.data?.message || "请求失败，请重试");
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

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">确认密码</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            )}

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
