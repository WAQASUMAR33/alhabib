"use client";
import { useParams } from "next/navigation";
import Flights from "../Flights";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const FlightSearchBar = () => {
  const [group , setgroup]= useState('null')
  const [loading, setloading]= useState(false)
  const params = useParams();
  const slug = params.slug;
  console.log(slug);
  async function getFlightData() {
    setloading(true)
    const response = await fetch(`/api/user/fetchgroup/${slug}`);
    const data = await response.json();
    console.log("data",data.data);
    setgroup(data.data);
    setloading(false)
  }
  useEffect(() => {
    async function fetchData() {
      await getFlightData();
    }
    fetchData();
  }, [slug]);
  return (
    <div className="w-full flex flex-col">
      {/* {loading&& <Loader className="animate-spin"/>} */}
      <div className="flex justify-center items-center">
        <h2 className="text-3xl font-semibold">
          {group.title}
        </h2>
        </div>
      <div>
      <Flights group={slug}/>
      </div>
    </div>
  );
};

export default FlightSearchBar;
