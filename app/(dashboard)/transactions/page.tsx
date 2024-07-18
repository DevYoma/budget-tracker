"use client";

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import TransactionTable from './_components/TransactionTable';

const TransactionsPage = () => {
    const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
        from: startOfMonth(new Date()),
        to: new Date()
    })
  return (
    <>
        <div className="border-b bg-card">
            <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                <p className="text-3xl font-bold">Transaction History</p>
                <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                    const { from, to } = values.range;
                    // We update the date range only if boty dates are set

                    if (!from || !to) return;
                    // limit the date range, we dont want to allow users enter 1 year or 2 years

                    if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                        toast.error(
                        `Date range should not exceed ${MAX_DATE_RANGE_DAYS} days!`
                        );

                        return;
                    }

                    setDateRange({
                        from,
                        to,
                    });
                    }}
                />
            </div>

        </div>
        <div className="container">
            <TransactionTable from={dateRange.from} to={dateRange.to}/>
        </div>
    </>
  )
}

export default TransactionsPage