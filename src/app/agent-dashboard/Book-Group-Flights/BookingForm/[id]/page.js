'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { format } from 'date-fns';
import { Table, TableBody, TableHeader, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Loader } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function BookingForm() {
    const params = useParams()
    const { id } = params;
    const [flightdata, setFlightdata] = useState('')
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [passengers, setPassengers] = useState([]);
    const [agentRemarks, setRemarks] = useState('')
    const [fieldsVisible, setFieldsVisible] = useState(false);
    const userid = useSelector((data) => data.user.id);
    const [loading, setLoading] = useState(false);
    const [userdata, setUserData] = useState([])


    async function fetchflight() {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/fetchgroupflights/${id}`);
            const result = await response.json();
            setFlightdata(result.data);
        } catch (error) {
            toast.error('Failed to fetch flights');
            // console.error("Error fetching flight data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchuserdetails() {
        setLoading(true);
        try {
            const response = await fetch(`/api/user/${userid}`);
            const result = await response.json();
            setUserData(result);
        } catch (error) {
            toast.error('Error fetching user details');
            
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchflight();
        fetchuserdetails();
    }, [id])

    const handleConfirm = () => {
        // Calculate the total passengers to be added
        const totalNewPassengers =
            adults +
            children +
            infants;

        const totalSeats = flightdata.seats || 0; // Use the first flight's seats for now

        if (passengers.length + totalNewPassengers > totalSeats) {
            alert(`Only ${totalSeats} seats are available`);
            return;
        }

        const newPassengers = [];

        const existingAdults = passengers.filter(p => p.type === "Adult").length;
        const existingChildren = passengers.filter(p => p.type === "Child").length;
        const existingInfants = passengers.filter(p => p.type === "Infant").length;

        for (let i = existingAdults; i < adults; i++) {
            newPassengers.push({ type: "Adult", surname: "", givenName: "", title: "Mr/Mrs", passport: "", dob: "", doe: "" });
        }
        for (let i = existingChildren; i < children; i++) {
            newPassengers.push({ type: "Child", surname: "", givenName: "", title: "CHD", passport: "", dob: "", doe: "" });
        }
        for (let i = existingInfants; i < infants; i++) {
            newPassengers.push({ type: "Infant", surname: "", givenName: "", title: "INF", passport: "", dob: "", doe: "" });
        }

        // Retain existing data and append new fields
        setPassengers(prevPassengers => [...prevPassengers, ...newPassengers]);
        setFieldsVisible(true);
    };



    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][field] = value;
        setPassengers(updatedPassengers);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const bookingData = {
                flightgroup_id: flightdata.FlightGroups?.id,
                flightsector_id: flightdata.FlightSector?.id,
                flightairline_id: flightdata.FlightAirline?.id,
                flight_id: flightdata.id,
                agent_id: userid,
                agentRemarks,
                adults,
                children,
                infants,
                passengers,
            };

            try {
                const response = await fetch('/api/user/makegroupflightbooking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData),
                });

                if (response.ok) {
                    const result = await response.json();
                    toast.success(result.message || 'Booking deleted successfully');
                    console.log('Booking Result:', result);
                    window.location.href = '/agent-dashboard/Flight-Bookings'; // Redirect to /my booking
                }
                else {
                    const result = await response.json();
                    toast.error(result.message || 'Booking deleted successfully');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error submitting booking:', error);
                toast.error(error || 'Booking Failed');
                setLoading(false);
            }
        }
        finally {
            setLoading(false);
        }
    };

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center w-full h-full">
    //             <Loader className="animate-spin w-8 h-8 text-blue-500" />
    //         </div>
    //     );
    // }

    return (
        <div className="flex flex-col bg-[#f1f6f9] w-full h-full rounded">
<ToastContainer />
            <div className="flex flex-col m-2">
                <div><h1 className="text-3xl text-left font-bold ">New Booking</h1></div>
                <div className="p-4 border rounded-lg bg-white mt-4">
                    <div className="w-full"><h2 className="text-xl pb-2 font-[600]">Flight Information</h2></div>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader className="animate-spin w-8 h-8 text-blue-500" />
                        </div>
                    ) : (
                        <div>
                            <Table>
                                <TableHeader className="bg-blue-400 text-white">
                                    <TableRow>
                                        <TableCell>Airline</TableCell>
                                        <TableCell>Airline SN</TableCell>
                                        <TableCell>Meal</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Fare</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{flightdata.FlightAirline?.name}</TableCell>
                                        <TableCell>{flightdata.FlightAirline?.sn}</TableCell>
                                        <TableCell>{flightdata.meal ? "Yes" : "No"}</TableCell>
                                        <TableCell>{flightdata.FlightSector?.type}</TableCell>
                                        <TableCell>{flightdata.fare}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableHeader className="bg-blue-400 text-white ">
                                    <TableRow>
                                        <TableCell>Flight No.</TableCell>
                                        <TableCell>Flight Date</TableCell>
                                        <TableCell>Origin</TableCell>
                                        <TableCell>Destination</TableCell>
                                        <TableCell>Departure</TableCell>
                                        <TableCell>Arrival</TableCell>
                                        <TableCell>Baggage</TableCell>
                                        <TableCell>Seats</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {flightdata && (<>
                                            <TableRow key='1'>
                                                <TableCell>{flightdata.flight_number}</TableCell>
                                                <TableCell>{format(new Date(flightdata.flight_date), 'MMMM do yyyy')}</TableCell>
                                                <TableCell>{flightdata.origin}</TableCell>
                                                <TableCell>{flightdata.destination}</TableCell>
                                                <TableCell>{format(new Date(flightdata.dept_time), 'h:mm a')}</TableCell>
                                                <TableCell>{format(new Date(flightdata.arrival_time), 'h:mm a')}</TableCell>
                                                <TableCell>{flightdata.baggage}</TableCell>
                                                <TableCell>{flightdata.seats}</TableCell>
                                            </TableRow>
                                            {flightdata.FlightSector?.type === "two-way" && (
                                            <TableRow key='2'>
                                                <TableCell>{flightdata.flight_number2}</TableCell>
                                                <TableCell>{format(new Date(flightdata.flight_date2), 'MMMM do yyyy')}</TableCell>
                                                <TableCell>{flightdata.origin2}</TableCell>
                                                <TableCell>{flightdata.destination2}</TableCell>
                                                <TableCell>{format(new Date(flightdata.dept_time2), 'h:mm a')}</TableCell>
                                                <TableCell>{format(new Date(flightdata.arrival_time2), 'h:mm a')}</TableCell>
                                                <TableCell>{flightdata.baggage}</TableCell>
                                                <TableCell>{flightdata.seats}</TableCell>
                                            </TableRow>
                                            )}
                                            </>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                <div className="p-4 border rounded-lg bg-white mt-4">
                    <div className="w-full"><h2 className="text-xl pb-2 font-[600]">Agency Information</h2></div>
                    <div className="grid grid-cols-3 gap-4 text-xl ">
                        <div className="bg-gray-200/80 rounded-lg p-4">
                            <h3 className="font-bold">Agency Name</h3>
                            <span>{userdata?.bname}</span>

                        </div>
                        <div className="bg-gray-200/80 rounded-lg p-4">
                            <h3 className="font-bold">Email Address</h3>
                            <span>{userdata?.username}</span>

                        </div>
                        <div className="bg-gray-200/80 rounded-lg p-4">
                            <h3 className="font-bold">Mobile Number</h3>
                            <span>{userdata?.phoneno}</span>
                        </div>
                    </div>
                    <div className="mt-2">
                        <Label className="text-lg font-bold">Agent Remarks</Label>
                        <Input type='text' className="border border-gray-600" value={agentRemarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add details hero..." />
                    </div>
                </div>
                <div className="p-4 border rounded-lg bg-white mt-4">
                    <h2 className="text-xl pb-2 font-[600]">Make Booking</h2>
                    <div className="grid grid-cols-4 gap-4 text-xl">
                        <div>
                            <Label className="text-lg font-bold">Adults</Label>
                            <Input type="number" value={adults} onChange={(e) => setAdults(Number(e.target.value))} placeholder="0" className="border border-gray-600" />
                        </div>
                        <div>
                            <Label className="text-lg font-bold">Children</Label>
                            <Input type="number" value={children} onChange={(e) => setChildren(Number(e.target.value))} placeholder="0" className="border border-gray-600" />
                        </div>
                        <div>
                            <Label className="text-lg font-bold">Infants</Label>
                            <Input type="number" value={infants} onChange={(e) => setInfants(Number(e.target.value))} placeholder="0" className="border border-gray-600" />
                        </div>
                        <div className="flex flex-col justify-end">
                            <Button onClick={handleConfirm}>Confirm</Button>
                        </div>
                    </div>
                </div>


                {fieldsVisible && (
                    <div className="p-4 border rounded-lg bg-white mt-4">
                        <h2 className="text-xl pb-2 font-[600]">Passenger Information</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader className="animate-spin w-8 h-8 text-blue-500" />
                            </div>
                        ) : (
                            <>
                                {passengers.map((passenger, index) => (
                                    <div key={index}>
                                        <Label className="text-lg font-bold">
                                            {index + 1}. {passenger.type}
                                        </Label>
                                        <div className="grid grid-cols-6 gap-4 mb-4">
                                            <div>
                                                <Label>Surname</Label>
                                                <Input
                                                    placeholder="Surname"
                                                    value={passenger.surname}
                                                    onChange={(e) => handlePassengerChange(index, "surname", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Given Name</Label>
                                                <Input
                                                    placeholder="Given Name"
                                                    value={passenger.givenName}
                                                    onChange={(e) => handlePassengerChange(index, "givenName", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Title</Label>
                                                <Input
                                                    placeholder="Title"
                                                    value={passenger.title}
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <Label>Passport</Label>
                                                <Input
                                                    placeholder="Passport"
                                                    value={passenger.passport}
                                                    onChange={(e) => handlePassengerChange(index, "passport", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Date of Birth (DOB)</Label>
                                                <Input
                                                    type="date"
                                                    placeholder="DOB"
                                                    value={passenger.dob}
                                                    onChange={(e) => handlePassengerChange(index, "dob", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Date of Expiry (DOE)</Label>
                                                <Input
                                                    type="date"
                                                    placeholder="DOE"
                                                    value={passenger.doe}
                                                    onChange={(e) => handlePassengerChange(index, "doe", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? <Loader className="animate-spin w-4 h-4 mr-2" /> : null}
                                    {loading ? 'Submitting...' : 'Submit Booking'}
                                </Button>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

