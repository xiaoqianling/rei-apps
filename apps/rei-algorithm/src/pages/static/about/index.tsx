import EditorV2 from "@/src/components/senki/visualEditor/editorV2";
import "./index.scss";
import VisualEditor from "@/src/components/senki/visualEditor";

function AboutPage() {
  return (
    <div>
      <span>感谢您的访问！</span>
      <p>
        项目已在
        <a target="blank" href="https://github.com/xiaoqianling/rei-apps.git">
          github
        </a>
        开源，如果您有任何问题或建议可以
        <a
          target="blank"
          href="https://github.com/xiaoqianling/rei-apps/issues/new?template=Blank+issue"
        >
          提issue
        </a>
        或
        <a target="blank" href="#">
          与作者联系
        </a>
      </p>
      <strong>TODO 施工中...</strong>
      <EditorV2 />
      <VisualEditor />
    </div>
  );
}

export default AboutPage;
