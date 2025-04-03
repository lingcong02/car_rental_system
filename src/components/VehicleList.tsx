"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VehicleModel, VehicleModelModel } from "@/model/Model";
import { PaginationWithLinks } from "./PaginationWithLinks";
import { useSearchParams } from "next/navigation";
import Skeleton from "./Skeleton";

const VEHICLE_PER_PAGE = 8;

const VehicleList = () => {
  const searchParam = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [vehicleList, setVehicleList] = useState<VehicleModel[]>([]);
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );
  const [sortedVehicleList, setSortedVehicleList] = useState<VehicleModel[]>(
    []
  );
  const currentPage = parseInt(searchParam.get("page") || "1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response1 = await fetch("/api/Vehicle/GetAll", { method: "GET" });
        const result1 = await response1.json();
        setVehicleList(result1);

        const response2 = await fetch("/api/VehicleModel/GetAll", {
          method: "GET",
        });
        const result2 = await response2.json();
        setVehicleModelList(result2);
      } catch (err) {
        setError("Failed to fetch data");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let sortedList = [...vehicleList];

    const sortName = searchParam.get("name")?.toLowerCase();
    if (sortName != "") {
      sortedList = sortedList.filter((vehicle) =>
        [
          vehicle.name,
          vehicle.platNo,
          vehicleModelList?.find((e) => e.id === vehicle.model)?.desc,
          vehicle.price.toFixed(2),
        ].some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(sortName || "")
        )
      );
    }
    const sortModel = searchParam.get("model");
    if (sortModel && sortModel !== "Model") {
      sortedList = sortedList.filter((a) => a.model.toString() === sortModel);
    }

    const minPrice = searchParam.get("min");
    if (minPrice) {
      sortedList = sortedList.filter((a) => a.price >= parseFloat(minPrice));
    }

    const maxPrice = searchParam.get("max");
    if (maxPrice) {
      sortedList = sortedList.filter((a) => a.price <= parseFloat(maxPrice));
    }

    const sortType = searchParam.get("sortType");
    if (sortType) {
      sortedList.sort((a, b) =>
        sortType === "asc-price" ? a.price - b.price : b.price - a.price
      );
    }

    setSortedVehicleList(sortedList);
    setIsLoading(false);
  }, [searchParam, vehicleList]);
  if (isLoading) return <Skeleton />;
  if (error) return <p>Error: {error}</p>;

  const displayedVehicleList = sortedVehicleList.slice(
    (currentPage - 1) * VEHICLE_PER_PAGE,
    currentPage * VEHICLE_PER_PAGE
  );

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {displayedVehicleList.map((vehicle: VehicleModel) => (
        <Link
          href={"/list/" + vehicle.id}
          className="w-full flex flex-col justify-start gap-4 sm:w-[45%] lg:w-[22%]"
          key={vehicle.id}
        >
          <span className="font-bold">{`${
            vehicleModelList?.find((e) => e.id === vehicle.model)?.desc
          } ${vehicle.name}`}</span>
          <div className="relative w-full h-80">
            <Image
              src={
                vehicle.image[0]?.path
                  ? `/vehicles_image/${vehicle.image[0]?.path}`
                  : "/emptyVehicle.png"
              }
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />

            <Image
              src={
                vehicle.image[1]?.path
                  ? `/vehicles_image/${vehicle.image[1]?.path}`
                  : "/emptyVehicle.png"
              }
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{vehicle.platNo}</span>
            <span className="font-semibold">
              RM{vehicle.price.toFixed(2)}/days
            </span>
          </div>
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-blue-700 cursor-pointer">
            View Details
          </button>
        </Link>
      ))}
      {sortedVehicleList.length % 4 === 2 && (
        <>
          <div className="sm:w-[45%] lg:w-[22%] invisible"></div>
          <div className="sm:w-[45%] lg:w-[22%] invisible"></div>
        </>
      )}
      {sortedVehicleList.length % 4 === 3 && (
        <div className="sm:w-[45%] lg:w-[22%] invisible"></div>
      )}
      <PaginationWithLinks
        page={currentPage}
        pageSize={VEHICLE_PER_PAGE}
        totalCount={displayedVehicleList.length}
      />
    </div>
  );
};

export default VehicleList;
