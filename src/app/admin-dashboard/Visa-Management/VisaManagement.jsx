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
const fetchVisa = async () => {
  const response = await fetch('/api/admin/visa');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

// Add a new user
const addVisa = async (visa) => {
  const response = await fetch('/api/admin/visa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visa),
  });
  if (!response.ok) {
    throw new Error('Failed to add visa');
  }
  return response.json();
};

// Update an existing user
const updateVisa = async (visa) => {
  const response = await fetch(`/api/admin/visa/${visa.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visa),
  });
  if (!response.ok) {
    throw new Error('Failed to update visa');
  }
  return response.json();
};

// Delete a user
const deleteVisa = async (id) => {
  const response = await fetch(`/api/admin/visa/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete visa');
  }
  return true;
};

export default function VisaManagement() {
  const [visa, setVisa] = useState([]);
  const [filteredvisa, setFilteredvisa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentpackage, setCurrentpackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [packageimage, setpackageimage] = useState('');
  // const [showPassword, setShowPassword] = useState(false); // Track password visibility


  useEffect(() => {
    fetchVisa()
      .then(setVisa)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredvisa(
      visa.filter(
        (visa) =>
          visa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visa.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [visa, searchTerm]);  

  const handleAddVisa = () => {
    setCurrentpackage(null);
    setIsModalOpen(true);
  };

  const handleUpdateVisa = (user) => {
    setCurrentpackage(user);
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
        setpackageimage(dataurl);
      };
    
      reader.readAsBinaryString(selectedfile);
  }
  }
  const handleDeleteVisa = async (id) => {
    if (window.confirm('Are you sure you want to delete this visa?')) {
      setLoadingAction(id);
      try {
        await deleteVisa(id);
        const updatedVisa = await fetchVisa();
        setVisa(updatedVisa);
        toast.success('Visa deleted successfully');
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
      formData.append('image',packageimage);
    const packageData = Object.fromEntries(formData.entries());

    setLoadingAction('form');
    try {
      if (currentpackage) {
        const updated = await updateVisa({ ...currentpackage, ...packageData });
        toast.success('Visa updated successfully');
      } else {
        const newVisa = await addVisa(packageData);
        toast.success('Visa added successfully');
      }
      // Fetch updated user list
      const updatedVisa = await fetchVisa();
      setVisa(updatedVisa);
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
            placeholder="Search visa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddVisa} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Visa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[500px]">
              <DialogHeader>
                <DialogTitle>{currentpackage ? 'Update Visa' : 'Add Visa'}</DialogTitle>
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
                        defaultValue={currentpackage?.[field]}
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
                      // defaultValue={currentpackage?.[image]}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentpackage ? 'Update' : 'Add'} Visa
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
                {filteredvisa.map((visa, index) => (
                  <TableRow key={visa.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{visa.image ?
                      <img src={decodeURIComponent(visa.image)} className='w-24 h-24'></img> :
                      <img src='/logo/logo1.jpg' className='w-24 h-24'></img>
                    }
                    </TableCell>
                    <TableCell>{visa.title}</TableCell>
                    <TableCell>{visa.description}</TableCell>
                    <TableCell>{visa.amount}</TableCell>
                    <TableCell>{visa.created_at}</TableCell>
                    <TableCell>{visa.updated_at}</TableCell>

                    <TableCell>
                      <Button onClick={() => handleUpdateVisa(visa)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteVisa(visa.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === visa.id}
                      >
                        {loadingAction === visa.id ? (
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
