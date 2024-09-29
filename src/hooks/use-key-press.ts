import React from 'react';

type KeyPressHandler = () => void;

export function useKeyPress(targetKey: string, handler: KeyPressHandler) {
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      if (!isInput && event.key.toLowerCase() === targetKey.toLowerCase()) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [targetKey, handler]);
}
