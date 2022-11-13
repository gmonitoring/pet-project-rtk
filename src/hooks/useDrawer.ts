import { useState } from 'react';

export type Drawer = {
  handleOpenDrawer: () => void;
  handleCloseDrawer: () => void;
  open: boolean;
};

export const useDrawer = (initOpenValue: boolean): Drawer => {
  const [open, setOpen] = useState<boolean>(initOpenValue);

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  return {
    handleOpenDrawer,
    handleCloseDrawer,
    open,
  };
};
