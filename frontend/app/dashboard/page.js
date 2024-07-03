"use client"
import React, { useState } from 'react'
import MonthSelection from './_components/MonthSelection'
import SektorSelect from './_components/SektorSelect'
import TabelKehadiran from './_components/TabelKehadiran'
import { Button } from '@/components/ui/button'

function Dashboard({ tabelKehadiran: initialTabelKehadiran, selectedMonth: initialSelectedMonth, selectedSektor: initialSelectedSektor }) {

  const [selectedMonth, setSelectedMonth] = useState(initialSelectedMonth);
  const [selectedSektor, setSelectedSektor] = useState(''); // Initialize with an empty string
  const [selectedIdTeknisi, setSelectedIdTeknisi] = useState(''); // Initialize with an empty string
  const [tabelKehadiran, setTabelKehadiran] = useState(initialTabelKehadiran);
  const [searchParams, setSearchParams] = useState({ month: initialSelectedMonth, sektor: '', idTeknisi: '' });

  const handleSearch = () => {
    setSearchParams({ month: selectedMonth, sektor: selectedSektor, idTeknisi: selectedIdTeknisi });
  };

  return (
    <div className='p-7'>
        <h2 className='font-bold text-2xl flex justify-between items-center'>Kehadiran</h2>
        <div className='flex gap-4 p-4 border rounded-lg shadow-sm'>
          <div className='flex gap-2 items-center'>
            <label>Pilih Bulan:</label>
            <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
          </div>
          <div className='flex gap-2 items-center'>
            <label>Pilih Sektor:</label>
            <SektorSelect selectedSektor={(value) => setSelectedSektor(value)} />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
        
        <div className='mt-4'>
          <TabelKehadiran tabelKehadiran={tabelKehadiran}
            selectedMonth={searchParams.month}
            selectedSektor={searchParams.sektor}
            selectedIdTeknisi={searchParams.idTeknisi} />
        </div>
    </div>
  )
  
}

export default Dashboard