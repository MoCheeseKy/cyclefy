import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialValue,
}) {
  const [addressName, setAddressName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (initialValue) {
      setAddressName(initialValue.address_name || '');
      setAddress(initialValue.address || '');
    } else {
      setAddressName('');
      setAddress('');
    }
  }, [initialValue]);

  const handleSave = () => {
    onSave({ address_name: addressName, address });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialValue?.id ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
        </DialogHeader>
        <div className='py-4 space-y-4'>
          <div>
            <Label htmlFor='address-name'>Address Name</Label>
            <Input
              id='address-name'
              value={addressName}
              onChange={(e) => setAddressName(e.target.value)}
              placeholder='e.g., Home, Office'
            />
          </div>
          <div>
            <Label htmlFor='address-detail'>Address</Label>
            <Input
              id='address-detail'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Enter full address'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
