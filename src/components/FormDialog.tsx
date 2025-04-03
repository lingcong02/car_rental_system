"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { differenceInDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookingModel,
  UserModel,
  VehicleModel,
  VehicleModelModel,
} from "@/model/Model";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function FormDialog({
  vehicle,
  dateRange,
}: {
  vehicle: VehicleModel;
  dateRange: DateRange | undefined;
}) {
  const router = useRouter();
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );
  const [user, setUser] = useState<UserModel>();
  const [showDialog, setShowDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const query = await fetch("/api/VehicleModel/GetAll", { method: "GET" });
      const response = await query.json();
      setVehicleModelList(response);
    };
    fetchData();
  }, []);

  const daysBetween =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;
  const totalPrice = vehicle.price * daysBetween;

  const handleViewDetail = async () => {
    try {
      const query = await fetch("/api/User/GetByJwt", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const response = await query.json();
      if (query.ok) {
        setUser(response);
        setName(response.name);
        setEmail(response.email);
        setPhone(response.phone);
      } else {
        toast.error(response.message);
        router.push("/login");
      }
    } catch (error) {
      toast.error("Please Login");
      router.push("/login");
    }
  };

  const handleSave = async () => {
    try {
      const bookingModel: BookingModel = {
        bookingNo: "",
        vehicleId: vehicle.id,
        userId: 0,
        custName: name,
        custEmail: email,
        custPhone: phone,
        startDate: new Date(dateRange?.from!).toISOString(),
        endDate: new Date(dateRange?.to!).toISOString(),
        totalPrice: totalPrice,
      };
      console.log(bookingModel);
      const query = await fetch("/api/Booking/Insert", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingNo: "",
          vehicleId: vehicle.id,
          userId: 0,
          custName: name,
          custEmail: email,
          custPhone: phone,
          startDate: new Date(dateRange?.from!).toISOString(),
          endDate: new Date(dateRange?.to!).toISOString(),
          totalPrice: totalPrice,
        }),
      });
      const response = await query.json();
      if (query.ok) {
        toast.success("Booking Confirmed!");
        setShowAlert(false);
        setShowDialog(false);
        router.push("/list");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something Wrong");
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          className="w-1/3 justify-center cursor-pointer"
          variant={
            !dateRange?.from && !dateRange?.to ? "destructive" : "default"
          }
          onClick={handleViewDetail}
          disabled={!dateRange?.from && !dateRange?.to}
        >
          {!dateRange?.from && !dateRange?.to
            ? "Please Pick a Date"
            : "Booking Now"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Vehicle:</Label>
            <Label className="text-right">{vehicle.name}</Label>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Model:</Label>
            <Label className="text-right">
              {vehicleModelList?.find((e) => e.id === vehicle.model)?.desc}
            </Label>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Plat No:</Label>
            <Label className="text-right">{vehicle.platNo}</Label>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Total Days:</Label>
            <Label className="text-right col-span-2">
              {daysBetween} days (
              {format(dateRange?.from ?? new Date(), "dd/MM/yyyy")} -{" "}
              {format(dateRange?.to ?? new Date(), "dd/MM/yyyy")})
            </Label>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Total Price:</Label>
            <Label className="text-right">RM {totalPrice}</Label>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input id="username" defaultValue={name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Email</Label>
            <Input id="email" defaultValue={email} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Phone</Label>
            <Input
              id="phone"
              type="phone"
              defaultValue={phone}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setShowAlert(true)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSave();
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
