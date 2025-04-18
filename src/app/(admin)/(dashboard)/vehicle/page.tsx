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
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VehicleModel } from "@/model/Model";
import Vehicle from "@/components/Vehicle";
import { PaginationWithLinks } from "@/components/PaginationWithLinks";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddDialog from "@/components/AddDialog";

const VEHICLE_PER_PAGE = 8;

const VehicleTable = () => {
  const [vehicleList, setVehicleList] = useState<VehicleModel[]>([]);
  const [fetchTable, setFetchTable] = useState(false);
  const searchParam = useSearchParams();
  const [sortedVehicleList, setSortedVehicleList] = useState<VehicleModel[]>(
    []
  );
  const [showDialog, setShowDialog] = useState(false);

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
      const response1 = await fetch("/api/Vehicle/GetAll", { method: "GET" });
      const result1 = await response1.json();
      console.log(response1);
      setVehicleList(result1);
    } catch (err) {
      return redirect("/admin-login");
    }
  };
  
  useEffect(() => {
    console.log("fetchTable", fetchTable);
    fetchAuth().then(fetchData);
  }, [fetchTable, showDialog]);

  useEffect(() => {
    let sortedList = [...vehicleList];

    const sortName = searchParam.get("name")?.toLowerCase();
    if (sortName != "") {
      sortedList = sortedList.filter((vehicle) =>
        [
          vehicle.name,
          vehicle.platNo,
          sortedList?.find((e) => e.id === vehicle.model)?.desc,
          vehicle.price.toFixed(2),
        ].some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(sortName || "")
        )
      );
    }
    setSortedVehicleList(sortedList);
  }, [searchParam, vehicleList]);

  const currentPage = parseInt(searchParam.get("page") || "1");

  const displayedVehicleList = sortedVehicleList.slice(
    (currentPage - 1) * VEHICLE_PER_PAGE,
    currentPage * VEHICLE_PER_PAGE
  );

  return (
    <div>
      <div className="m-2 flex items-center gap-2 justify-end">
        <Button size="sm" className="h-8 gap-1" onClick={() => setShowDialog(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Product
          </span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle</CardTitle>
          <CardDescription>Manage your vehicle details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Plat No</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedVehicleList.map((vehicle) => (
                <Vehicle
                  key={vehicle.id}
                  vehicle={vehicle}
                  setFetchTable={setFetchTable}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Showing <strong>{displayedVehicleList.length}</strong> of{" "}
              <strong>{sortedVehicleList.length}</strong> products
            </div>
            <div className="flex">
              <PaginationWithLinks
                page={currentPage}
                pageSize={VEHICLE_PER_PAGE}
                totalCount={sortedVehicleList.length}
              />
            </div>
          </div>
        </CardFooter>
      </Card>
      <AddDialog open={showDialog} onOpenChange={setShowDialog} method={"add"} setFetchTable={setFetchTable}/>
    </div>
  );
};

export default VehicleTable;
