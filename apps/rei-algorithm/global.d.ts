// 消除scss module的编辑器报错
declare module "*.module.scss" {
  const styles: { [className: string]: string };
  export default styles;
}

declare module "*.mdx" {
  const content: React.ComponentType<any>;
  export default content;
}
