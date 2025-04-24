import { ReduxState } from "../index";

export function selectAnchorItems(state: ReduxState) {
  return state.anchor.anchorItems;
}
