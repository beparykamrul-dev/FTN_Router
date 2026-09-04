import React, { useState } from 'react';
import { CheckCircle, Package } from 'lucide-react';

export const FtnProvisioningWizard = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg space-y-4">
      <div className="flex items-center gap-2">
        <Package className="text-[#48bb78]" />
        <h2 className="text-xl font-bold text-[#48bb78]">FTN Provisioning Wizard</h2>
      </div>
      <div className="p-4 bg-[#1a202c] rounded-lg">
        <p className="text-white">Step {step}: Subscriber Validation</p>
        <button 
          onClick={() => setStep(step + 1)}
          className="mt-4 px-4 py-2 bg-[#48bb78] text-black font-bold rounded-lg"
        >
          {step < 3 ? 'Next Step' : 'Finalize'}
        </button>
      </div>
    </div>
  );
};
