import { palette } from "config/theme";
import { Palette } from "@mui/material/styles";

type PaletteShapesKeys = keyof Palette['shapes'];

export const isPaletteColor = (value: string): value is PaletteShapesKeys => {
  return Object.keys(palette.shapes).includes(value);
};
