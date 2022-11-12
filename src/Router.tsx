import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { FC } from 'react';
import App from 'App';
import { Home } from 'pages/home';

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </App>
    </BrowserRouter>
  );
};
