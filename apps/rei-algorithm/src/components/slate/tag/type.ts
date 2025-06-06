// 博客分类标签
export enum TagTypes {
  TECH = "tech",
  LIFE = "life",
  LEARN = "learn",
  WORK = "work",
  BUG = "bug",
  FEATURE = "feature",
  PERFORMANCE = "performance",
  SECURITY = "security",
}

// 字面量string转化枚举
export function translateTag(tag: string): TagTypes | undefined {
  switch (tag) {
    case "tech":
      return TagTypes.TECH;
    case "life":
      return TagTypes.LIFE;
    case "learn":
      return TagTypes.LEARN;
    case "work":
      return TagTypes.WORK;
    case "bug":
      return TagTypes.BUG;
    case "feature":
      return TagTypes.FEATURE;
    case "performance":
      return TagTypes.PERFORMANCE;
    case "security":
      return TagTypes.SECURITY;
    default:
      return undefined;
  }
}
