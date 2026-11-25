import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: number;
  steps: string[];
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-stone-200 z-0" />
        
        {/* Active progress Line */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#C5A059] z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                  isCompleted
                    ? 'bg-[#C5A059] text-[#0B132B]'
                    : isCurrent
                    ? 'bg-[#0B132B] text-white ring-4 ring-[#C5A059]/40'
                    : 'bg-white text-stone-400 border border-stone-300'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : stepNumber}
              </div>
              <span
                className={`text-[11px] font-bold mt-2 text-center whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-[#0B132B]'
                    : isCompleted
                    ? 'text-[#C5A059]'
                    : 'text-stone-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
