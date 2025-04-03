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
import { BookingRequestModel, VehicleModelModel } from "@/model/Model";
import Booking from "@/components/Booking";
import { PaginationWithLinks } from "@/components/PaginationWithLinks";
import { toast } from "sonner";
import { format } from "date-fns";

const BOOKING_PER_PAGE = 5;

const BookingTable = () => {
  let router = useRouter();
  const [bookingList, setBookingList] = useState<BookingRequestModel[]>([]);
  const [sortedBookingList, setSortedBookingList] = useState<
    BookingRequestModel[]
  >([]);
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );
  const searchParam = useSearchParams();

  const fetchAuth = async () => {
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
  const fetchData = async () => {
    try {
      const response1 = await fetch("/api/Booking/GetAll", {
        method: "GET",
        credentials: "include",
      });
      const result1 = await response1.json();

      const response2 = await fetch("/api/VehicleModel/GetAll", {
        method: "GET",
      });
      const result2 = await response2.json();
      setVehicleModelList(result2);
      setBookingList(
        result1.map((item: any) => ({
          ...item,
          startDate: format(new Date(item.startDate), "dd/MM/yyyy"),
          endDate: format(new Date(item.endDate), "dd/MM/yyyy"),
          totalPrice: item.totalPrice.toFixed(2),
        }))
      );
    } catch (err) {
      toast.error("Fetch Error");
    }
  };

  useEffect(() => {
    fetchAuth().then(fetchData);    
  }, []);

  useEffect(() => {
    let sortedList = [...bookingList];
    console.log(sortedList);
    const sortName = searchParam.get("name")?.toLowerCase();
    if (sortName != "") {
      sortedList = sortedList.filter((booking) =>
        [
          booking.bookingNo,
          booking.custEmail,
          booking.totalPrice,
          booking.custEmail,
          booking.custName,
          booking.custPhone,
          format(new Date(booking.startDate), "dd/MM/yyyy"),
          format(new Date(booking.startDate), "dd/MM/yyyy"),
          booking.vehicle.platNo,
          booking.vehicle.name,
          vehicleModelList?.find((e) => e.id === booking.vehicle.model)?.desc,
        ].some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(sortName || "")
        )
      );
      console.log(sortedList);
    }
    setSortedBookingList(sortedList);
  }, [searchParam, bookingList]);

  const currentPage = parseInt(searchParam.get("page") || "1");

  const displayedBookingList = sortedBookingList.slice(
    (currentPage - 1) * BOOKING_PER_PAGE,
    currentPage * BOOKING_PER_PAGE
  );
  console.log(displayedBookingList);

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
              <TableHead>booking</TableHead>
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
            {displayedBookingList.map((booking, index) => (
              <Booking key={index} booking={booking} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{displayedBookingList.length}</strong> of{" "}
            <strong>{sortedBookingList.length}</strong> products
          </div>
          <div className="flex">
            <PaginationWithLinks
              page={currentPage}
              pageSize={BOOKING_PER_PAGE}
              totalCount={sortedBookingList.length}
            />
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default BookingTable;
