"use client";

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';

export interface TransferListOption {
  value: string;
  label: React.ReactNode;
}

export interface TransferListProps {
  options: TransferListOption[];
  value?: string[]; // The values that are in the "right" list
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  leftTitle?: React.ReactNode;
  rightTitle?: React.ReactNode;
  className?: string;
}

export const TransferList = React.forwardRef<HTMLDivElement, TransferListProps>(({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  leftTitle = "Available",
  rightTitle = "Selected",
  className,
}, ref) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  
  const selectedValues = isControlled ? controlledValue : internalValue;

  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const leftOptions = useMemo(() => options.filter(o => !selectedValues.includes(o.value)), [options, selectedValues]);
  const rightOptions = useMemo(() => options.filter(o => selectedValues.includes(o.value)), [options, selectedValues]);

  const triggerChange = (newValues: string[]) => {
    if (!isControlled) {
      setInternalValue(newValues);
    }
    onChange?.(newValues);
  };

  const handleToggle = (val: string, list: 'left' | 'right') => {
    const checkedList = list === 'left' ? leftChecked : rightChecked;
    const setCheckedList = list === 'left' ? setLeftChecked : setRightChecked;
    
    if (checkedList.includes(val)) {
      setCheckedList(checkedList.filter(v => v !== val));
    } else {
      setCheckedList([...checkedList, val]);
    }
  };

  const handleToggleAll = (list: 'left' | 'right') => {
    const listOptions = list === 'left' ? leftOptions : rightOptions;
    const checkedList = list === 'left' ? leftChecked : rightChecked;
    const setCheckedList = list === 'left' ? setLeftChecked : setRightChecked;

    if (checkedList.length === listOptions.length) {
      setCheckedList([]);
    } else {
      setCheckedList(listOptions.map(o => o.value));
    }
  };

  const moveRight = () => {
    triggerChange([...selectedValues, ...leftChecked]);
    setLeftChecked([]);
  };

  const moveLeft = () => {
    triggerChange(selectedValues.filter(v => !rightChecked.includes(v)));
    setRightChecked([]);
  };

  const moveAllRight = () => {
    triggerChange(options.map(o => o.value));
    setLeftChecked([]);
  };

  const moveAllLeft = () => {
    triggerChange([]);
    setRightChecked([]);
  };

  const renderList = (
    title: React.ReactNode, 
    listOptions: TransferListOption[], 
    checkedValues: string[], 
    listType: 'left' | 'right'
  ) => {
    const isAllChecked = listOptions.length > 0 && checkedValues.length === listOptions.length;
    const isIndeterminate = checkedValues.length > 0 && checkedValues.length < listOptions.length;

    return (
      <div className="flex flex-col flex-1 border border-default rounded-lg bg-surface overflow-hidden">
        <div className="flex items-center gap-3 px-3 py-2 border-b border-default bg-subtle">
          <Checkbox 
            checked={isAllChecked} 
            indeterminate={isIndeterminate}
            onChange={() => handleToggleAll(listType)}
            aria-label={`Select all ${listType} items`}
          />
          <span className="text-sm font-semibold text-default flex-1">{title}</span>
          <span className="text-xs text-muted font-medium">{checkedValues.length}/{listOptions.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 min-h-[200px] max-h-[300px]">
          {listOptions.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted italic">
              No items
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {listOptions.map(option => (
                <Checkbox 
                  key={option.value}
                  label={option.label}
                  checked={checkedValues.includes(option.value)} 
                  onChange={() => handleToggle(option.value, listType)}
                  className={cn(
                    "flex items-center px-2 py-1.5 rounded-md cursor-pointer hover:bg-subtle transition-colors w-full",
                    checkedValues.includes(option.value) && "bg-subtle"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} className={cn("flex items-stretch gap-4 font-sans", className)} role="group" aria-label="Transfer list">
      {renderList(leftTitle, leftOptions, leftChecked, 'left')}
      
      <div className="flex flex-col items-center justify-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={moveAllRight} 
          disabled={leftOptions.length === 0}
          aria-label="Move all right"
        >
          <ChevronsRight size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={moveRight} 
          disabled={leftChecked.length === 0}
          aria-label="Move selected right"
        >
          <ChevronRight size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={moveLeft} 
          disabled={rightChecked.length === 0}
          aria-label="Move selected left"
        >
          <ChevronLeft size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={moveAllLeft} 
          disabled={rightOptions.length === 0}
          aria-label="Move all left"
        >
          <ChevronsLeft size={16} />
        </Button>
      </div>

      {renderList(rightTitle, rightOptions, rightChecked, 'right')}
    </div>
  );
});

TransferList.displayName = 'TransferList';
