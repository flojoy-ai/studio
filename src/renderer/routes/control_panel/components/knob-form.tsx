import { KnobConfig } from "@/renderer/types/control";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/renderer/components/ui/form";
import { NumberInput } from "@/renderer/components/common/NumberInput";
import { DialogFooter } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { Box } from "lucide-react";
import { FormIconLabel } from "@/renderer/components/common/form-icon-label";

type Props = {
  initialValues: KnobConfig;
  onSubmit: (data: KnobConfig) => void;
};

export const KnobConfigForm = ({ onSubmit, initialValues }: Props) => {
  const form = useForm<KnobConfig>({
    resolver: zodResolver(KnobConfig),
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
                <FormIconLabel icon={Box}>Min</FormIconLabel>
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
                <FormIconLabel icon={Box}>Max</FormIconLabel>
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
                <FormIconLabel icon={Box}>Step</FormIconLabel>
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
