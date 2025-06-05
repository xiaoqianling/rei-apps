/// <reference types="cypress" />

describe("代码可视化测试", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/visual/detail/bubble");
  });

  it("读取算法id", () => {
    cy.wait(50);
  });

  it("根据ID请求后端算法数据", () => {
    cy.wait(200);
  });

  it("等待组件渲染", () => {
    cy.wait(200);
  });

  it("输入测试代码", () => {
    cy.wait(1500);
  });

  it("点击运行按钮", () => {
    cy.wait(1000);
  });

  describe("检查组件渲染效果", () => {
    beforeEach(() => {});

    it("页面布局", () => {});

    it("代码编辑器", () => {});

    it("可视化区域", () => {});
  });
});
