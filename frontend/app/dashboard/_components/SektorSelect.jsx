"use client"
import React, { useEffect, useState } from 'react'

function SektorSelect({ selectedSektor }) { // Destructure selectedSektor from props
  const [sektor, setSektor] = useState([]);

  useEffect(() => {
    // Fetch data from the 'sektor' table
    fetch('http://localhost:8081/sektor') // Update the URL to fetch from the 'sektor' table
      .then(response => response.json())
      .then(data => {
        // Extract 'namaSektor' from the data
        const sektorNames = data.map(item => item.namaSektor);
        setSektor(sektorNames);
      })
      .catch(error => console.error('Error fetching sectors:', error));
  }, []);

  return (
    <div>
      <select className='p-2 border rounded-lg'
        onChange={(e) => selectedSektor(e.target.value)}
        defaultValue=""
      >
        <option value="">Semua</option> {/* Option for all sectors */}
        {sektor.map((namaSektor, index) => (
          <option key={index} value={namaSektor}>{namaSektor}</option>
        ))}
      </select>
    </div>
  )
}

export default SektorSelect