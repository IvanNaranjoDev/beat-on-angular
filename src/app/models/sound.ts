import { Category } from "./category";

export interface Sound {
  id: number;
  name: string;
  duration: string;
  image: string;
  soundPath: string;
  enabled: boolean;
  categoryId?: number;
  category: Category;
  audio?: HTMLAudioElement;
  buffer?: AudioBuffer;
}