'use client'
import {useState, useEffect } from "react";

export default function FlightGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getFlightGroups() {
        try {
            const response = await fetch("/api/user/getflightgroups");
            const data = await response.json();
            setGroups(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching flight groups:", error);
        }
    }
    useEffect(() => {
        setLoading(true);
        getFlightGroups();
        setLoading(false);
    }, []);
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <h1 className="text-4xl font-bold">Flight Groups</h1>
      <div className="flex space-x-4 mt-4">
        {groups.map((group, index) => (
            <a href={`/agent-dashboard/Book-Group-Flights/${group.id}`}
            key={index}
            className={`size-52 group cursor-pointer relative overflow-hidden rounded-xl border border-gray-500 flex flex-col`}
          >
            <div className="w-full h-full absolute inset-0 z-0"> <img className="w-full h-full object-cover" src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${group.image}`}></img></div>
            <div className="z-10 text-2xl font-bold flex justify-center items-center h-full text-white bg-black/20"> <h2 className="w-full px-2 py-2 group-hover:scale-[1.1] transition-all duration-500 bg-red-500/50 text-center">{group.title}</h2></div>
          </a>
          
        ))}

      </div>
    </div>
  );
}