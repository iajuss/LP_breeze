"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronIcon } from "@/components/ui/chevron-icon";

type ArcoraOption = string | { label: string; value: string };

type ArcoraSelectProps = {
  label: string;
  name: string;
  options: readonly ArcoraOption[];
  defaultValue?: string;
};

const optionValue = (option: ArcoraOption) => typeof option === "string" ? option : option.value;
const optionLabel = (option: ArcoraOption) => typeof option === "string" ? option : option.label;

export function ArcoraSelect({ label, name, options, defaultValue }: ArcoraSelectProps) {
  const normalizedOptions = options.map((option) => ({ label: optionLabel(option), value: optionValue(option) }));
  const initialValue = normalizedOptions.some((option) => option.value === defaultValue) ? defaultValue! : normalizedOptions[0]?.value ?? "";
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selected = normalizedOptions.find((option) => option.value === value) ?? normalizedOptions[0];

  useEffect(() => {
    const closeOnOutsidePointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsidePointer);
    return () => document.removeEventListener("mousedown", closeOnOutsidePointer);
  }, []);

  const focusOption = (index: number) => {
    optionRefs.current[(index + normalizedOptions.length) % normalizedOptions.length]?.focus();
  };

  const openMenu = () => {
    setOpen(true);
    requestAnimationFrame(() => focusOption(Math.max(normalizedOptions.findIndex((option) => option.value === value), 0)));
  };

  const choose = (nextValue: string) => {
    setValue(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return <div className="relative mt-1" ref={rootRef}>
    <input name={name} type="hidden" value={value} />
    <button aria-controls={open ? listboxId : undefined} aria-expanded={open} aria-haspopup="listbox" aria-label={label} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-white px-3 text-left font-normal transition hover:border-[var(--primary)] focus-visible:outline-[var(--primary)]" onClick={() => setOpen((isOpen) => !isOpen)} onKeyDown={(event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!open) openMenu();
      }
    }} ref={triggerRef} role="combobox" type="button">
      <span>{selected?.label}</span><ChevronIcon direction={open ? "up" : "down"} />
    </button>
    {open ? <div aria-label={label} className="absolute top-full z-20 mt-1 w-full rounded-xl bg-[var(--primary)] p-1 text-white shadow-lg" id={listboxId} role="listbox">
      {normalizedOptions.map((option, index) => <button aria-selected={option.value === value} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/15 focus-visible:outline-white ${option.value === value ? "bg-white/15" : ""}`} key={option.value} onClick={() => choose(option.value)} onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusOption(index + 1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          focusOption(index - 1);
        }
        if (event.key === "Home") {
          event.preventDefault();
          focusOption(0);
        }
        if (event.key === "End") {
          event.preventDefault();
          focusOption(normalizedOptions.length - 1);
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose(option.value);
        }
      }} ref={(element) => { optionRefs.current[index] = element; }} role="option" type="button"><span>{option.label}</span>{option.value === value ? <span aria-label="Selecionada">✓</span> : null}</button>)}
    </div> : null}
  </div>;
}
