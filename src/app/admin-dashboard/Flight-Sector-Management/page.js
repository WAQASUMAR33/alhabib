'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
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

const fetchSectors = async () => {
  const response = await fetch('/api/admin/flight-sectors');
  if (!response.ok) {
    throw new Error('Failed to fetch flight sectors');
  }
  return response.json();
};

const addSector = async (sector) => {
  const response = await fetch('/api/admin/flight-sectors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sector),
  });
  if (!response.ok) {
    throw new Error('Failed to add sector');
  }
  return response.json();
};

const updateSector = async (sector) => {
  const response = await fetch(`/api/admin/flight-sectors/${sector.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sector),
  });
  if (!response.ok) {
    throw new Error('Failed to update sector');
  }
  return response.json();
};

const deleteSector = async (id) => {
  const response = await fetch(`/api/admin/flight-sectors/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete sector');
  }
  return true;
};

export default function SectorManagement() {
  const [sectors, setSectors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState(null);
  const [selectedType, setSelectedType] = useState('one-way');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchSectors()
      .then(setSectors)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddSector = () => {
    setSelectedType('one-way');
    setCurrentSector(null);
    setIsModalOpen(true);
  };

  const handleUpdateSector = (sector) => {
    setSelectedType(sector.type);
    setCurrentSector(sector);
    setIsModalOpen(true);
  };

  const handleDeleteSector = async (id) => {
    if (window.confirm('Are you sure you want to delete this sector?')) {
      setLoadingAction(id);
      try {
        await deleteSector(id);
        const updatedSectors = await fetchSectors();
        setSectors(updatedSectors);
        toast.success('Sector deleted successfully');
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
    const sectorData = Object.fromEntries(formData.entries());
    if (selectedType === 'one-way') {
      delete sectorData.to2;
    }
    sectorData.type = selectedType;

    setLoadingAction('form');
    try {
      if (currentSector) {
        await updateSector({ ...currentSector, ...sectorData });
        toast.success('Sector updated successfully');
      } else {
        await addSector(sectorData);
        toast.success('Sector added successfully');
      }
      const updatedSectors = await fetchSectors();
      setSectors(updatedSectors);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddSector} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Sector
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {currentSector ? 'Update Sector' : 'Add Sector'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium">
                      Type
                    </label>
                    <select
                      name="type"
                      value={selectedType}
                      className="w-full border rounded p-2"
                      onChange={handleTypeChange}
                    >
                      <option value="one-way">One-Way</option>
                      <option value="two-way">Two-Way</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="from" className="block text-sm font-medium">
                      From
                    </label>
                    <Input
                      type="text"
                      name="from"
                      defaultValue={currentSector?.from || ''}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="to" className="block text-sm font-medium">
                      To
                    </label>
                    <Input
                      type="text"
                      name="to"
                      defaultValue={currentSector?.to || ''}
                      required
                    />
                  </div>
                  {selectedType === 'two-way' && (
                    <div>
                      <label
                        htmlFor="to2"
                        className="block text-sm font-medium"
                      >
                        To (Return)
                      </label>
                      <Input
                        type="text"
                        name="to2"
                        defaultValue={currentSector?.to2 || ''}
                      />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loadingAction === 'form'}
                >
                  {loadingAction === 'form' && (
                    <Loader className="mr-2 animate-spin" />
                  )}
                  {currentSector ? 'Update' : 'Add'} Sector
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
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>To (Return)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectors.map((sector, index) => (
                  <TableRow key={sector.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sector.type}</TableCell>
                    <TableCell>{sector.from}</TableCell>
                    <TableCell>{sector.to}</TableCell>
                    <TableCell>{sector.to2 || '-'}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleUpdateSector(sector)}
                        variant="ghost"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSector(sector.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === sector.id}
                      >
                        {loadingAction === sector.id ? (
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
