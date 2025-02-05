export interface MenuItem {
  // 每个标签标识
  id: string;
  // 名字
  label: string;
  // 是否为叶子节点(包含具体路由) 默认根据subItems推断
  endPoint?: boolean;
  // 路由
  path: string;
  onClick?: (path: string) => void;
  subItems?: MenuItem[];
}
