import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function TwoCards(){
    return(
        <>
        <div className="md:max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 md:my-10 p-2">
        <div className="grid grid-cols-2 w-full  bg-blue-600 rounded-lg  md:h-[40vh]">
                <div className="flex flex-col justify-between items-start py-4 md:py-12 px-4 md:px-10 font-bold text-white text-xl md:text-3xl md:h-[30vh] my-auto ">
                    <h1>Special Offer <br></br> 50% OFF</h1>
                    <p className="text-sm md:text-lg font-normal">Special Hot Deals</p>
                    <Button className="bg-white text-black hover:text-white mt-1">Learn More</Button>
                    
                    </div>
                    <div className="flex justify-center items-center text-white ">
                    <Plane className="size-20 "/>
                </div>
                </div>
                <div className="grid grid-cols-2 w-full  bg-orange-600 rounded-lg  md:h-[40vh]">
                <div className="flex flex-col justify-between items-start py-4 md:py-12 px-4 md:px-10 font-bold text-white text-xl md:text-3xl md:h-[30vh] my-auto">
                    <h1>Get 50% OFF</h1>
                    <p className="text-sm md:text-lg font-normal">Lets Explore the World</p>
                    <Button className="bg-white text-black hover:text-white ">Book Now</Button>
                    
                    </div>
                    <div className="flex justify-center items-center text-white ">
                    <Plane className="size-20 "/>
                </div>
                </div>
               

        </div>
        </>
    )
}