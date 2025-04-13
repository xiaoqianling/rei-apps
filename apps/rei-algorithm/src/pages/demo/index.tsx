import VisualEngineDemo from "./demo";

function DemoPage() {
  return (
    <div>
      <h1>DemoPage</h1>
      <div
        style={{
          width: "800px",
          height: "600px",
          border: "1px solid blue",
          margin: "20px",
        }}
      >
        <VisualEngineDemo />
      </div>
    </div>
  );
}

export default DemoPage;
