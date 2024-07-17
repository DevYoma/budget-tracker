"use client"

type Props = {
  userSettings: UserSettings
}

type DateRangeType = {
    from: Date;
    to: Date;
}

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { UserSettings } from '@prisma/client'
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import StatsCards from './StatsCards';
import CategoriesStats from './CategoriesStats';

const Overview = ({ userSettings }: Props) => {
    const [dateRange, setDateRange] = useState<DateRangeType>({
        from: startOfMonth(new Date()),
        to: new Date()
    })
  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
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

      <div className="container flex w-full flex-col gap-2">
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoriesStats  
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
}

export default Overview