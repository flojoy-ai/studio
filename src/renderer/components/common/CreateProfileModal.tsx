import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { useAuth } from "@src/context/auth.context";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User, allRoles } from "@/types/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { capitalize } from "lodash";

type CreateUserProfileProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  name: z.string(),
  role: z.string(),
  password: z
    .string()
    .optional()
    .refine((password) => !password || password.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

export function CreateUserProfile({
  open,
  handleOpenChange,
}: CreateUserProfileProps) {
  const { users, refreshUsers } = useAuth();
  const [hidePass, setHidePass] = useState(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      role: "viewer",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const nameExists = users.find((u) => u.name === data.name);
    if (nameExists) {
      form.setError("name", { message: "User name already exists!" });
      return;
    }
    try {
      await window.api.createUserProfile(data as User);
      toast.message("User profile created successfully!");
      refreshUsers();
      handleOpenChange(false);
    } catch (error) {
      toast.error("Failed to create user profile, reason: " + String(error));
    }
    return;
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new user profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (optional)</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={hidePass ? "password" : "text"}
                          {...field}
                        />
                        <div
                          className="absolute inset-y-0 right-0 flex items-center pr-2"
                          title={hidePass ? "Show password" : "Hide password"}
                          onClick={() => setHidePass((p) => !p)}
                        >
                          {hidePass ? (
                            <EyeIcon className="cursor-pointer" />
                          ) : (
                            <EyeOffIcon className="cursor-pointer" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {allRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {capitalize(role)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create Profile</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
