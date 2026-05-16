import { useState } from "react";

type ConfirmState = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (() => void) | null;
};

export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "Confirmar",
    onConfirm: null,
  });

  function open(options: {
    title: string;
    description: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }) {
    setState({
      isOpen: true,
      title: options.title,
      description: options.description,
      confirmLabel: options.confirmLabel ?? "Confirmar",
      onConfirm: () => {
        options.onConfirm();
        close();
      },
    });
  }

  function close() {
    setState({
      isOpen: false,
      title: "",
      description: "",
      confirmLabel: "Confirmar",
      onConfirm: null,
    });
  }

  return { ...state, open, close };
}
