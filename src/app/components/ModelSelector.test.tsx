import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModelSelector from "./ModelSelector";
import type { Model } from "../types/chat";

const models: Model[] = [
  {
    label: "Gemini 2.5 Flash",
    id: "gemini-2.5-flash",
    provider: "gemini",
    icon: "https://example.com/gemini.png",
  },
  {
    label: "GPT-4o mini",
    id: "gpt-4o-mini",
    provider: "openai",
    icon: "https://example.com/gpt.png",
  },
];

describe("ModelSelector", () => {
  it("shows the current model label", () => {
    render(
      <ModelSelector
        selectModel={models[0]}
        models={models}
        setSelectModel={jest.fn()}
      />,
    );
    expect(screen.getByText("Gemini 2.5 Flash")).toBeInTheDocument();
    expect(screen.queryByText("GPT-4o mini")).not.toBeInTheDocument();
  });

  it("opens the menu when the trigger is clicked", async () => {
    render(
      <ModelSelector
        selectModel={models[0]}
        models={models}
        setSelectModel={jest.fn()}
      />,
    );
    expect(screen.queryByText("GPT-4o mini")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Gemini 2.5 Flash"));
    expect(screen.getByText("GPT-4o mini")).toBeInTheDocument();
  });

  it("calls setSelectModel when an option is clicked", async () => {
    const setSelectModel = jest.fn();
    render(
      <ModelSelector
        selectModel={models[0]}
        models={models}
        setSelectModel={setSelectModel}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Gemini 2.5 Flash" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "GPT-4o mini" }));
    expect(setSelectModel).toHaveBeenCalledWith(models[1]);
  });
});
