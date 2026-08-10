import React, { forwardRef } from 'react';
import { Stepper, StepperProps } from './Stepper';

export interface DataStep {
 title: React.ReactNode;
 description?: React.ReactNode;
 content?: React.ReactNode;
}

export interface DataStepperProps extends Omit<StepperProps, 'steps' | 'active'> {
 /** Array of steps with title, description, and content */
 steps: DataStep[];
 /** The currently active step index */
 activeStep: number;
 /** The orientation of the stepper */
 orientation?: 'horizontal' | 'vertical';
}

export const DataStepper = forwardRef<HTMLDivElement, DataStepperProps>(
 ({ steps, activeStep, orientation = 'horizontal', className, ...props }, ref) => {
 // Map DataStep to the format expected by the existing Stepper (label, description)
 const stepperItems = steps.map(step => ({
 label: step.title,
 description: step.description,
 }));

 return (
 <div 
 ref={ref} 
 className={`flex ${orientation === 'vertical' ? 'flex-row' : 'flex-col'} gap-6 w-full ${className || ''}`}
 >
 <Stepper 
 steps={stepperItems} 
 active={activeStep} 
 {...props} 
 />
 <div className="w-full">
 {steps[activeStep]?.content}
 </div>
 </div>
 );
 }
);

DataStepper.displayName = 'DataStepper';
