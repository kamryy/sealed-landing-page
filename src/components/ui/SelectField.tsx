"use client";

import React, { useRef, useEffect, useState } from "react";

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function SelectField({
  label,
  options,
  id = "select-field",
  value = "",
  onChange,
  disabled = false,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const hasValue = selectedValue.length > 0;

  return (
    <div className="group relative z-50" ref={containerRef}>
      {/* Hidden input for form submission */}
      <input type="hidden" id={id} name={id} value={selectedValue} />

      {/* Custom select button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`peer relative h-14 w-full rounded-xl border bg-black/40 px-4 pt-5 pb-1.5 font-dm-sans text-[15px] leading-5 outline-none transition-all duration-150 text-left ${
          isOpen
            ? "border-sealed-teal  shadow-[0_0_0_4px_rgba(107,250,214,0.12)]"
            : "border-white/15 text-white hover:border-white/25 hover:text-white"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        {selectedLabel}
      </button>

      {/* Floating label */}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 font-dm-sans transition-all duration-150 ${
          isOpen && !hasValue
            ? "top-1 text-[11px] text-sealed-teal"
            : hasValue
              ? "top-1 text-[11px] text-white/70"
              : "top-1/2 -translate-y-1/2 text-sm text-white/45"
        }`}
      >
        {label}
      </label>

      {/* Dropdown arrow icon */}
      <svg
        className={`pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45 transition-all ${
          isOpen ? "rotate-180 text-sealed-teal" : "text-white/45"
        }`}
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-white/15 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <ul className="max-h-80 overflow-y-auto">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSelect(option.value);
                    }
                  }}
                  className={`w-full px-4 py-3 text-left font-dm-sans text-[15px] transition-colors ${
                    selectedValue === option.value
                      ? "bg-sealed-teal/20 text-sealed-teal"
                      : "text-white/80 hover:bg-sealed-teal/40 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
