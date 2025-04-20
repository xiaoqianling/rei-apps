import { SenkiArray } from '../lib/senki';

/**
 * Function signature for generating algorithm source code and descriptions.
 * Takes an optional input array and returns the display code, description steps,
 * and the executable code with senki commands.
 */
export type MakeAlgoSourceFn = (
  inputArray?: number[] | undefined
) => [string, string[], string];

/**
 * Represents the data structure for a single algorithm,
 * simulating what an API might return.
 */
export interface AlgorithmData {
  id: string; // Unique identifier (e.g., "bubble", "merge")
  name: string; // Display name (e.g., "冒泡排序")
  fakeCode: string; // Code for display in CodeMirror
  descriptionSteps: string[]; // Step-by-step descriptions corresponding to realCode markers
  makeAlgoSource: MakeAlgoSourceFn; // Function to generate realCode based on input
} 