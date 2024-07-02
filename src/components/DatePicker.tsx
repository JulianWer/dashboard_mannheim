"use client"

import * as React from "react"
import { useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"

interface IDatePickerProps {
    setSelected: React.Dispatch<React.SetStateAction<string>>;
    selected: string;
    isInGuidedMode: boolean;
}

export function DatePicker(props: IDatePickerProps) {
    const { setSelected, selected, isInGuidedMode } = props
    const [date, setDate] = React.useState<Date>(selected ? new Date(selected) : new Date());

    useEffect(() => {
        if (selected) {
            setDate(new Date(selected));
        }
    }, [selected]);

    useEffect(() => {
        if (!date) return
        setSelected(format(date, 'yyyy-MM-dd'))
    }, [date, setSelected])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    style={{ width: '10vw', height: '3vh', fontSize: '1.3vh' }}
                    disabled={isInGuidedMode}
                    variant={"outline"}
                    className={cn(
                        "w-[5vw] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon style={{ width: '1.3vw', height: '1.3vh' }} />
                    {date ? format(date, "dd.MM.yyyy") :
                        <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-1000">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                    initialFocus
                    disabled={(date) =>
                        date > new Date("2024-07-03") || date < new Date("2024-02-20")
                    }
                />
            </PopoverContent>
        </Popover>
    )
}
