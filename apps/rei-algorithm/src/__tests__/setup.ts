import { beforeAll, afterAll } from "vitest";

// vitest测试

beforeAll(() => {
  console.log("beforeAll");
});

afterAll(() => {
  console.log("afterAll");
});
