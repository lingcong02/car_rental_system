"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VehicleModel, VehicleModelModel } from "@/model/Model";
import { PaginationComponent } from "./PaginationComponent";
import { useSearchParams } from "next/navigation";
import Skeleton from "./Skeleton";

const VEHICLE_PER_PAGE = 8;

const VehicleList = ({
  limit,
  searchParams,
}: {
  limit?: number;
  searchParams?: any;
}) => {
  // const wixClient = await wixClientServer();

  // const productQuery = wixClient.products
  //   .queryProducts()
  //   .startsWith("name", searchParams?.name || "")
  //   .eq("collectionIds", categoryId)
  //   .hasSome(
  //     "productType",
  //     searchParams?.type ? [searchParams.type] : ["physical", "digital"]
  //   )
  //   .gt("priceData.price", searchParams?.min || 0)
  //   .lt("priceData.price", searchParams?.max || 999999)
  //   .limit(limit || PRODUCT_PER_PAGE)
  //   .skip(
  //     searchParams?.page
  //       ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
  //       : 0
  //   );
  //   // .find();

  //   if (searchParams?.sort) {
  //     const [sortType, sortBy] = searchParams.sort.split(" ");

  //     if (sortType === "asc") {
  //       productQuery.ascending(sortBy);
  //     }
  //     if (sortType === "desc") {
  //       productQuery.descending(sortBy);
  //     }
  //   }

  //   const res = await productQuery.find();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response1 = await fetch("api/Vehicle/GetAll", { method: "GET" });
        const result1 = await response1.json();
        setVehicleList(result1);

        const response2 = await fetch("api/VehicleModel/GetAll", {
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
    if (!vehicleList.length) return;

    let sortedList = [...vehicleList];

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

  // try{
  //   setIsLoading(true);
  //   const sortModel = searchParam.get("model");
  //   if (sortModel !== "Model" && sortModel !== null) {
  //     sortedVehicleList = [...vehicleList].filter(
  //       (a) => a.model.toString() === sortModel
  //     );
  //   }
  //   // else {
  //   //   sortedVehicleList = [...vehicleList];
  //   // }

  //   const minPrice = searchParam.get("min");
  //   if (minPrice !== "" && minPrice !== null) {
  //     sortedVehicleList = [...sortedVehicleList].filter(
  //       (a) => a.price >= parseFloat(minPrice)
  //     );
  //   }
  //   // else {
  //   //   sortedVehicleList = [...vehicleList];
  //   // }

  //   const maxPrice = searchParam.get("max");
  //   if (maxPrice !== "" && maxPrice !== null) {
  //     sortedVehicleList = [...sortedVehicleList].filter(
  //       (a) => a.price <= parseFloat(maxPrice)
  //     );
  //   }
  //   //  else {
  //   //   sortedVehicleList = [...vehicleList];
  //   // }

  //   const sortType = searchParam.get("sortType");
  //   if(sortType !== null){
  //     sortedVehicleList = [...sortedVehicleList].sort((a, b) => {
  //       switch (sortType) {
  //         case "asc-price":
  //           return a.price - b.price;
  //         case "desc-price":
  //           return b.price - a.price;
  //         default:
  //           return 0;
  //       }
  //     });
  //   }
  // }
  // catch(error){

  // }finally{
  //   setIsLoading(false);
  // }

  // console.log(sortedVehicleList);

  // const maxPage = vehicleList?.length! / VEHICLE_PER_PAGE;
  // console.log(maxPage)
  // const vehicleList = [...vehicleList].sort((a, b) => a.price - b.price); // Ascending

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {sortedVehicleList.map((vehicle: VehicleModel) => (
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
                vehicle.image?.[0]?.path
                  ? `/vehicles_image/${vehicle.image[0].path}`
                  : "/emptyVehicle.png"
              }
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            <Image
              src={
                vehicle.image?.[1]?.path
                  ? `/vehicles_image/${vehicle.image[1].path}`
                  : "/emptyVehicle.png"
              }
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md"
            />
            {/* {vehicle.media?.items && (
              
            )} */}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{vehicle.name}</span>
            <span className="font-semibold">
              RM{vehicle.price.toFixed(2)}/days
            </span>
          </div>
          {/* {vehicle.additionalInfoSections && (
            <div
              className="text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  vehicle.additionalInfoSections.find(
                    (section: any) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            ></div>
          )} */}
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-blue-700">
            View Details
          </button>
        </Link>
      ))}
      {/* {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={res.currentPage || 0}
          hasPrev={res.hasPrev()}
          hasNext={res.hasNext()}
        />
      ) : null} */}
      {vehicleList?.length! % 4 !== 0 && (
        <div className="w-[22%] min-w-[250px] invisible"></div>
      )}
      <PaginationComponent pageCount={10} />
    </div>
  );
};

export default VehicleList;
