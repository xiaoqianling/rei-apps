import fs from "fs";
import { execSync } from "child_process";
import path from "path";

export function getCommitMsg(): string {
  // 获取最近一次提交的信息
  return execSync("git log -1 --pretty=%B").toString().trim();
}

// 获取受影响的包（假设你使用 pnpm）
const getChangedPackages = (): string[] => {
  const result = execSync(
    'pnpm recursive ls --depth 1 --filter "modified"',
  ).toString();
  return result
    .split("\n")
    .map((line) => line.split(" ")[0].replace(/^.*\//, "")) // 获取包名
    .filter(Boolean);
};

// 创建 Changeset 文件的命名
const createChangesetFilename = (commitMessage: string): string => {
  const currentDate = new Date().toISOString().split("T")[0]; // 获取当前日期，格式为 YYYY-MM-DD
  return `${currentDate}.md`;
};

// 写入 Changeset 文件
const createChangesetFile = (
  changedPackages: string[],
  commitMessage: string,
): void => {
  const changesetFilename = createChangesetFilename(commitMessage);
  const changesetPath = path.join(".changeset", changesetFilename);

  const changesetContent = [
    "---",
    ...changedPackages.map((pkg) => `"${pkg}": patch`),
    "---",
    "",
    commitMessage,
  ].join("\n");

  // 确保 .changeset 目录存在
  if (!fs.existsSync(".changeset")) {
    fs.mkdirSync(".changeset");
  }

  fs.writeFileSync(changesetPath, changesetContent);
  console.log(`Changeset file created: ${changesetPath}`);
};

// 主逻辑
const main = () => {
  try {
    const commitMessage = getCommitMsg();
    const changedPackages = getChangedPackages();
    console.log(commitMessage, changedPackages);

    if (changedPackages.length === 0) {
      console.log("No packages were modified in this commit.");
      return;
    }

    createChangesetFile(changedPackages, commitMessage);
  } catch (error) {
    console.error("Error creating changeset:", error);
  }
};

main();
