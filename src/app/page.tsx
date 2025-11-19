import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  LayoutDashboard,
  ArrowRightLeft,
  FileText,
  Settings,
  MoreHorizontal,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Dashboard } from './dashboard';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-card">
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2.5 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icons.logo className="h-5 w-5" />
            </div>
            <span className="truncate text-lg font-semibold font-headline tracking-tight">
              Vodafone Automator
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Transactions">
                <ArrowRightLeft />
                <span>Transactions</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Reports">
                <FileText />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">John Doe</span>
                  <span className="text-muted-foreground">john.doe@example.com</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold font-headline">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Dashboard />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
