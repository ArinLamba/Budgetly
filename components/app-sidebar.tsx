"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SIDEBAR_ITEMS } from "@/lib/constants"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const AppSidebar = () => {

  const pathname = usePathname();

  return (
    <>
      <Sidebar collapsible="icon" className="group hidden md:block">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-2">
            <Link
              href="/dashboard"
              className="flex flex-1 items-center gap-2 group-data-[collapsible=icon]:hidden"
            >
              <Image src="/logo.svg" alt="logo" width={34} height={34} />
              <h1 className="text-lg font-black tracking-normal text-white">
                Budgetly
              </h1>
            </Link>
            <SidebarTrigger className="text-zinc-300" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="my-1 h-10 text-white/85 transition-all duration-200 ease-in hover:text-white data-active:bg-violet-950/60 data-active:text-white"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur md:hidden">
        <div className="grid grid-cols-7 gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex h-11 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-violet-950/80 text-white"
                    : "text-white/70"
                }`}
                aria-label={item.title}
              >
                <Icon className="size-5" />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  )
}
