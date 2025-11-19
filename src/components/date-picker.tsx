'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Spinner } from './icons';

interface DatePickerProps {
    date?: Date;
    setDate?: (date: Date) => void;
    dates?: Date[];
    setDates?: (dates: Date[] | undefined) => void;
    multi?: boolean;
    onApply?: () => void;
    isLoading?: boolean;
}

export function DatePicker({ date, setDate, dates, setDates, multi = false, onApply, isLoading }: DatePickerProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleApply = () => {
        if (onApply) {
            onApply();
        }
        setPopoverOpen(false);
    }
    
    const buttonText = () => {
        if (multi) {
            return `Apply to ${dates?.length || 0} date(s)`;
        }
        if (date) {
            return format(date, "LLL dd, y");
        }
        return 'Select date';
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    {isLoading ? <Spinner className="mr-2 animate-spin"/> : <CalendarIcon className="mr-2 h-4 w-4" />}
                    {multi ? 'Apply to...' : buttonText()}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode={multi ? "multiple" : "single"}
                    selected={multi ? dates : date}
                    onSelect={multi ? setDates : (d) => d && setDate ? setDate(d) : null}
                    initialFocus
                    min={multi ? 0 : undefined}
                />
                {multi && onApply && (
                    <div className="p-2 border-t">
                        <Button onClick={handleApply} disabled={!dates || dates.length === 0 || isLoading} className="w-full">
                            {isLoading ? <Spinner className="mr-2 animate-spin"/> : null}
                            {buttonText()}
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
