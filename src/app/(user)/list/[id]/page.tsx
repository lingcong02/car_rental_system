"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import { DialogDemo } from "@/components/DialogDemo";
import { FormDialog } from "@/components/FormDialog";
import Skeleton from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import VehicleImages from "@/components/VehicleImages";
import { VehicleModel, VehicleModelModel } from "@/model/Model";
import { notFound } from "next/navigation";
import React from "react";
import { Suspense, use, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const SingleVehiclePage = ({ params }: { params: Promise<{ id: number }> }) => {
  // Properly unwrap the params promise
  const { id } = use(params);

  const [vehicle, setVehicle] = useState<VehicleModel>();
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );
  const [showDialog, setShowDialog] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>();

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setSelectedDateRange(dateRange);
    console.log(dateRange);
  };

  const handleShowDialog = () => {
    setShowDialog(!showDialog);
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const query = await fetch("/api/Vehicle/GetById", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id), // Use the unwrapped id
        });
        const response = await query.json();

        const response2 = await fetch("/api/VehicleModel/GetAll", {
          method: "GET",
        });
        const result2 = await response2.json();

        if (!query.ok) {
          return notFound();
        }
        setVehicle(response);
        setVehicleModelList(result2);
      } catch (err) {
        setError("Failed to fetch vehicle");
        return notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicle();
  }, [id]); // Add id to dependency array
  if (isLoading) return <Skeleton />;
  if (error) return <p>Error: {error}</p>;

  if (!vehicle) return notFound();

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        {vehicle.image && <VehicleImages items={vehicle.image} />}
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">
          {vehicleModelList?.find((e) => e.id === vehicle.model)?.desc}{" "}
          {vehicle.name}
        </h1>
        <p className="text-gray-500">{vehicle.desc}</p>
        <div className="h-[2px] bg-gray-100" />
        <h2 className="font-medium text-2xl">RM{vehicle.price} / days</h2>
        <DateRangePicker onChange={handleDateChange} />
        <FormDialog vehicle={vehicle} dateRange={selectedDateRange} />
      </div>
    </div>
  );
};

export default SingleVehiclePage;
