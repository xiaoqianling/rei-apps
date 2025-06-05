/// <reference types="cypress" />

describe("富文本编辑器&发帖测试", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/community/create");
  });

  it("访问发帖页面", () => {
    cy.wait(200);
  });

  it("填写帖子标题", () => {
    cy.wait(200);
  });

  it("选择帖子标签", () => {
    cy.wait(200);
  });

  describe("富文本编辑器测试", () => {
    it("基本文字输入", () => {
      cy.wait(2000);
    });

    it("修改文字格式：标题/斜体/加粗", () => {
      cy.wait(500);
    });

    it("测试引用块", () => {
      cy.wait(500);
    });

    it("测试对齐方式", () => {
      cy.wait(1000);
    });

    it("测试Tip提示组件", () => {
      cy.wait(500);
    });

    it("测试折叠块", () => {
      cy.wait(500);
    });

    it("测试代码块", () => {
      cy.wait(500);
    });

    it("测试嵌入可视化组件", () => {
      cy.wait(1000);
    });
  });

  it("上传帖子", () => {
    cy.wait(500);
  });

  it("跳转到发布页", () => {
    cy.wait(1000);
  });
});
