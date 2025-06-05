import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { mockSortData } from "../mocks/sortData";

// 模拟API调用
vi.mock("../../api/sort", () => ({
  getSortData: vi.fn(() => Promise.resolve(mockSortData)),
}));

describe("SortVisualizer组件", () => {
  beforeEach(() => {
    // 每个测试前重置所有mock
    vi.clearAllMocks();
  });

  it("应该正确渲染初始状态", () => {
    render(<SortVisualizer />);

    // 检查加载状态
    expect(screen.getByText(/加载中/i)).toBeInTheDocument();
  });

  it("应该成功加载并显示排序数据", async () => {
    render(<SortVisualizer />);

    // 等待数据加载完成
    await waitFor(() => {
      expect(screen.queryByText(/加载中/i)).not.toBeInTheDocument();
    });

    // 检查排序数据是否正确显示
    expect(screen.getByText(mockSortData.title)).toBeInTheDocument();
  });

  it("应该在API调用失败时显示错误信息", async () => {
    // 模拟API失败
    vi.mocked(getSortData).mockRejectedValueOnce(new Error("API Error"));

    render(<SortVisualizer />);

    await waitFor(() => {
      expect(screen.getByText(/加载失败/i)).toBeInTheDocument();
    });
  });

  it("应该正确响应用户交互", async () => {
    render(<SortVisualizer />);

    // 等待数据加载
    await waitFor(() => {
      expect(screen.queryByText(/加载中/i)).not.toBeInTheDocument();
    });

    // 测试播放按钮
    const playButton = screen.getByRole("button", { name: /播放/i });
    fireEvent.click(playButton);

    // 验证动画状态
    expect(screen.getByTestId("animation-container")).toHaveClass("playing");
  });
});
 