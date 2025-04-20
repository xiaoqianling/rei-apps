export type AlgoSource = { shower: string; desc: string[]; realcode: string };

export function makeAlgoSource(
  shower: string,
  desc: string[],
  realcode: string,
): AlgoSource {
  return { shower: shower.trim(), desc, realcode: realcode.trim() };
}

export default makeAlgoSource;
