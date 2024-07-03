"use client"
import React from 'react'
import { Button } from '@/components/ui/button'

function SimpanPerubahan({ kehadiranData }) {
    const handleSave = () => {
        fetch('http://localhost:8081/kehadiran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(kehadiranData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Changes saved successfully');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error saving changes');
        });
    };

    return (
        <Button onClick={handleSave}>Simpan</Button>
    )
}

export default SimpanPerubahan