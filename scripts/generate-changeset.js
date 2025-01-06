const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 获取当前的 commit 消息
function getCommitMessage() {
  try {
    const commitMessage = fs.readFileSync(process.argv[2], "utf8").trim();
    return commitMessage;
  } catch (error) {
    console.error("Failed to read commit message:", error.message);
    process.exit(1);
  }
}

// 获取变更的包（基于 pnpm）
function getChangedPackages() {
  try {
    const output = execSync("pnpm --filter ./packages list --depth=-1 --json", {
      encoding: "utf8",
    });
    const allPackages = JSON.parse(output);

    const changedPackages = [];
    const diffOutput = execSync("git diff --name-only HEAD~1 HEAD").toString();
    diffOutput.split("\n").forEach((filePath) => {
      if (filePath.startsWith("packages/")) {
        const packageName = filePath.split("/")[1]; // 假设包名是第二层目录
        const pkg = allPackages.find((pkg) => pkg.name.includes(packageName));
        if (pkg) changedPackages.push(pkg.name);
      }
    });

    return Array.from(new Set(changedPackages));
  } catch (error) {
    console.error("Error detecting changed packages:", error.message);
    process.exit(1);
  }
}

// 创建 Changeset 文件
function createChangesetFile(changedPackages, commitMessage) {
  const changesetPath = path.resolve(".changeset");
  if (!fs.existsSync(changesetPath)) {
    fs.mkdirSync(changesetPath);
  }

  const changesetFile = path.join(
    changesetPath,
    `${Date.now()}-auto-generated-changeset.md`,
  );

  const changesetContent = `---
${changedPackages.map((pkg) => `"${pkg}":\n  "patch": true`).join("\n")}
---

${commitMessage}
`;

  fs.writeFileSync(changesetFile, changesetContent, "utf8");
  console.log(`Changeset file created at ${changesetFile}`);
}

// 主函数
function main() {
  const commitMessage = getCommitMessage();
  const changedPackages = getChangedPackages();

  if (changedPackages.length > 0) {
    console.log("Detected changed packages:", changedPackages);
    createChangesetFile(changedPackages, commitMessage);
  } else {
    console.log("No changed packages detected, skipping changeset creation.");
  }
}

main();
