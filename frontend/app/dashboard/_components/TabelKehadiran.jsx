"use client"
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import moment from 'moment';
import { Button } from '@/components/ui/button';

function TabelKehadiran({ tabelKehadiran, selectedMonth, selectedSektor, selectedIdTeknisi }) { // Update props

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // State for success message

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8081/teknisi-details');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData(); 

  }, []);

  useEffect(() => {
    // Log selectedMonth, selectedSektor, and selectedIdTeknisi to verify they are being received
    console.log('Selected Month:', selectedMonth);
    console.log('Selected Sektor:', selectedSektor);
    console.log('Selected IdTeknisi:', selectedIdTeknisi);

    // Initialize status for each day of the month
    const selectedMonthMoment = moment(selectedMonth);
    const numberOfDays = selectedMonthMoment.daysInMonth();
    const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

    // Group data by idTeknisi, sektor, and namaTeknisi
    const groupedData = data.reduce((acc, item) => {
      const key = `${item.idTeknisi}-${item.sektor}-${item.namaTeknisi}`;
      if (!acc[key]) {
        acc[key] = {
          ...item,
          days: {}
        };
      }
      if (moment(item.date).isSame(selectedMonthMoment, 'month')) {
        const day = moment(item.date).date();
        acc[key].days[day] = item.status;
      }
      return acc;
    }, {});

    // Map data to include status in day columns
    const mappedData = Object.values(groupedData).map(item => {
      const newItem = { ...item };
      daysArray.forEach(day => {
        newItem[`day${day}`] = item.days[day] || '';
      });
      return newItem;
    });

    // Filter mapped data based on selectedSektor and selectedIdTeknisi
    let filtered = mappedData;
    if (selectedSektor) {
      filtered = filtered.filter(item => item.sektor === selectedSektor);
    }
    if (selectedIdTeknisi) {
      filtered = filtered.filter(item => item.idTeknisi === selectedIdTeknisi);
    }

    setFilteredData(filtered);
  }, [selectedMonth, selectedSektor, selectedIdTeknisi, data]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const statusMap = {
    'PAGI': 'P',
    'SIANG': 'S',
    'MALAM': 'M',
    'OFF': 'OFF'
  };

  const reverseStatusMap = {
    'P': 'PAGI',
    'S': 'SIANG',
    'M': 'MALAM',
    'OFF': 'OFF'
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const numberOfDays = daysInMonth(moment(selectedMonth).year(), moment(selectedMonth).month());
  const daysArrays = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  const [colDefs, setColDefs] = useState([
    { field: "sektor" },
    { field: "crew" },
    { field: "namaTeknisi" },
    ...daysArrays.map(day => ({
      field: `day${day}`,
      headerName: `${day}`,
      width: 60,
      editable: true, // Make the cell editable
      cellEditor: 'agSelectCellEditor', // Use ag-Grid's select cell editor
      cellEditorParams: {
        values: Object.keys(statusMap) // Options for the select
      },
      valueFormatter: params => statusMap[params.value] || params.value, // Display initials
      valueParser: params => reverseStatusMap[params.newValue] || params.newValue, // Convert initials back to full value
      cellRendererFramework: params => (
        <div style={{ border: '1px solid #ccc', padding: '2px', borderRadius: '4px', position: 'relative' }}>
          <select
            value={params.value}
            onChange={e => {
              const newValue = e.target.value;
              params.node.setDataValue(params.colDef.field, newValue);
            }}
            style={{ width: '100%', border: 'none', appearance: 'none', background: 'transparent' }}
          >
            {Object.keys(statusMap).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)' }}>
            ▼
          </div>
        </div>
      )
    }))
  ]);

  const [rowData, setRowData] = useState();
  useEffect(() => {
    filteredData && setRowData(filteredData);
  }, [filteredData]);

  return (
    <div>
      {message && <div className="success-message">{message}</div>} {/* Display success message */}
      <div
        className="ag-theme-quartz"
        style={{ height: 500 }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{ editable: false }}
        />
      </div>
      <div className='mt-4 flex justify-end'>
        <Button
          onClick={() => {
            // Handle save logic here
            setMessage('Data has been saved successfully!');
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
  
}

export default TabelKehadiran;
