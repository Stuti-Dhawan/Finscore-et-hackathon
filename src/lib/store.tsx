import React, { createContext, useContext, useState, ReactNode } from 'react';

export type InvestmentType = 'FD' | 'Stocks' | 'Mutual Funds';

export interface UserData {
  age: number | '';
  income: number | '';
  expenses: number | '';
  savings: number | '';
  emergencyMonths: number | '';
  healthInsurance: 'Yes' | 'No' | '';
  lifeInsurance: 'Yes' | 'No' | '';
  debtEmi: number | '';
  hasInvestments: 'Yes' | 'No' | '';
  investmentTypes: InvestmentType[];
  retirementStarted: 'Yes' | 'No' | '';
}

const initialData: UserData = {
  age: '',
  income: '',
  expenses: '',
  savings: '',
  emergencyMonths: '',
  healthInsurance: '',
  lifeInsurance: '',
  debtEmi: '',
  hasInvestments: '',
  investmentTypes: [],
  retirementStarted: '',
};

export interface ScoreDetails {
  total: number;
  dimensions: {
    emergency: { score: number; max: number };
    insurance: { score: number; max: number };
    investments: { score: number; max: number };
    debt: { score: number; max: number };
    savings: { score: number; max: number };
    retirement: { score: number; max: number };
  };
  recommendations: string[];
}

interface AppContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  updateField: (field: keyof UserData, value: any) => void;
  scoreDetails: ScoreDetails | null;
  calculateScore: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialData);
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null);

  const updateField = (field: keyof UserData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateScore = () => {
    const data = userData as Record<keyof UserData, any>; // safe cast for calculation
    
    // 1. Emergency (Max 20)
    let emergencyScore = 0;
    const em = Number(data.emergencyMonths) || 0;
    if (em >= 6) emergencyScore = 20;
    else if (em >= 3) emergencyScore = 12;
    else if (em >= 1) emergencyScore = 6;

    // 2. Insurance (Max 15)
    let insuranceScore = 0;
    if (data.healthInsurance === 'Yes') insuranceScore += 8;
    if (data.lifeInsurance === 'Yes') insuranceScore += 7;

    // 3. Investments (Max 20)
    let investmentScore = 0;
    if (data.hasInvestments === 'Yes') {
      const count = data.investmentTypes.length;
      if (count === 1) investmentScore = 8;
      else if (count === 2) investmentScore = 14;
      else if (count >= 3) investmentScore = 20;

      if (data.investmentTypes.includes('Mutual Funds')) {
        investmentScore = Math.min(20, investmentScore + 2);
      }
    }

    // 4. Debt (Max 15)
    let debtScore = 0;
    const income = Number(data.income) || 1; // avoid div by zero
    const debtEmi = Number(data.debtEmi) || 0;
    const debtRatio = debtEmi / income;
    
    if (debtRatio === 0) debtScore = 15;
    else if (debtRatio <= 0.20) debtScore = 12;
    else if (debtRatio <= 0.35) debtScore = 7;
    else if (debtRatio <= 0.50) debtScore = 3;

    // 5. Savings (Max 20)
    let savingsScore = 0;
    const savings = Number(data.savings) || 0;
    const savingsRate = savings / income;
    
    if (savingsRate >= 0.30) savingsScore = 20;
    else if (savingsRate >= 0.20) savingsScore = 15;
    else if (savingsRate >= 0.10) savingsScore = 8;
    else if (savingsRate >= 0.05) savingsScore = 4;

    // 6. Retirement (Max 10)
    let retirementScore = 0;
    const age = Number(data.age) || 30;
    if (data.retirementStarted === 'Yes') {
      if (age < 30) retirementScore = 10;
      else if (age < 40) retirementScore = 8;
      else retirementScore = 5;
    }

    const total = emergencyScore + insuranceScore + investmentScore + debtScore + savingsScore + retirementScore;

    // Recommendations Logic
    const recs: string[] = [];
    const expenses = Number(data.expenses) || 0;
    const format = (num: number) => new Intl.NumberFormat('en-IN').format(num);

    if (savingsRate < 0.10) {
      recs.push(`Your savings rate is only ${(savingsRate*100).toFixed(1)}%. The 20% rule suggests saving ₹${format(income*0.2)}/month. Start a ₹2,000/month SIP in a liquid mutual fund today.`);
    }
    if (em < 3) {
      const target = expenses * 6;
      recs.push(`You have low emergency reserves. Build a fund covering 6 months of expenses = ₹${format(target)}. Park it in a high-yield savings account or a liquid fund.`);
    }
    if (data.healthInsurance === 'No') {
      recs.push(`You don't have health insurance. A ₹5 lakh health cover from Star Health or ICICI Lombard costs only ₹500-800/month. Get it now to protect your savings.`);
    }
    if (data.lifeInsurance === 'No') {
      recs.push(`Get term life insurance to protect your dependents. With your income, a ₹1 crore cover costs around ₹700-1,000/month. Look into LIC, HDFC Life, or Max Life.`);
    }
    if (debtRatio > 0.35) {
      recs.push(`Your EMI-to-income ratio is ${(debtRatio*100).toFixed(1)}% — dangerously high. Focus on prepaying your highest-interest debt first (avalanche method). Don't take any new loans.`);
    }
    if (data.hasInvestments === 'No') {
      recs.push(`Your money is sitting idle. Start with just ₹500/month in a Nifty 50 index fund. Platforms like Zerodha, Groww or Paytm Money make it easy.`);
    } else if (data.investmentTypes.length === 1 && data.investmentTypes.includes('FD')) {
      recs.push(`FDs beat inflation by very little. Add Mutual Funds to your portfolio for better long-term returns. Start with a ₹1,000/month SIP in any Nifty 50 index fund.`);
    }
    if (data.retirementStarted === 'No') {
      recs.push(`You haven't started retirement planning. Open an NPS account today — contributions up to ₹1.5L are tax-deductible under 80C, and an additional ₹50K under 80CCD(1B).`);
    }

    setScoreDetails({
      total,
      dimensions: {
        emergency: { score: emergencyScore, max: 20 },
        insurance: { score: insuranceScore, max: 15 },
        investments: { score: investmentScore, max: 20 },
        debt: { score: debtScore, max: 15 },
        savings: { score: savingsScore, max: 20 },
        retirement: { score: retirementScore, max: 10 },
      },
      recommendations: recs.slice(0, 5), // Max 5 recs
    });
  };

  const resetApp = () => {
    setUserData(initialData);
    setScoreDetails(null);
  };

  return (
    <AppContext.Provider value={{ userData, setUserData, updateField, scoreDetails, calculateScore, resetApp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
