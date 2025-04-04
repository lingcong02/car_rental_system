"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { differenceInDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { UserInput } from "./UserInput";

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
  const [user, setUser] = useState<UserModel | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fetchAuth = async () => {
    try {
      const response = await fetch("/api/User/Auth", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Please log in to continue");
        return router.push("/login");
      }
    } catch (err) {
      toast.error("Please log in to continue");
      return router.push("/login");
    }
  };

  const fetchVehicleModels = async () => {
    try {
      const response = await fetch("/api/VehicleModel/GetAll", {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        setVehicleModelList(data);
      } else {
        toast.error("Failed to load vehicle models");
      }
    } catch (error) {
      toast.error("Error fetching vehicle models");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/User/GetByJwt", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }; 

  useEffect(() => {
    if(showDialog){
      const fetchData = async () => {
        await fetchAuth();
        await fetchVehicleModels();
        await fetchUser();
      }
      fetchData();
    }
  }, [showDialog]);

   

  const daysBetween =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;
  const totalPrice = vehicle.price * daysBetween;

  const handleSave = async () => {
    try {
      const bookingModel: BookingModel = {
        bookingNo: "",
        vehicleId: vehicle.id,
        userId: 0,
        custName: name,
        custEmail: email,
        custPhone: phone,
        startDate: dateRange?.from
          ? new Date(dateRange.from).toISOString()
          : "",
        endDate: dateRange?.to ? new Date(dateRange.to).toISOString() : "",
        totalPrice: totalPrice,
      };

      const response = await fetch("/api/Booking/Insert", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingModel),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Booking Confirmed!");
        setShowAlert(false);
        setShowDialog(false);
        router.push("/list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAvtiveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(true);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          className="w-1/3 justify-center cursor-pointer"
          variant={
            !dateRange?.from || !dateRange?.to ? "destructive" : "default"
          }
          disabled={!dateRange?.from || !dateRange?.to}
        >
          {!dateRange?.from || !dateRange?.to
            ? "Please Pick a Date"
            : "Booking Now"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAvtiveAlert}>
          <div className="grid gap-4 py-4">
            <BookingInfo label="Vehicle" value={vehicle.name} />
            <BookingInfo
              label="Model"
              value={
                vehicleModelList?.find((e) => e.id === vehicle.model)?.desc ||
                "Unknown"
              }
            />
            <BookingInfo label="Plat No" value={vehicle.platNo} />
            <BookingInfo
              label="Total Days"
              value={`${daysBetween} days (${format(
                dateRange?.from ?? new Date(),
                "dd/MM/yyyy"
              )} - ${format(dateRange?.to ?? new Date(), "dd/MM/yyyy")})`}
            />
            <BookingInfo label="Total Price" value={`RM ${totalPrice}`} />
            <Separator className="my-4" />
            <UserInput label="Name" value={name} onChange={setName} />
            <UserInput label="Email" value={email} onChange={setEmail} />
            <UserInput
              label="Phone"
              value={phone}
              onChange={setPhone}
              type="phone"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
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
            <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

const BookingInfo = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label className="text-right">{label}:</Label>
    <Label className="text-right col-span-2">{value}</Label>
  </div>
);
