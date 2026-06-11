import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function Mainlayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full pb-20 md:pb-0">
        {children}
      </main>
    </SidebarProvider>
  );
};
