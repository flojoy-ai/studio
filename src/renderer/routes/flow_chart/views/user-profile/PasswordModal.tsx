import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Button } from "@components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import ConfirmPrompt from "@src/components/common/ConfirmPrompt";
import { useAuth } from "@src/context/auth.context";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "src/types/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
type PasswordModalProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  user: User;
  setUser: (user: User) => void;
};

const formSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (value) => /\d/.test(value),
        "Password must contain at least one number",
      ),
    retypedPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.retypedPassword, {
    message: "Passwords do not match",
    path: ["retypedPassword"],
  });
export function PasswordModal({
  open,
  handleOpenChange,
  user,
  setUser,
}: PasswordModalProps) {
  const { refreshUsers } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: undefined,
      newPassword: "",
      retypedPassword: "",
    },
  });
  const [openConfirmPrompt, setOpenConfirmPrompt] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (user.password && !data.currentPassword) {
      form.setError("currentPassword", {
        message: "Current password is required to change password!",
      });
      return;
    }
    if (user.password) {
      const passMatched = await window.api.validatePassword(
        user.name,
        data.currentPassword ?? "",
      );
      if (!passMatched) {
        form.setError("currentPassword", {
          message: "Invalid current password!",
        });
        return;
      }
    }
    try {
      await window.api.setUserProfilePassword(user.name, data.newPassword);
      toast.message("Password set successfully!");
      const users = await window.api.getUserProfiles();
      setUser(users.find((u) => u.name === user.name) ?? user);
      handleOpenChange(false);
    } catch (error) {
      toast.error("Failed to set password, reason: " + String(error));
    }
  };

  const handleDisablePassword = async () => {
    await window.api.setUserProfilePassword(user.name, "");
    toast.message("Password disabled successfully!");
    const users = await window.api.getUserProfiles();
    setUser(users.find((u) => u.name === user.name) ?? user);
    refreshUsers();
    handleOpenChange(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {user.password ? "Change password" : "Create a new password"}
            </DialogTitle>
            <DialogDescription>
              Password will be used to authenticate current profile
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                {user.password && (
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type={"password"} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
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
                  name="retypedPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Re-type Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  {user.password && (
                    <Button
                      variant="outline"
                      onClick={() => setOpenConfirmPrompt(true)}
                    >
                      Disable password
                    </Button>
                  )}
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmPrompt
        open={openConfirmPrompt}
        handleOpenChange={setOpenConfirmPrompt}
        handleConfirm={handleDisablePassword}
        description="This will reset and disable current password for this profile"
        confirmBtnText="Disable"
      />
    </>
  );
}
