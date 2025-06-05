/// <reference types="cypress" />

describe("评论测试", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/community/article/post1");
  });

  it("访问测试帖子发布页", () => {
    cy.wait(50);
  });

  it("滚动到评论区", () => {
    cy.wait(200);
  });

  it("查看评论内容", () => {
    cy.wait(200);
  });

  it("点击跳转评论发布用户主页", () => {
    cy.wait(1500);
  });

  it("发布评论", () => {
    cy.wait(1000);
  });

  it("发布嵌套评论", () => {});
});
