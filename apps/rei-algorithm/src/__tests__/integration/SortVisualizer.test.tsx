import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SortVisualizer } from "../../components/engine/visual/sort";
import { mockSortData } from "../mocks/sortData";
import { getSortData } from "../../api/sort";

// 模拟API调用
vi.mock("../../api/sort", () => ({
  getSortData: vi.fn(),
}));

describe("SortVisualizer集成测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSortData).mockResolvedValue(mockSortData);
  });

  it("应该完成完整的排序可视化流程", async () => {
    render(<SortVisualizer />);

    // 1. 初始加载状态
    expect(screen.getByText(/加载中/i)).toBeInTheDocument();

    // 2. 数据加载完成
    await waitFor(() => {
      expect(screen.queryByText(/加载中/i)).not.toBeInTheDocument();
    });

    // 3. 检查数据展示
    expect(screen.getByText(mockSortData.title)).toBeInTheDocument();

    // 4. 测试播放控制
    const playButton = screen.getByRole("button", { name: /播放/i });
    await userEvent.click(playButton);

    // 5. 验证动画状态
    expect(screen.getByTestId("animation-container")).toHaveClass("playing");

    // 6. 测试暂停
    const pauseButton = screen.getByRole("button", { name: /暂停/i });
    await userEvent.click(pauseButton);
    expect(screen.getByTestId("animation-container")).toHaveClass("paused");

    // 7. 测试重置
    const resetButton = screen.getByRole("button", { name: /重置/i });
    await userEvent.click(resetButton);
    expect(screen.getByTestId("animation-container")).toHaveClass("initial");
  });

  it("应该处理API错误并允许重试", async () => {
    // 模拟API失败
    vi.mocked(getSortData).mockRejectedValueOnce(new Error("API Error"));

    render(<SortVisualizer />);

    // 1. 显示错误信息
    await waitFor(() => {
      expect(screen.getByText(/加载失败/i)).toBeInTheDocument();
    });

    // 2. 点击重试
    const retryButton = screen.getByRole("button", { name: /重试/i });
    await userEvent.click(retryButton);

    // 3. 验证重新加载
    expect(getSortData).toHaveBeenCalledTimes(2);

    // 4. 验证成功加载
    await waitFor(() => {
      expect(screen.getByText(mockSortData.title)).toBeInTheDocument();
    });
  });

  it("应该正确处理用户输入和交互", async () => {
    render(<SortVisualizer />);

    await waitFor(() => {
      expect(screen.queryByText(/加载中/i)).not.toBeInTheDocument();
    });

    // 1. 测试速度调节
    const speedSlider = screen.getByRole("slider", { name: /速度/i });
    await userEvent.clear(speedSlider);
    await userEvent.type(speedSlider, "2");
    expect(speedSlider).toHaveValue(2);

    // 2. 测试数据大小调节
    const sizeSlider = screen.getByRole("slider", { name: /数据大小/i });
    await userEvent.clear(sizeSlider);
    await userEvent.type(sizeSlider, "50");
    expect(sizeSlider).toHaveValue(50);

    // 3. 测试算法选择
    const algorithmSelect = screen.getByRole("combobox", { name: /算法/i });
    await userEvent.selectOptions(algorithmSelect, "quick-sort");
    expect(algorithmSelect).toHaveValue("quick-sort");
  });
});
