"use client";

import VehicleImages from "@/components/VehicleImages";
import { VehicleModel } from "@/model/Model";
import { notFound } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const SingleVehiclePage = ({ params }: { params: { id: number } }) => {
  const [vehicle, setVehicle] = useState<VehicleModel>();

  useEffect(() => {
    const fetchVehicle = async () => {
      const query = await fetch("api/Vehicle/GetById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: params.id }),
      });
      const response = await query.json();
      setVehicle(response);
      console.log(response);
    };
    fetchVehicle();
  }, []);
  console.log(vehicle);
//   if (!vehicle) {
//     return notFound();
//   }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <VehicleImages items={vehicle.image} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{vehicle.name}</h1>
        <p className="text-gray-500">{vehicle.desc}</p>
        <div className="h-[2px] bg-gray-100" />
        RM{vehicle.price}/per days
        {/* {vehicle.price === vehicle.price?.discountedPrice ? (
          <h2 className="font-medium text-2xl">${vehicle.price?.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${vehicle.price?.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ${vehicle.price?.discountedPrice}
            </h2>
          </div>
        )} */}
        {/* <div className="h-[2px] bg-gray-100" />
        {vehicle.variants && vehicle.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add
            productId={product._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product.stock?.quantity || 0}
          />
        )} */}
        {/* <div className="h-[2px] bg-gray-100" />
        {vehicle.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <p>{section.description}</p>
          </div>
        ))}
        <div className="h-[2px] bg-gray-100" />
        REVIEWS
        <h1 className="text-2xl">User Reviews</h1>
        <Suspense fallback="Loading...">
          <Reviews vehicleId={vehicle._id!} />
        </Suspense> */}
      </div>
    </div>
  );
};

export default SingleVehiclePage;
