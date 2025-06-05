/// <reference types="cypress" />

describe("社区测试", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/community");
  });

  it("访问社区主页", () => {
    cy.wait(50);
  });

  it("等待获取推荐数据和渲染", () => {
    cy.wait(200);
  });

  it("验证社区交互", () => {
    cy.wait(200);
  });

  it("验证社区搜索功能", () => {
    cy.wait(1500);
  });

  it("验证标签分类功能", () => {
    cy.wait(1000);
  });

  it("阅读帖子", () => {});

  it("举报帖子", () => {});

  it("点赞帖子", () => {});

  it("访问用户主页", () => {});
});
