"use client";
import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Button } from '@/components/ui/button';
import { Search, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios'; // Import axios for making HTTP requests

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100];

function TabelTeknisi() {

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/teknisi/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      setError('Failed to delete the record');
    }
  };

  const CustomButtons = (props) => {
    const { id } = props.data; // Get the id from the row data

    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button size="sm" variant="destructive">
            <Trash/></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the technician record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRecord(id)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

  }

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8081/teknisi');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 5000); // Polling every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const [colDefs, setColDefs] = useState([
    { field: "id", filter: true },
    { field: "nama", filter: true },
    { field: "crew", filter: true },
    { field: "sektor", filter: true },
    { field: 'action', cellRenderer: CustomButtons }
  ]);

  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState();
  useEffect(() => {
    data && setRowData(data);
  }, [data]);

  return (

    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      <div className='p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm'>
        <Search />
        <input type='text' placeholder='Cari...'
          className='outline-none w-full'
          onChange={(event) => setSearchInput(event.target.value)} />
      </div>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        quickFilterText={searchInput}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
      />
    </div>
  );
}

export default TabelTeknisi;
