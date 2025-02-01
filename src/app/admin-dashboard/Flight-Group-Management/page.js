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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const IMAGE_UPLOAD_API = 'https://alhabib.m3xtrader.com/uploadImage.php';

const fetchFlightGroups = async () => {
  const response = await fetch('/api/admin/flight-groups');
  if (!response.ok) {
    throw new Error('Failed to fetch flight groups');
  }
  return response.json();
};

const addFlightGroup = async (group) => {
  const response = await fetch('/api/admin/flight-groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  });
  if (!response.ok) {
    throw new Error('Failed to add flight group');
  }
  return response.json();
};

const updateFlightGroup = async (group) => {
  const response = await fetch(`/api/admin/flight-groups/${group.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  });
  if (!response.ok) {
    throw new Error('Failed to update flight group');
  }
  return response.json();
};

const deleteFlightGroup = async (id) => {
  const response = await fetch(`/api/admin/flight-groups/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete flight group');
  }
  return true;
};

export default function FlightGroupManagement() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchFlightGroups()
      .then(setGroups)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredGroups(
      groups.filter((group) =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [groups, searchTerm]);

  const handleAddGroup = () => {
    setCurrentGroup(null);
    setIsModalOpen(true);
  };

  const handleUpdateGroup = (group) => {
    setCurrentGroup(group);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Are you sure you want to delete this flight group?')) {
      setLoadingAction(id);
      try {
        await deleteFlightGroup(id);
        const updatedGroups = await fetchFlightGroups();
        setGroups(updatedGroups);
        toast.success('Flight group deleted successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingAction(null);
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const groupData = Object.fromEntries(formData.entries());
    setLoadingAction('form');

    try {
      if (imageFile) {
        groupData.image = await uploadImage(imageFile);
      }
      if (currentGroup) {
        await updateFlightGroup({ ...currentGroup, ...groupData });
        toast.success('Flight group updated successfully');
      } else {
        await addFlightGroup(groupData);
        toast.success('Flight group added successfully');
      }
      const updatedGroups = await fetchFlightGroups();
      setGroups(updatedGroups);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search flight groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddGroup} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Flight Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[500px]">
              <DialogHeader>
                <DialogTitle>{currentGroup ? 'Update Flight Group' : 'Add Flight Group'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['title'].map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type="text"
                        name={field}
                        defaultValue={currentGroup?.[field] || ''}
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium">
                      Upload Image
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentGroup ? 'Update' : 'Add'} Flight Group
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
                  <TableHead>Title</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group, index) => (
                  <TableRow key={group.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{group.title}</TableCell>
                    <TableCell>
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${group.image}`} alt={group.title} className="h-10 w-10 object-cover" />
                    </TableCell>   
                    <TableCell>
                      <Button onClick={() => handleUpdateGroup(group)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteGroup(group.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === group.id}
                      >
                        {loadingAction === group.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
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
