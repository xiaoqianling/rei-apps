const parse = require("@changesets/parse").default;

const parseChangesetContent = (content) => {
  if (!content) {
    return [];
  }
  const parsedChangeset = parse(content);
  return parsedChangeset.releases.map((pkg) => pkg.name);
};

/**
 * 获取 changeset 新增的包名
 */
const getChangesetPackagesAppend = async (filePathList) => {
  try {
    // 筛选 /infra/.changeset/ 目录下的修改文件（必定为新增）
    const csFilePathList = filePathList.filter(
      (filePath) =>
        filePath.endsWith(".md") && filePath.includes("infra/.changeset"),
    );
    // 读取这些文件的内容，正则匹配得到变更的包名
    const packagesOfFiles = await Promise.all(
      csFilePathList.map(
        (filePath) =>
          new Promise((resolve) => {
            fs.readFile(filePath).then((s) =>
              resolve(parseChangesetContent(s.toString())),
            );
          }),
      ),
    );
    // 去重
    // const mSet = new Set();
    return [...new Set(packagesOfFiles.flat())];
  } catch (e) {
    console.log("getChangesetPackagesAppend 执行失败", e);
    return [];
  }
};

/**
 * 获取两数组间的差异
 */
const getDifference = (sourceArr, targetArr) => {
  const same = [];
  const increase = [];
  for (const item of targetArr) {
    if (sourceArr.includes(item)) {
      same.push(item);
    } else {
      increase.push(item);
    }
  }

  const decrease = sourceArr.filter((item) => !same.includes(item));
  return {
    same,
    increase,
    decrease,
  };
};

export { getChangesetPackagesAppend, getDifference };