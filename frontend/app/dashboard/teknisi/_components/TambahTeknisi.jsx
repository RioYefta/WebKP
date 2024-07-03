"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
  

function TambahTeknisi() {
    const [open,setOpen]=useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

  const onSubmit = async (data) => {
    console.log("FormData", data);
    setOpen(false); // Close the dialog immediately after form submission
    try {
      const response = await fetch('http://localhost:8081/teknisi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Teknisi berhasil ditambahkan!"); // Provide feedback to the user
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan teknisi."); // Provide error feedback
    }
  }
  return (
    <div>
        <Button onClick={()=>setOpen(true)}>Tambah Teknisi</Button>
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Tambah Teknisi</DialogTitle>
                <DialogDescription>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='py-2'>
                        <label>Nama Teknisi</label>
                        <Input placeholder='Cth. Rio Manullang' 
                        {...register('nama', {required: "*Isi Nama"})}
                        />
                        {errors.nama && <p className="text-red-500">{errors.nama.message}</p>}
                    </div>
                    <div className='flex flex-col py-2'>
                        <label>Crew</label>
                        <select className='p-3 border rounded-lg'
                        {...register('crew', {required: true})}>
                            <option value={'A6TRK1'}>A6TRK1</option>
                            <option value={'A6TRK2'}>A6TRK2</option>
                            <option value={'A6TRK3'}>A6TRK3</option>
                            <option value={'GTMTRK1'}>GTMTRK1</option>
                            <option value={'GTMTRK2'}>GTMTRK2</option>
                            <option value={'GTMTRK3'}>GTMTRK3</option>
                        </select>
                    </div>
                    <div className='flex flex-col py-2'>
                        <label>Sektor</label>
                        <select className='p-3 border rounded-lg'
                        {...register('sektor', {required: true})}>
                            <option value={'TARAKAN'}>TARAKAN</option>
                            <option value={'TANJUNG SELOR'}>TANJUNG SELOR</option>
                            <option value={'TANJUNG REDEB'}>TANJUNG REDEB</option>
                            <option value={'MALINAU'}>MALINAU</option>
                            <option value={'NUNUKAN'}>NUNUKAN</option>
                        </select>
                    </div>
                    <div className='flex gap-3 items-center justify-end mt-5'>
                        <Button onClick={()=>setOpen(false)} variant="ghost">Batal</Button>
                        <Button 
                        type="submit"
                        >Simpan</Button>
                    </div>
                    </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default TambahTeknisi