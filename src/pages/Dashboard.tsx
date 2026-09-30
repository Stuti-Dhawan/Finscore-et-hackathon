import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert, HeartPulse, ShieldCheck, PiggyBank, Coins, TrendingUp, Briefcase } from "lucide-react";

export default function Dashboard() {
  const { scoreDetails, resetApp } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!scoreDetails) {
      setLocation("/");
    }
  }, [scoreDetails, setLocation]);

  if (!scoreDetails) return null;

  const handleRecalculate = () => {
    resetApp();
    setLocation("/");
  };

  const { total, dimensions, recommendations } = scoreDetails;

  const dims = [
    { key: 'emergency', label: 'Emergency Fund', icon: <PiggyBank className="w-5 h-5"/>, data: dimensions.emergency },
    { key: 'insurance', label: 'Insurance', icon: <ShieldCheck className="w-5 h-5"/>, data: dimensions.insurance },
    { key: 'investments', label: 'Investments', icon: <TrendingUp className="w-5 h-5"/>, data: dimensions.investments },
    { key: 'debt', label: 'Debt Health', icon: <Coins className="w-5 h-5"/>, data: dimensions.debt },
    { key: 'savings', label: 'Savings Rate', icon: <HeartPulse className="w-5 h-5"/>, data: dimensions.savings },
    { key: 'retirement', label: 'Retirement', icon: <Briefcase className="w-5 h-5"/>, data: dimensions.retirement },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold">FinScore</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRecalculate} className="rounded-full hidden sm:flex">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recalculate
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Score Section */}
        <section className="bg-card rounded-3xl p-6 sm:p-10 shadow-lg shadow-black/5 border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">Your Money Health Report</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Based on your inputs, we've calculated your overall financial resilience. A score above 70 indicates a strong foundation.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl font-medium text-sm">
                  <CheckCircle2 className="w-5 h-5" /> Good Areas: {dims.filter(d => (d.data.score/d.data.max) >= 0.7).length}
                </div>
                <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-xl font-medium text-sm">
                  <AlertTriangle className="w-5 h-5" /> Needs Work: {dims.filter(d => (d.data.score/d.data.max) < 0.7).length}
                </div>
              </div>
            </div>
            
            <div className="shrink-0">
              <ScoreGauge score={total} />
            </div>
          </div>
        </section>

        {/* Action Plan */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-primary" />
              Your Priority Action Plan
            </h2>
            <div className="grid gap-4">
              {recommendations.map((rec, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  key={i}
                >
                  <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-base text-foreground leading-relaxed">
                        {rec}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Breakdown */}
        <section>
          <h2 className="text-2xl font-display font-bold mb-6">Dimension Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dims.map((dim, i) => {
              const ratio = dim.data.score / dim.data.max;
              let barColor = "bg-destructive";
              if (ratio >= 0.8) barColor = "bg-emerald-500";
              else if (ratio >= 0.4) barColor = "bg-yellow-500";

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={dim.key}
                >
                  <Card className="h-full hover-elevate">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-secondary text-foreground`}>
                          {dim.icon}
                        </div>
                        <h3 className="font-semibold">{dim.label}</h3>
                      </div>
                      
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-2xl font-bold">{dim.data.score}</span>
                        <span className="text-sm text-muted-foreground mb-1">/ {dim.data.max} pts</span>
                      </div>
                      
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(ratio) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="pt-8 flex justify-center sm:hidden">
          <Button variant="outline" size="lg" onClick={handleRecalculate} className="rounded-xl w-full">
            <RefreshCw className="w-5 h-5 mr-2" />
            Recalculate Score
          </Button>
        </div>

      </main>
    </div>
  );
}
