const { app, BrowserWindow } = require("electron");
const path = require("path");

// 开发环境 URL
const DEV_URL = "http://localhost:5173";

// 最小窗口尺寸
const MIN_WIDTH = 1200;
const MIN_HEIGHT = 700;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // 窗口样式
    titleBarStyle: "hiddenInset", // macOS 隐藏标题栏但保留交通灯按钮
    frame: true,
    resizable: true,
    show: false, // 先隐藏，等加载完成后显示
  });

  // 加载应用
  if (process.env.NODE_ENV === "development" || !app.isPackaged) {
    mainWindow.loadURL(DEV_URL);
    // 开发模式下打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  }

  // 窗口准备好后显示
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // 处理窗口关闭
  mainWindow.on("closed", () => {
    app.quit();
  });
}

// Electron 准备就绪时创建窗口
app.whenReady().then(() => {
  createWindow();

  // macOS 点击 dock 图标时重新创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（Windows/Linux）
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
