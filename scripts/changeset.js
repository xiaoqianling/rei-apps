const { exec } = require("child_process");
const { log } = require("console");
const fs = require("fs");
const Readline = require("readline");

const child = exec("npx changeset add", (error, stdout, stderr) => {
  if (error) {
    console.error(`生成changeset失败 exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`生成changeset失败 stderr: ${stderr}`);
    return;
  }
  console.log(`生成changeset成功 stdout: ${stdout}`);
});

const rl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Rei 自动生成changeset");

child.stdout.on("data", (data) => {
  fs.writeFile("changeset.log", data.toString());
  //   console.log(data.toString());
});

// 监听子进程的错误输出
child.stderr.on("data", (data) => {
  console.error(data.toString());
});

// process.exit(0);
