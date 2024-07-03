"use client"
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import { addMonths } from 'date-fns'
import moment from 'moment'
import { Calendar } from "@/components/ui/calendar"

function MonthSelection({ selectedMonth }) {
    const today = new Date();
    const nextMonths = addMonths(today, 0);
    const [month, setMonth] = useState(nextMonths);

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline"
                        className="flex gap-2 items-center text-slate-500 cursor-pointer">
                        <CalendarDays className='h-5 w-5' />
                        {moment(month).format('MMM yyyy')}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar
                        mode="single"
                        month={month}
                        onMonthChange={(value) => { 
                            setMonth(value); 
                            if (typeof selectedMonth === 'function') {
                                selectedMonth(value); 
                            }
                        }}
                        className="flex flex-1 justify-center"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default MonthSelection
