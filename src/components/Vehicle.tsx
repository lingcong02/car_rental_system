"use client";

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
import { VehicleModel, VehicleModelModel } from "@/model/Model";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteDialog from "./DeleteDialog";
import AddDialog from "./AddDialog";

const Vehicle = ({
  vehicle,
  setFetchTable,
}: {
  vehicle: VehicleModel;
  setFetchTable: any;
}) => {
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );
  const [showAlert, setShowAlert] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/VehicleModel/GetAll", {
        method: "GET",
      });
      const result = await response.json();
      setVehicleModelList(result);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: number) => async () => {
    const response = await fetch("/api/Vehicle/Deactive", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });

    if (response.ok) {
      setFetchTable((prev: any) => !prev);
      toast.success("Delete Successfully");
    } else {
      toast.error("Failed to delete vehicle");
    }
  };
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="vehicle image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={
            vehicle.image[0]?.path
              ? `${vehicle.image[0]?.path}`
              : "/emptyVehicle.png"
          }
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{vehicle.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {vehicleModelList?.find((e) => e.id === vehicle.model)?.desc}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{vehicle.platNo}</TableCell>
      <TableCell className="hidden md:table-cell">{`${vehicle.desc.slice(
        0,
        50
      )}.....`}</TableCell>
      <TableCell className="hidden md:table-cell">{`RM ${vehicle.price}`}</TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setShowDialog(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <DeleteDialog
        open={showAlert}
        onOpenChange={setShowAlert}
        handleDeleteAction={handleDelete(vehicle.id)}
        message={"Vehicle"}
      />
      <AddDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        method={"update"}
        vehicle={vehicle}
      />
    </TableRow>
  );
};

export default Vehicle;
