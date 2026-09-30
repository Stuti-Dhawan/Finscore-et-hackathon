import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioCards } from "@/components/ui/radio-cards";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import { ArrowRight, ArrowLeft, CheckSquare, HeartPulse, PiggyBank, Coins, Activity, Briefcase, ShieldCheck, TrendingUp } from "lucide-react";

const STEPS = [
  { id: 1, title: "Income & Savings" },
  { id: 2, title: "Protection" },
  { id: 3, title: "Debt & Future" },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [, setLocation] = useLocation();
  const { userData, updateField, calculateScore } = useApp();

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitForm();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const submitForm = () => {
    setIsCalculating(true);
    // Simulate thinking time for better UX
    setTimeout(() => {
      calculateScore();
      setLocation("/dashboard");
    }, 1500);
  };

  // Validation
  const isStep1Valid = userData.age && userData.income && userData.expenses && userData.savings !== '';
  const isStep2Valid = userData.emergencyMonths !== '' && userData.healthInsurance && userData.lifeInsurance;
  const isStep3Valid = userData.debtEmi !== '' && userData.hasInvestments && (userData.hasInvestments === 'No' || userData.investmentTypes.length > 0) && userData.retirementStarted;

  const canProceed = 
    (step === 1 && isStep1Valid) || 
    (step === 2 && isStep2Valid) || 
    (step === 3 && isStep3Valid);

  const toggleInvestmentType = (type: any) => {
    const current = userData.investmentTypes;
    if (current.includes(type)) {
      updateField('investmentTypes', current.filter(t => t !== type));
    } else {
      updateField('investmentTypes', [...current, type]);
    }
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Analyzing Your Finances</h2>
          <p className="text-muted-foreground text-lg">
            Our engine is crunching the numbers across 6 critical dimensions of your money health...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={handleBack} disabled={step === 1} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">
              Step {step} of {STEPS.length}
            </span>
            <div className="w-10"></div> {/* spacer */}
          </div>
          
          <div className="flex gap-2">
            {STEPS.map((s) => (
              <div 
                key={s.id} 
                className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
                  s.id <= step ? 'bg-primary' : 'bg-primary/10'
                }`}
              />
            ))}
          </div>
          <h2 className="text-3xl font-display font-bold mt-6 text-center">
            {STEPS[step-1].title}
          </h2>
        </div>

        {/* Form Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 pb-24"
            >
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">What is your current age?</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 28" 
                      value={userData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Monthly Take-home Income</label>
                    <Input 
                      type="number" 
                      prefix="₹"
                      placeholder="e.g. 85000" 
                      value={userData.income}
                      onChange={(e) => updateField('income', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Average Monthly Expenses</label>
                    <p className="text-xs text-muted-foreground -mt-2">Include rent, groceries, lifestyle, etc. (Exclude investments)</p>
                    <Input 
                      type="number" 
                      prefix="₹"
                      placeholder="e.g. 45000" 
                      value={userData.expenses}
                      onChange={(e) => updateField('expenses', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Monthly Savings/Investments</label>
                    <Input 
                      type="number" 
                      prefix="₹"
                      placeholder="e.g. 20000" 
                      value={userData.savings}
                      onChange={(e) => updateField('savings', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <PiggyBank className="w-4 h-4 text-primary" />
                      Emergency Fund
                    </label>
                    <p className="text-xs text-muted-foreground -mt-1 mb-2">How many months of your living expenses do you have saved in easily accessible accounts (Savings/Liquid Funds)?</p>
                    <RadioCards 
                      options={[
                        { label: "None (0)", value: "0" },
                        { label: "1-2 months", value: "1" },
                        { label: "3-5 months", value: "3" },
                        { label: "6+ months", value: "6" },
                      ]}
                      value={String(userData.emergencyMonths)}
                      onChange={(v) => updateField('emergencyMonths', Number(v))}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-primary" />
                      Health Insurance
                    </label>
                    <p className="text-xs text-muted-foreground -mt-1 mb-2">Do you have an active health insurance policy? (Corporate or Personal)</p>
                    <RadioCards 
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      value={userData.healthInsurance}
                      onChange={(v) => updateField('healthInsurance', v)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Life Insurance
                    </label>
                    <p className="text-xs text-muted-foreground -mt-1 mb-2">Do you have a term life insurance policy?</p>
                    <RadioCards 
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      value={userData.lifeInsurance}
                      onChange={(v) => updateField('lifeInsurance', v)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Coins className="w-4 h-4 text-primary" />
                      Total Debt EMI per month
                    </label>
                    <p className="text-xs text-muted-foreground -mt-1 mb-2">Sum of all loan EMIs (Home, Car, Personal, Credit Cards). Enter 0 if none.</p>
                    <Input 
                      type="number" 
                      prefix="₹"
                      placeholder="e.g. 15000" 
                      value={userData.debtEmi}
                      onChange={(e) => updateField('debtEmi', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Investments
                    </label>
                    <p className="text-xs text-muted-foreground -mt-1 mb-2">Do you have any active investments?</p>
                    <RadioCards 
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      value={userData.hasInvestments}
                      onChange={(v) => updateField('hasInvestments', v)}
                    />
                  </div>

                  {userData.hasInvestments === 'Yes' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 p-4 bg-secondary/30 rounded-xl border border-border"
                    >
                      <label className="text-sm font-semibold">What types of investments? (Select all that apply)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['FD', 'Stocks', 'Mutual Funds'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleInvestmentType(type)}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                              userData.investmentTypes.includes(type as any)
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-transparent bg-background text-foreground hover:border-primary/30"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                              userData.investmentTypes.includes(type as any) ? "bg-primary border-primary text-primary-foreground" : "border-input"
                            }`}>
                              {userData.investmentTypes.includes(type as any) && <CheckSquare className="w-3 h-3" />}
                            </div>
                            {type}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Retirement Planning
                    </label>
                    <p className="text-xs text-muted-foreground -mt-1 mb-2">Have you started investing specifically for retirement? (EPF/NPS/PPF)</p>
                    <RadioCards 
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      value={userData.retirementStarted}
                      onChange={(v) => updateField('retirementStarted', v)}
                    />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Action */}
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-md border-t border-border p-4 z-20">
          <div className="max-w-2xl mx-auto flex justify-end">
            <Button 
              size="lg" 
              className="w-full sm:w-auto min-w-[200px] text-lg rounded-xl"
              onClick={handleNext}
              disabled={!canProceed}
            >
              {step === STEPS.length ? "Calculate My Score" : "Continue"}
              {step !== STEPS.length && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
