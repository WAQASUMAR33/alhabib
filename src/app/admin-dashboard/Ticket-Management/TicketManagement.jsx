'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';
import { Eye, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader } from 'lucide-react'; // Import loading icon
import 'react-toastify/dist/ReactToastify.css';

// Fetch all users
const fetchTickets = async () => {
  const response = await fetch('/api/admin/tickets');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

// Add a new user
const addTicket = async (tickets) => {
  const response = await fetch('/api/admin/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tickets),
  });
  if (!response.ok) {
    throw new Error('Failed to add ticket');
  }
  return response.json();
};

// Update an existing user
const updateTicket = async (tickets) => {
  const response = await fetch(`/api/admin/tickets/${tickets.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tickets),
  });
  if (!response.ok) {
    throw new Error('Failed to update ticket');
  }
  return response.json();
};

// Delete a user
const deleteTicket = async (id) => {
  const response = await fetch(`/api/admin/tickets/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete ticket');
  }
  return true;
};

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [filteredtickets, setFilteredtickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentticket, setCurrentticket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [ticketimage, setticketimage] = useState('');
  // const [showPassword, setShowPassword] = useState(false); // Track password visibility


  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredtickets(
      tickets.filter(
        (tickets) =>
          tickets.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tickets.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [tickets, searchTerm]);  

  const handleAddTicket = () => {
    setCurrentticket(null);
    setIsModalOpen(true);
  };

  const handleUpdateTicket = (user) => {
    setCurrentticket(user);
    setIsModalOpen(true);
  };

  const handleimagechange = (e) => {
    // console.log("Handle image change function is called..");
    const selectedfile = e.target.files[0];
    // console.log("Selected file is :", selectedfile);
    if (selectedfile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagedata = e.target.result;
        // console.log("Image data is : ", imagedata);
        const dataurl = `data:image/jpeg;base64,${btoa(imagedata)}`;
        console.log("image data is : ", dataurl);
        setticketimage(dataurl);
      };
    
      reader.readAsBinaryString(selectedfile);
  }
  }
  const handleDeleteTicket = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setLoadingAction(id);
      try {
        await deleteTicket(id);
        const updatedTickets = await fetchTickets();
        setTickets(updatedTickets);
        toast.success('Ticket deleted successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
      formData.append('image',ticketimage);
    const ticketData = Object.fromEntries(formData.entries());

    setLoadingAction('form');
    try {
      if (currentticket) {
        const updated = await updateTicket({ ...currentticket, ...ticketData });
        toast.success('Ticket updated successfully');
      } else {
        const newTicket = await addTicket(ticketData);
        toast.success('Ticket added successfully');
      }
      // Fetch updated user list
      const updatedTicket = await fetchTickets();
      setTickets(updatedTicket);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  // const approveUser = async (id) => {
  //   const response = await fetch(`/api/admin/user/approve/${id}`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  //   if (!response.ok) {
  //     throw new Error('Failed to approve user');
  //   }
  //   return response.json();
  // };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddTicket} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[500px]">
              <DialogHeader>
                <DialogTitle>{currentticket ? 'Update Ticket' : 'Add Ticket'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="">
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  {['title', 'description', 'amount'].map((field) => (
                    <div key={field} className='relative'>
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type='text'
                        name={field}
                        defaultValue={currentticket?.[field]}
                      />
                    </div>
                  ))}

                  <div key='image' className='relative'>
                    <label htmlFor='image' className="block text-sm font-medium">
                      Image
                    </label>
                    <Input
                      type='file'
                      name='image'
                      onChange={handleimagechange}
                      // defaultValue={currentticket?.[image]}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentticket ? 'Update' : 'Add'} Ticket
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[72vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredtickets.map((tickets, index) => (
                  <TableRow key={tickets.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{tickets.image ?
                      <img src={decodeURIComponent(tickets.image)} className='w-24 h-24'></img> :
                      <img src='/logo/logo1.jpg' className='w-24 h-24'></img>
                    }
                    </TableCell>
                    <TableCell>{tickets.title}</TableCell>
                    <TableCell>{tickets.description}</TableCell>
                    <TableCell>{tickets.amount}</TableCell>
                    <TableCell>{tickets.created_at}</TableCell>
                    <TableCell>{tickets.updated_at}</TableCell>

                    <TableCell>
                      <Button onClick={() => handleUpdateTicket(tickets)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteTicket(tickets.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === tickets.id}
                      >
                        {loadingAction === tickets.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
                      {/* <Button
                        onClick={() => handleApproveUser(user.id)}
                        variant="ghost"
                        className="text-blue-600"
                        disabled={loadingAction === user.id || user.status === 'Approved'}
                      >
                        {loadingAction === user.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          'Approve'
                        )}
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
