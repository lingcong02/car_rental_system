"use client";

import { VehicleModelModel } from "@/model/Model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [vehicleModelList, setVehicleModelList] = useState<VehicleModelModel[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("api/VehicleModel/GetAll", {
        method: "GET",
      });
      const result = await response.json();
      setVehicleModelList(result);
    };
    fetchData();
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-6 flex-wrap">
        <select
          name="model"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
        >
          <option>Model</option>
          {vehicleModelList.map((vehicleModel: VehicleModelModel) => (
            <option key={vehicleModel.id} value={vehicleModel.id}>{vehicleModel.desc}</option>
          ))}
        </select>
        <input
          type="text"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={handleFilterChange}
        />
      </div>
      <div className="">
        <select
          name="sortType"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400"
          onChange={handleFilterChange}
        >
          <option>Sort By</option>
          <option value="asc-price">Price (low to high)</option>
          <option value="desc-price">Price (high to low)</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
