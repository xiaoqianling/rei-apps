## 组件

- BlogTip 提示块
- MarkdownCode 代码块

## 自由构建模式：

- 这部分只需要用户输入数据或模拟数据即可，无需代码
- 结合文档mdx展示
- 尽量全面覆盖所有数据结构和原子操作

## 算法演示模式：

- 代码结合图展示，关联每一个action，用redux dispatch更新

我要实现一个《可视化数据结构与算法网站》，有一个核心组件，左侧展示代码，右侧展示对应的可视化内容。1.代码编辑器：左侧的代码编辑器我用codemirror大概实现了，同时可以运行代码获取代码输出。2.可视化面板：这个组件非常复杂，我尝试用GSAP+svg实现，但是效果很不理想，这是一个大问题，也是你主要实现的组件，它要支持：a.渲染多种可视化数据结构，比如常见的线性表、树、图等，这些数据结构定义由你定义。b.这些渲染的数据结构接受一些交互，比如悬浮，点击，在一定范围内拖动结点。c.在一个画板内绘制多种数据结构，画板支持拖动、缩放，就像一个无限大的画布一样。我实现的组件其实交互效果很不错，只是画布拖动方面有一些细节问题，你可以选择用别的技术实现，或者重构我的代码。3.(这一步设计代码解析，可以稍后再实现，目前可以提出技术实现方案)编辑器与可视化面板联动：将代码分割成若干步，就像调试器一样，每一步的状态实时展示到面板中。对于编辑器中定义的变量，可以使用特定注释，比如// @array @graph等来指定它的数据结构，尝试解析这个变量，将他绘制到右侧的可视化面板里。同时监听代码中它的改变，同步到右侧面板里。

我们一点点来，首先我们实现一个动画引擎，用于绘制一些数据结构，应该可以：高效绘制一系列数据结构、数据结构变化时可以高效重绘(同时要有流畅的重绘动画)、以块为单位，一个画布上可以有多个块，每个块表示一个数据结构变量、块可以在画布上任意拖动位置、缩放、画布可以有一个比较大的边界。你觉得用什么技术方案比较好？SVG CANVAS 还是其他优秀的库，我希望可视化面板可以有一些自定义特色内容，能尽量保持可自定义程度。
然后你觉得我们需要什么模块控制吗，针对绘制、更新这些，讲讲技术方案和设计

SenkiArray
基于普通的数组对象，与视图绑定了如下API:

移除尾部元素并返回
pop: ( ) => number;

添加一个元素到尾部
push: (value: number) => number;

删除头部元素并返回
shift: ( ) => number;

往数组头部添加一个元素
unshift: (value: number) => number;

添加一个元素，返回数组长度
add: (idx: number, value: number) => number;

移除一个元素，返回被移除的值
remove: (idx: number) => number;

设置元素值
set: (idx: number, value: number) => void;

交换数组元素
swap: (idx1: number, idx2: number) => void;

标记元素颜色, 返回取消标记的函数
因为动画队列的关系，标记动作本身不一定立刻执行，因此取消函数的返回值是一个Promise

flag: (idx: number, color: string): => () => Promise<void>

刷新画布
因为对画布上节点的属性设置并不一定立刻生效

refresh: ( ) => void;

SenkiLinkedNode
定位基于 Reingold-Tilford 算法

可使用left、right 模拟二叉树，或直接增删child节点。

标记颜色（格式必须为 #aabbcc），返回取消标记的函数
flag：(color: string) => ( ) => Promise<void>;

获取子节点
getChild：(idx: number) => SenkiLinkedNode;

添加子节点
addChild：(n: SenkiLinkedNode, idx = 0) => number;

移除子节点，成为一颗独立树
removeChild: (v: SenkiLinkedNode | number) => SenkiLinkedNode | null;

销毁该节点对应子树
destroy: ( ) => void;

从原本的父节点移动到新的父节点下
除了构造函数外，

修改对应图形节点、真正会触发动画的唯一函数的唯一函数。

原则上一次动作，只设置一次parent。

private set parent(args: [idx: number, newP: SenkiLinkedNode?, destroy: boolean])

获取父节点
get parent：( ) => SenkiLinkedNode | null;

加入到第一个节点
set left(n: SenkiLinkedNode)

返回上次设置为 left 的节点
get left() : SenkiLinkedNode | null

加入到最后一个节点
set right(n: SenkiLinkedNode)

返回上一次设置为 right 的节点
get right() : SenkiLinkedNode | null
