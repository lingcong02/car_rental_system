import Filter from "@/components/Filter";
import VehicleList from "@/components/VehicleList";
import Skeleton from "@/components/Skeleton";
import { Suspense } from "react";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  // const wixClient = await wixClientServer();

  // const cat = await wixClient.collections.getCollectionBySlug(
  //   searchParams.cat || "all-products"
  // );

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      <Filter />
      <Suspense fallback={<Skeleton />}>
        <VehicleList
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
};

export default ListPage;
