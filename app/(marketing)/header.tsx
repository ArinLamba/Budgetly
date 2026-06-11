"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { Loader, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 bg-white/90 px-4 text-slate-950 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <Image
            alt="Budgetly logo"
            className="rounded-md"
            height={38}
            src="/logo.svg"
            width={38}
          />
          <span className="text-lg font-black tracking-normal">Budgetly</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            className="hidden text-sm font-bold text-slate-500 transition-colors hover:text-slate-950 sm:block"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="hidden text-sm font-bold text-slate-500 transition-colors hover:text-slate-950 sm:block"
            href="/dashboard"
          >
            Dashboard
          </Link>
          {!isLoaded ? (
            <Loader className="size-5 animate-spin text-violet-600" />
          ) : isSignedIn ? (
            <>
              <Button asChild className="hidden bg-violet-600 text-white hover:bg-violet-500 sm:inline-flex">
                <Link href="/dashboard">Open app</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button
                className="hidden border-slate-200 bg-white text-slate-900 hover:bg-slate-100 sm:inline-flex"
                variant="outline"
              >
                Login
              </Button>
            </SignInButton>
          )}
          <Button className="size-10 border-slate-200 bg-white p-0 text-slate-900 hover:bg-slate-100 sm:hidden" variant="outline">
            <Menu className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
