export interface MenuItem {
  // 名字
  label: string;
  // 是否为叶子节点(包含具体路由) 默认根据subItems推断
  endPoint?: boolean;
  // 路由
  path: string;
  // 是否处于激活 只在endPoint为true时生效
  active?: boolean;
  subItems?: MenuItem[];
}
