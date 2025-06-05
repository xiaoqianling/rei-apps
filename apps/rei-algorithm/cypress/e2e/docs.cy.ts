/// <reference types="cypress" />

describe("文档站测试", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/learn/dataStructure/linear/array");
  });

  it("访问文档站", () => {
    cy.wait(50);
  });

  it("解析文档站路由", () => {
    cy.wait(200);
  });

  it("请求接口，获取文档数据", () => {
    cy.wait(200);
  });

  it("渲染页面成功", () => {
    cy.wait(1500);
  });

  it("侧边栏导航交互翻页", () => {
    cy.wait(1000);
  });

  it("跳转到新的文档页", () => {});
});
