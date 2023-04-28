import { toast, ToastPosition } from 'react-toastify';
import { ToastOptions } from '@global/functions/interface';

export const notify = (options: ToastOptions) => {
  const {
    type = 'info',
    message = '🦄 Wow so easy!',
    position = 'bottom-left' as ToastPosition,
    autoClose = 5000,
    hideProgressBar = false,
    closeOnClick = true,
    pauseOnHover = true,
    draggable = true,
    progress = undefined,
    theme = 'dark',
  } = options;

  toast[type](message, {
    position,
    autoClose,
    hideProgressBar,
    closeOnClick,
    pauseOnHover,
    draggable,
    progress,
    theme,
  });
};
