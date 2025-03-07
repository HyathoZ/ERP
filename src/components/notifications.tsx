import { Toaster as SonnerToaster } from "sonner";

export function Notifications() {
  return <SonnerToaster position="top-right" expand richColors closeButton theme="system" duration={4000} />;
}
