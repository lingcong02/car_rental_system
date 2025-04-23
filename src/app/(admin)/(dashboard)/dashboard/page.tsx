"use client";

import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/Admin/Auth", {
            method: "GET",
            credentials: "include",
          });
          if (!response.ok) {
            return redirect("/admin-login");
          }

        } catch (err) {
          return redirect("/admin-login");
        }
      };
      fetchData();
    }, []);
  return (
    <div>page</div>
  )
}

export default Page