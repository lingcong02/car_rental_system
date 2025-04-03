"use client";

import { profile } from "console";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
// import CartModal from "./CartModal";
// import { useWixClient } from "@/hookadd next-client-cookiess/useWixClient";
// import Cookies from "js-cookie";
// import { useCartStore } from "@/hooks/useCartStore";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const cookies = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (cookies.get("isLoggedIn")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });
  // const wixClient = useWixClient();
  // const isLoggedIn = wixClient.auth.loggedIn();

  // TEMPORARY
  // const isLoggedIn = false;

  const handleProfile = () => {
    // if (!isLoggedIn) {
    //   router.push("/login");
    // } else {
    setIsProfileOpen(!isProfileOpen);
    // }
  };
  let profileRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: any) => {
  //     const profileMenu = document.getElementById("profile-menu");
  //     const profileIcon = document.getElementById("profile-icon");
  //     console.log(profileMenu);

  //     if (
  //       profileMenu &&
  //       !profileMenu.contains(event.target) &&
  //       profileIcon &&
  //       !profileIcon.contains(event.target)
  //     ) {
  //       setIsProfileOpen(false);
  //     }
  //   };

  //   // Add event listener for clicks outside of the profile menu
  //   document.addEventListener("mousedown", handleClickOutside);

  //   // Cleanup event listener when component unmounts
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // AUTH WITH WIX-MANAGED AUTH

  // const wixClient = useWixClient();

  // const login = async () => {
  //   const loginRequestData = wixClient.auth.generateOAuthData(
  //     "http://localhost:3000"
  //   );

  //   console.log(loginRequestData);

  //   localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
  //   const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
  //   window.location.href = authUrl;
  // };

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
      toast.success("Logout Successfullly");
    }

    // Cookies.remove("refreshToken");
    // const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    // router.push(logoutUrl);
  };

  // const { cart, counter, getCart } = useCartStore();

  // useEffect(() => {
  //   getCart(wixClient);
  // }, [wixClient, getCart]);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative" ref={profileRef}>
      <Image
        id="profile-icon"
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div
          id="profile-menu"
          className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20"
        >
          {isLoggedIn ? (
            <>
              <Link href="/profile" onClick={handleProfile}>Profile</Link>

              <div className="mt-2 cursor-pointer">
                <Link href="/history" onClick={handleProfile}>History</Link>
              </div>
              <div className="mt-2 cursor-pointer" onClick={handleLogout}>
                {isLoading ? "Logging out" : "Logout"}
              </div>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NavIcons;
