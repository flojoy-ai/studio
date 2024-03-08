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
              <FormLabel>Min</FormLabel>
              <FormControl>
                <NumberInput {...field} floating={float} precision={7} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max</FormLabel>
              <FormControl>
                <NumberInput {...field} floating={float} precision={7} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="step"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Step</FormLabel>
              <FormControl>
                <NumberInput {...field} floating={float} precision={7} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
