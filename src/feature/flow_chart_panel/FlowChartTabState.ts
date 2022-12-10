import { useState } from "react";
import { useWindowSize } from "react-use";

export function useFlowChartTabState() {
  const { width } = useWindowSize();
  const [modalIsOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const afterOpenModal = () => null;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    windowWidth: width,
    modalIsOpen,
    setIsModalOpen,
    openModal,
    afterOpenModal,
    closeModal,
  };
}
