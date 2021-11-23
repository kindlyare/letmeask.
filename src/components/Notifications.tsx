import toast from 'react-hot-toast';

export const notifyErrorCode = () => toast.error('Código Invalido');
export const notifyErrorRoom = () => toast.error('Essa sala já foi encerrada');


export function error() {
  toast.error('Código Invalida', {
    duration: 1700,
    position: 'top-center',
    // Styling
    style: {},
    className: 'error',
    icon: '❌',
  // Change colors of success/error/loading icon
    iconTheme: {
      primary: '#000',
      secondary: '#fff',
    },
    // Aria
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
}

export function errorRoom() {
  toast.error('Essa sala já foi encerrada', {
    duration: 1700,
    position: 'top-center',
    // Styling
    style: {},
    className: 'error',
    icon: '❌',
  // Change colors of success/error/loading icon
    iconTheme: {
      primary: '#000',
      secondary: '#fff',
    },
    // Aria
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
}




