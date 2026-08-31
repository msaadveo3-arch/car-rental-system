import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

type AppDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: 'sm' | 'md';
};

const toDate = (value: string) => (value ? new Date(`${value}T12:00:00`) : undefined);

const toValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const displayValue = (value: string) => {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        .format(date)
        .replaceAll('/', '.')
    : '';
};

const AppDatePicker: React.FC<AppDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  required = false,
  className = '',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = toDate(value);
  const controlSize = size === 'sm' ? 'h-9 min-h-9 px-3 text-sm' : 'h-12 min-h-12 px-4';

  return (
    <details
      className={`dropdown w-full ${className}`}
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary
        className={`input input-bordered flex w-full list-none items-center justify-between rounded-btn [&::-webkit-details-marker]:hidden ${controlSize} ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
        aria-label={placeholder}
        aria-required={required}
      >
        <span className={selected ? 'text-base-content' : 'text-base-content/50'}>
          {displayValue(value) || placeholder}
        </span>
        <CalendarDays size={size === 'sm' ? 16 : 18} className="text-base-content/60" aria-hidden="true" />
      </summary>

      {!disabled && (
          <div className="dropdown-content z-20 mt-2 rounded-box border border-base-300 bg-base-100 p-2 shadow-redwood-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(toValue(date));
              setIsOpen(false);
            }}
            classNames={{
              root: 'p-1 text-base-content',
              months: 'flex',
              month: 'space-y-3',
              month_caption: 'relative flex h-9 items-center justify-center',
              caption_label: 'text-sm font-semibold',
              nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
              button_previous: 'btn btn-ghost btn-sm btn-square',
              button_next: 'btn btn-ghost btn-sm btn-square',
              month_grid: 'w-full border-collapse',
              weekdays: 'border-b border-base-300',
              weekday: 'size-9 pb-2 text-center text-xs font-medium text-base-content/60',
              week: '',
              day: 'size-9 text-center',
              day_button: 'btn btn-ghost btn-sm size-9 min-h-9 p-0 font-normal',
              selected: '[&>button]:btn-primary [&>button]:text-primary-content',
              today: '[&>button]:font-bold [&>button]:text-primary',
              outside: '[&>button]:text-base-content/35',
              disabled: '[&>button]:cursor-not-allowed [&>button]:opacity-30',
            }}
          />
          <div className="mt-2 flex justify-between border-t border-base-300 pt-2">
            <button
              type="button"
              className={`btn btn-ghost btn-sm ${size === 'sm' ? 'app-btn-sm' : ''}`}
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className={`btn btn-ghost btn-sm ${size === 'sm' ? 'app-btn-sm' : ''}`}
              onClick={() => {
                onChange(toValue(new Date()));
                setIsOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </details>
  );
};

export default AppDatePicker;
