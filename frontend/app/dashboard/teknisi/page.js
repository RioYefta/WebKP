import React from 'react'
import TambahTeknisi from './_components/TambahTeknisi'
import TabelTeknisi from './_components/TabelTeknisi'

function Teknisi() {
    
  return (
    <div className='p-7'>
        <h2 className='font-bold text-2xl flex justify-between items-center'>Teknisi
        <TambahTeknisi/>
        </h2>
        <TabelTeknisi />
    </div>
  )
}

export default Teknisi