import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { useSequencerModalStore } from "@/renderer/stores/modal";

export const ErrorModal = () => {
  const { isErrorModalOpen, setIsErrorModalOpen, errorModalMessage } =
    useSequencerModalStore();
  const lines = errorModalMessage.split("\n");
  const maxLen = 100;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > maxLen) {
      const line = lines[i];
      lines.splice(i, 1, line.slice(0, maxLen), line.slice(maxLen));
    }
  }

  return (
    <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
      <DialogContent className="max-w-4xl">
        <h2 className="mb-2 pt-3 text-lg font-bold text-accent1 ">
          Error Details
        </h2>

        <div className="max-h-[400px] overflow-y-auto whitespace-pre rounded-md bg-secondary p-2">
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
