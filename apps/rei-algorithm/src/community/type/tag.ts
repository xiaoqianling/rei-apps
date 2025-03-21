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
export function translateTag(tag: string): TagTypes {
  switch (tag) {
    case "tech":
      return TagTypes.TECH;
  }
}
