"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { set } from "date-fns";

const UserIcon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const cookies = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!cookies.get("isLoggedIn"));
  }, [pathname, cookies, isLoggedIn]);

  const handleLogout = async () => {
    setIsLoading(true);

    const query = await fetch("/api/User/Logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (query.ok) {
      cookies.remove("isLoggedIn");
      setIsLoggedIn(false);
      toast.success("Logout Successfullly");
    }
    setIsLoading(false);
  };

  const handleLogoutAdmin = async () => {
    setIsLoading(true);

    const query = await fetch("/api/Admin/Logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (query.ok) {
      cookies.remove("isLoggedIn");
      setIsLoggedIn(false);
      toast.success("Logout Successfullly");
      router.push("/admin-login");
    }

    setIsLoading(false);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={"/placeholder-user.jpg"}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isLoggedIn ? (
          cookies.get("isLoggedIn") === "admin" ? (
            <>
              <DropdownMenuItem
                onClick={handleLogoutAdmin}
                className="cursor-pointer"
              >
                {isLoading ? "Logging out" : "Logout"}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/history">History</Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                {isLoading ? "Logging out" : "Logout"}
              </DropdownMenuItem>
            </>
          )
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserIcon;
