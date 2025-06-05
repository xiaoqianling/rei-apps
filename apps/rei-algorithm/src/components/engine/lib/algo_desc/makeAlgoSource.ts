export type AlgoSource = { rawCode: string; desc: string[]; asyncCode: string };

export function makeAlgoSource(
  rawCode: string,
  desc: string[],
  asyncCode: string,
): AlgoSource {
  return { rawCode: rawCode.trim(), desc, asyncCode: asyncCode.trim() };
}

export default makeAlgoSource;
