import { SliderConfig } from "@/renderer/types/control";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/renderer/components/ui/form";
import { NumberInput } from "@/renderer/components/common/NumberInput";
import { DialogFooter } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { Box } from "lucide-react";

type Props = {
  initialValues: SliderConfig;
  onSubmit: (data: SliderConfig) => void;
};

export const SliderConfigForm = ({ onSubmit, initialValues }: Props) => {
  const form = useForm<SliderConfig>({
    resolver: zodResolver(SliderConfig),
    defaultValues: initialValues,
  });
  const float = false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="min"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between font-bold">
                <FormLabel className="flex items-center gap-2">
                  <Box size={20} className="stroke-muted-foreground" />
                  <div className="font-bold">Min</div>
                </FormLabel>
                <FormControl className="w-48">
                  <NumberInput {...field} floating={float} precision={7} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="max"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between font-bold">
                <FormLabel className="flex items-center gap-2">
                  <Box size={20} className="stroke-muted-foreground" />
                  <div className="font-bold">Max</div>
                </FormLabel>
                <FormControl className="w-48">
                  <NumberInput {...field} floating={float} precision={7} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="step"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between font-bold">
                <FormLabel className="flex items-center gap-2">
                  <Box size={20} className="stroke-muted-foreground" />
                  <div className="font-bold">Step</div>
                </FormLabel>
                <FormControl className="w-48">
                  <NumberInput {...field} floating={float} precision={7} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-2" />
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
