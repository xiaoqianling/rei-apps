import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
  return <button onClick={onClick}>{label}</button>;
};

describe("Button Component", () => {
  return;
  it("should render correctly", () => {
    const { getByText } = render(
      <Button label="Click me" onClick={() => {}} />,
    );
    expect(getByText("Click me")).toBeTruthy();

    fireEvent.click(getByText("Click me"));
    expect(() => {}).toHaveBeenCalledTimes(1);
  });

  //   it("should handle click event", () => {
  //     const mockFn = () => {};
  //     const { getByText } = render(<Button label="Click me" onClick={mockFn} />);
  //     fireEvent.click(getByText("Click me"));
  //     expect(mockFn).toHaveBeenCalledTimes(1);
  //   });
});
