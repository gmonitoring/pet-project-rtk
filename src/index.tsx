import React from 'react';
import ReactDOM from 'react-dom';
import 'index.scss';
import { ThemeProvider } from '@mui/material';
import { ProjectTheme } from 'config/theme';
import { Router } from 'Router';
import { Provider } from 'react-redux';
import { setupStore } from 'store/store';
import CssBaseline from '@mui/material/CssBaseline';

const store = setupStore();

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <ThemeProvider theme={ProjectTheme}>
        <Router />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
