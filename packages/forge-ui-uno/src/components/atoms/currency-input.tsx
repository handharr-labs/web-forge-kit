'use client';

import { useState, useRef, useEffect } from 'react';

function defaultFormatDisplay(value: number): string {
  if (value === 0) return '';
  return value.toLocaleString();
}

function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  formatDisplay?: (value: number) => string;
  currencyLabel?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  formatDisplay = defaultFormatDisplay,
  currencyLabel = 'IDR',
  placeholder = '0',
  className = '',
  required,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(() => formatDisplay(value));
  const isFocusedRef = useRef(false);
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (!isFocusedRef.current) {
      setDisplay(value > 0 ? formatDisplay(value) : '');
      lastValueRef.current = value;
    } else if (value !== lastValueRef.current) {
      setDisplay(value > 0 ? formatDisplay(value) : '');
      lastValueRef.current = value;
    }
  }, [formatDisplay, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseAmount(e.target.value);
    setDisplay(numeric > 0 ? formatDisplay(numeric) : '');
    lastValueRef.current = numeric;
    onChange(numeric);
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    setDisplay(value > 0 ? formatDisplay(value) : '');
  };

  return (
    <div className={`flex items-center border rounded-md overflow-hidden ${className}`}>
      <span
        className="self-stretch flex items-center justify-center px-3 bg-muted text-sm border-r text-muted-foreground font-medium min-w-[3.5rem] flex-shrink-0"
      >
        {currencyLabel}
      </span>
      <input
        type="text"
        inputMode="numeric"
        className="flex-1 min-w-0 px-3 h-full text-sm outline-none bg-transparent"
        value={display}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}
