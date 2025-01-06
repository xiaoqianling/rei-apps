const fs = require("fs");
const path = require("path");

// 获取提交信息文件路径 argv第二个参数`一定`是git提交文件的消息路径 文件内容就是-m引号的内容
const commitMsgFile = process.argv[2];

// 读取提交信息
const commitMsg = fs.readFileSync(commitMsgFile, "utf-8").trim();

// 在这里添加您需要的逻辑
console.log("执行 commit-msg 钩子，提交信息为：", commitMsg);

// 例如，您可以检查提交信息是否符合某些规则
if (!commitMsg.includes("fix")) {
  console.error('提交信息不符合规则，请包含 "fix"。');
  process.exit(1);
}
