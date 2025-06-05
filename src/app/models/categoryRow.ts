import { Category } from "./category";
import { Sound } from "./sound";

export interface CategoryRow {
  category: Category;
  sounds: Sound[];
  selectedSound: Sound | null;
  steps: { active: boolean }[];
}