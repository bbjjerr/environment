const path = require("path");
const fs = require("fs");
const multer = require("multer");
const createError = require("http-errors");
const asyncHandler = require("../utils/asyncHandler");
const MediaAsset = require("../models/MediaAsset");

// 确保上传目录存在
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 配置
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (_req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(createError(400, "不支持的文件类型"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * 上传文件
 * POST /uploads
 */
const uploadFile = [
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw createError(400, "请选择要上传的文件");
    }

    const { conversationId } = req.body;

    // 判断文件类型
    let type = "file";
    if (req.file.mimetype.startsWith("image/")) {
      type = "image";
    }

    // 创建媒体资产记录
    const asset = await MediaAsset.create({
      uploaderId: req.userId,
      conversationId: conversationId || null,
      type,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      meta: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      },
    });

    res.status(201).json({
      assetId: asset._id,
      url: asset.url,
      type: asset.type,
      size: asset.size,
    });
  }),
];

/**
 * 获取会话媒体列表
 * GET /conversations/:conversationId/media
 */
const getConversationMedia = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { type, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { conversationId };
  if (type) {
    query.type = type;
  }

  const [assets, counts] = await Promise.all([
    MediaAsset.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    MediaAsset.aggregate([
      {
        $match: {
          conversationId: require("mongoose").Types.ObjectId(conversationId),
        },
      },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = { image: 0, file: 0, link: 0 };
  counts.forEach((c) => {
    countMap[c._id] = c.count;
  });

  res.json({
    data: assets.map((a) => ({
      assetId: a._id,
      type: a.type,
      url: a.url,
      createdAt: a.createdAt,
    })),
    counts: countMap,
  });
});

/**
 * 下载文件
 * GET /media/:assetId/download
 */
const downloadFile = asyncHandler(async (req, res) => {
  const asset = await MediaAsset.findById(req.params.assetId);

  if (!asset) {
    throw createError(404, "文件不存在");
  }

  const filePath = path.join(__dirname, "../..", asset.url);

  if (!fs.existsSync(filePath)) {
    throw createError(404, "文件不存在");
  }

  const fileName = asset.meta?.originalName || path.basename(asset.url);
  res.download(filePath, fileName);
});

module.exports = {
  uploadFile,
  getConversationMedia,
  downloadFile,
};
