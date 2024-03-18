import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { useModalStore } from "@/renderer/stores/modal";

export const ErrorModal = () => {
  const { isErrorModalOpen, setIsErrorModalOpen, errorModalMessage } = useModalStore();
  const lines = errorModalMessage.split("\n");

  return (
    <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
      <DialogContent>
        <h2 className="mb-2 pt-3 text-center text-lg font-bold text-accent1 ">
          Error Details
        </h2>

        <div className="mt-2 max-h-[400px] max-w-[600px] overflow-y-auto whitespace-pre rounded-md bg-secondary p-2">
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
