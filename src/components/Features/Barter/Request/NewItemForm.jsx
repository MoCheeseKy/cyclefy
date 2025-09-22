import { useState, useEffect } from 'react';
import axios from 'axios';

// Import komponen dari Shadcn/UI
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; // <-- Import Button
import { UploadCloud, X } from 'lucide-react'; // <-- Import X icon

export default function NewItemForm({ formData, setFormData, errors }) {
  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [phones, setPhones] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('cyclefy_user_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchDataForDropdowns = async () => {
      try {
        const [categoryRes, addressRes, phoneRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/categories`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/users/current/addresses`, {
            headers,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/users/current/phones`, {
            headers,
          }),
        ]);
        setCategories(categoryRes.data.data || []);
        setAddresses(addressRes.data.data || []);
        setPhones(phoneRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };
    fetchDataForDropdowns();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Validasi bisa ditambahkan di sini (misal: jumlah & ukuran file)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5),
    }));
  };

  // <-- FUNGSI BARU UNTUK MENGHAPUS GAMBAR -->
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <div className='p-4 space-y-4 bg-white border rounded-md'>
      <div>
        <Label htmlFor='itemName'>Item Name</Label>
        <Input
          id='itemName'
          placeholder='Enter item name...'
          value={formData.itemName}
          onChange={handleInputChange}
        />
        {errors.itemName && (
          <p className='mt-1 text-sm text-red-500'>{errors.itemName}</p>
        )}
      </div>
      <div>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          placeholder='Enter a brief description...'
          value={formData.description}
          onChange={handleInputChange}
        />
        {errors.description && (
          <p className='mt-1 text-sm text-red-500'>{errors.description}</p>
        )}
      </div>
      <div>
        <Label htmlFor='categoryId'>Item Category</Label>
        <Select
          onValueChange={(value) => handleSelectChange(value, 'categoryId')}
          value={formData.categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className='mt-1 text-sm text-red-500'>{errors.categoryId}</p>
        )}
      </div>

      <div>
        <Label htmlFor='addressId'>Address</Label>
        <Select
          onValueChange={(value) => handleSelectChange(value, 'addressId')}
          value={formData.addressId}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select your address' />
          </SelectTrigger>
          <SelectContent>
            {addresses.map((addr) => (
              <SelectItem key={addr.id} value={String(addr.id)}>
                {addr.address_name} - {addr.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.addressId && (
          <p className='mt-1 text-sm text-red-500'>{errors.addressId}</p>
        )}
      </div>

      <div>
        <Label htmlFor='phoneId'>Contact Number</Label>
        <Select
          onValueChange={(value) => handleSelectChange(value, 'phoneId')}
          value={formData.phoneId}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select your contact number' />
          </SelectTrigger>
          <SelectContent>
            {phones.map((phone) => (
              <SelectItem key={phone.id} value={String(phone.id)}>
                {phone.number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.phoneId && (
          <p className='mt-1 text-sm text-red-500'>{errors.phoneId}</p>
        )}
      </div>

      <div>
        <Label htmlFor='file-upload'>Upload Image</Label>
        <div className='flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-dashed rounded-md'>
          <div className='space-y-1 text-center'>
            <UploadCloud className='w-12 h-12 mx-auto text-gray-400' />
            <label
              htmlFor='file-upload'
              className='relative font-medium text-indigo-600 rounded-md cursor-pointer hover:text-indigo-500'
            >
              <span>Add File</span>
              <input
                id='file-upload'
                name='file-upload'
                type='file'
                className='sr-only'
                multiple
                onChange={handleImageChange}
                accept='image/png, image/jpeg'
              />
            </label>
            <p className='text-xs text-gray-500'>JPEG/PNG. Max 5 MB</p>
          </div>
        </div>
        {errors.images && (
          <p className='mt-1 text-sm text-red-500'>{errors.images}</p>
        )}
      </div>

      {/* <-- BAGIAN BARU UNTUK MENAMPILKAN LIST GAMBAR --> */}
      {formData.images.length > 0 && (
        <div className='space-y-2'>
          {formData.images.map((file, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-2 text-sm bg-gray-100 rounded-md'
            >
              <p className='truncate'>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='w-6 h-6'
                onClick={() => removeImage(index)}
              >
                <X className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* <-- AKHIR BAGIAN BARU --> */}
    </div>
  );
}
