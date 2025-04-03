"use client";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BookingRequestModel } from "@/model/Model";
import Booking from "@/components/Booking";
import { PaginationWithLinks } from "@/components/PaginationWithLinks";

const BOOKING_PER_PAGE = 5;

const BookingTable = ({
  offset,
  totalProducts,
}: {
  offset: number;
  totalProducts: number;
}) => {
  let router = useRouter();
  const [bookingList, setBookingList] = useState<BookingRequestModel[]>([]);
  const searchParam = useSearchParams();

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

        const response1 = await fetch("/api/Booking/GetAll", {
          method: "GET",
          credentials: "include",
        });
        const result1 = await response1.json();
        setBookingList(result1);
      } catch (err) {
        return redirect("/admin-login");
      }
    };
    fetchData();
  }, []);

  const currentPage = parseInt(searchParam.get("page") || "1");

  const displayedBookingList = bookingList.slice(
    (currentPage - 1) * BOOKING_PER_PAGE,
    currentPage * BOOKING_PER_PAGE
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking</CardTitle>
        <CardDescription>Manage booking details</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking No</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Plat No</TableHead>
              <TableHead>From Date</TableHead>
              <TableHead>To Date</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingList.map((booking, index) => (
              <Booking key={index} booking={booking} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {displayedBookingList.length}
            </strong>{" "}
            of <strong>{bookingList.length}</strong> products
          </div>
          <div className="flex">
            <PaginationWithLinks
              page={currentPage}
              pageSize={BOOKING_PER_PAGE}
              totalCount={displayedBookingList.length}
            />
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default BookingTable;
