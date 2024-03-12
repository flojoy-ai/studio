import { FileUploadConfig } from "@/renderer/types/control";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/renderer/components/ui/form";
import { DialogFooter } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/renderer/components/ui/input";

type Props = {
  initialValues: FileUploadConfig;
  onSubmit: (data: FileUploadConfig) => void;
};

export const FileUploadConfigForm = ({ onSubmit, initialValues }: Props) => {
  const form = useForm<FileUploadConfig>({
    resolver: zodResolver(FileUploadConfig),
    defaultValues: initialValues,
  });

  const handleSubmit = (data: FileUploadConfig) => {
    const filtered = data.allowedExtensions.filter((v) => v.ext !== "");
    onSubmit({ ...data, allowedExtensions: filtered });
  };

  const { fields, remove, insert } = useFieldArray({
    control: form.control,
    name: "allowedExtensions",
  });

  const handleInsert = (index: number) => {
    insert(index + 1, { ext: "" });
  };

  const handleRemove = (index: number) => {
    if (fields.length <= 1) return;
    remove(index);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        {fields.map((_, index) => (
          <div className="flex items-center justify-center">
            <FormField
              control={form.control}
              name={`allowedExtensions.${index}.ext` as const}
              render={({ field }) => (
                <FormItem>
                  <FormControl className="w-48">
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="icon"
              variant="ghost"
              type="button"
              onClick={() => handleInsert(index)}
            >
              <PlusCircle size={20} className="stroke-muted-foreground" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              type="button"
              onClick={() => handleRemove(index)}
            >
              <Trash2 size={20} className="stroke-muted-foreground" />
            </Button>
          </div>
        ))}
        <div className="py-2" />
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
