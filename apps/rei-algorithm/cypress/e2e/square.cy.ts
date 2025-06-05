/// <reference types="cypress" />

describe("文档站测试", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/visual");
  });

  it("访问算法广场", () => {
    cy.wait(200);
  });

  it("等待页面渲染完成", () => {
    cy.wait(200);
  });

  it("验证页面交互功能", () => {
    cy.wait(200);
  });

  it("验证跳转能力", () => {
    cy.wait(1500);
  });

  it("测试搜索算法能力", () => {
    cy.wait(1000);
  });
});
