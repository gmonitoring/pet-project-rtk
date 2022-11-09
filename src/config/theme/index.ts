import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  export interface Palette {
    shapes: {
      red: string;
      green: string;
      blue: string;
      yellow: string;
      default: string;
    };
  }
}

export const palette = {
  shapes: {
    red: '#E8106AFF',
    green: '#19AB8CFF',
    blue: '#2862C9FF',
    yellow: '#EFD350FF',
    default: '#ccc4c4',
  },
};

export const baseThemeOptions = {
  palette,
  components: {
    MuiLink: {
      styleOverrides: {
        underlineAlways: {
          textDecoration: 'none',
        },
      },
    },
  },
};

export const ProjectTheme = createTheme(baseThemeOptions as any);
