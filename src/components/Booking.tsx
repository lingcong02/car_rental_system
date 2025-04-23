import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { BookingRequestModel, VehicleModel } from "@/model/Model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

const Booking = ({ booking }: { booking: BookingRequestModel }) => {
  const [bookingModelList, setbookingModelList] = useState<VehicleModel[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/VehicleModel/GetAll", {
          method: "GET",
        });
        const result = await response.json();
        setbookingModelList(result);
      } catch (err) {
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);
  return (
    <TableRow>
      <TableCell className="font-medium">{booking.bookingNo}</TableCell>
      <TableCell className="font-medium">{booking.custName}</TableCell>
      <TableCell className="font-medium">{booking.custPhone}</TableCell>
      <TableCell className="font-medium">{booking.custEmail}</TableCell>
      <TableCell className="hidden sm:table-cell">
        {booking.vehicle.image[0]?.path && (
          <Image
            alt="booking image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={booking.vehicle.image[0]?.path}
            width="64"
          />
        )}
      </TableCell>
      <TableCell className="font-medium">
        {`${
          bookingModelList?.find((e) => e.id === booking.vehicle.model)?.desc
        } ${booking.vehicle.name}`}{" "}
      </TableCell>
      <TableCell className="font-medium">{booking.vehicle.platNo}</TableCell>
      <TableCell className="font-medium">
        {booking.startDate.toString()}
      </TableCell>
      <TableCell className="font-medium">
        {booking.endDate.toString()}
      </TableCell>

      <TableCell className="hidden md:table-cell">{`RM ${booking.totalPrice}`}</TableCell>
    </TableRow>
  );
};

export default Booking;
