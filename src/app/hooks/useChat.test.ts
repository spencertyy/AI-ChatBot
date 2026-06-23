import { renderHook, act } from "@testing-library/react";
import useChat from "./useChat";

// useChat 内部用了 useSession，必须 mock
jest.mock("next-auth/react", () => ({
  useSession: () => ({ status: "unauthenticated", data: null }),
}));

beforeEach(() => {
  localStorage.clear();
});

describe("useChat", () => {
  it("handleReaction adds a like, then toggles it off", () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      //动作：点击
      result.current.handleReaction("m1", "likes");
    });
    expect(result.current.reactions["m1"]).toEqual({
      likes: 1,
      dislikes: 0,
      userVote: "likes",
    });

    act(() => {
      result.current.handleReaction("m1", "likes"); // 再点一次
    });
    expect(result.current.reactions["m1"]).toEqual({
      likes: 0,
      dislikes: 0,
      userVote: null,
    });
  });
});
