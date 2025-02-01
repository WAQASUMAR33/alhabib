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
const fetchPackages = async () => {
  const response = await fetch('/api/admin/packages');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

// Add a new user
const addPackage = async (packages) => {
  const response = await fetch('/api/admin/packages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packages),
  });
  if (!response.ok) {
    throw new Error('Failed to add package');
  }
  return response.json();
};

// Update an existing user
const updatePackage = async (packages) => {
  const response = await fetch(`/api/admin/packages/${packages.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packages),
  });
  if (!response.ok) {
    throw new Error('Failed to update package');
  }
  return response.json();
};

// Delete a user
const deletePackage = async (id) => {
  const response = await fetch(`/api/admin/packages/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete package');
  }
  return true;
};

export default function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [filteredpackages, setFilteredpackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentpackage, setCurrentpackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [packageimage, setpackageimage] = useState('');
  // const [showPassword, setShowPassword] = useState(false); // Track password visibility


  useEffect(() => {
    fetchPackages()
      .then(setPackages)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredpackages(
      packages.filter(
        (packages) =>
          packages.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          packages.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [packages, searchTerm]);  

  const handleAddPackage = () => {
    setCurrentpackage(null);
    setIsModalOpen(true);
  };

  const handleUpdatePackage = (user) => {
    setCurrentpackage(user);
    setIsModalOpen(true);
  };


  const uploadImage = async (imageFile) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: reader.result }),
          });
          if (!response.ok) throw new Error('Failed to upload image');
          const data = await response.json();
          console.log(data);
          resolve(data.image_url);
        } catch (error) {
          reject(error.message);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(imageFile);
    });
  };


  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      // Upload the image and get the URL
      setLoadingAction('image')
      const imageUrl = await uploadImage(file);
      setpackageimage(imageUrl);
      // toast.success('Image uploaded successfully!');
      setLoadingAction('')
    } catch (error) {
      toast.error(`Image upload failed: ${error}`);
    }
  };


  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setLoadingAction(id);
      try {
        await deletePackage(id);
        const updatedPackages = await fetchPackages();
        setPackages(updatedPackages);
        toast.success('Package deleted successfully');
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
        const updated = await updatePackage({ ...currentpackage, ...packageData });
        toast.success('Package updated successfully');
      } else {
        const newPackage = await addPackage(packageData);
        toast.success('Package added successfully');
      }
      // Fetch updated user list
      const updatedPackage = await fetchPackages();
      setPackages(updatedPackage);
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
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddPackage} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[500px]">
              <DialogHeader>
                <DialogTitle>{currentpackage ? 'Update Package' : 'Add Package'}</DialogTitle>
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
                      accept="image/*"
                      onChange={handleImageChange}
                      // defaultValue={currentpackage?.[image]}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'|| loadingAction=== 'image'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {/* {loadingAction === 'image' && <><Loader className="mr-2 animate-spin" /> Uploading Image</>} */}
                  {(currentpackage && loadingAction!=='form' && loadingAction!=='image' ) ? 'Update Package' : loadingAction === 'image' ? <><Loader className="mr-2 animate-spin" /> Uploading Image</>:'Add Package'} 
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
                {filteredpackages.map((packages, index) => (
                  
                  <TableRow key={packages.id}>
                    <TableCell>{index + 1}</TableCell>
                    
                    <TableCell className='size-28'>{packages.image ?

                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${packages.image}`} className='w-full h-full'></img> :
                      <img src='/logo/logo1.jpg' className='w-full h-full'></img>
                    }
                    </TableCell>
                    <TableCell>{packages.title}</TableCell>
                    <TableCell>{packages.description}</TableCell>
                    <TableCell>{packages.amount}</TableCell>
                    <TableCell>{packages.created_at}</TableCell>
                    <TableCell>{packages.updated_at}</TableCell>

                    <TableCell>
                      <Button onClick={() => handleUpdatePackage(packages)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeletePackage(packages.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === packages.id}
                      >
                        {loadingAction === packages.id ? (
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
