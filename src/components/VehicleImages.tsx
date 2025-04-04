"use client";

import Image from "next/image";
import { useState } from "react";

const VehicleImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);
  return (
    <div className="">
      <div className="h-[500px] relative">

        <Image
          src={items[index] ? `${items[index].path}`: "/emptyVehicle.png"}
          alt=""
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item:any, i:number) => (
          <div
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
            key={i}
            onClick={() => setIndex(i)}
          >
            <span>{typeof(item.path)}</span>
            <Image
              src={item.path ? `${item.path}`: "/emptyVehicle.png"}
              alt=""
              fill
              sizes="30vw"
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default VehicleImages;
