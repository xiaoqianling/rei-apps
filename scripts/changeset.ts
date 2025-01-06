import { exec } from "node:child_process";
import Readline from "node:readline";

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
const history: string[] = [];
console.log("Rei 自动生成changeset");

child.stdout?.on("data", (data: string) => {
  history.push(data);
  // console.log(data.toString());
  if (data.includes("Which packages would you like to include?")) {
    // console.log("请输入需要发布的包", rl.terminal);
    rl.write("changed packages");
  } else {
    // console.log(data.toString());
  }
});

child.on("exit", (code) => {
  console.log(`子进程退出，退出码 ${code}`);
  console.log(history.join(""));
});

// 监听子进程的错误输出
child.stderr?.on("data", (data) => {
  console.error(data.toString());
});

// process.exit(0);
