import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, TrendingUp, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold text-foreground">FinScore</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-6 border border-accent/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Built for Indian Investors
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6 leading-tight">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Money Health</span> Score
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Take a 2-minute checkup to evaluate your emergency funds, investments, insurance, and get a personalized action plan to secure your financial future.
          </p>

          <Link href="/onboarding">
            <Button size="lg" className="rounded-full text-lg px-10 gap-2">
              Get Your Free Score
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Risk Protection</h3>
            <p className="text-sm text-muted-foreground">Evaluate your emergency readiness and insurance coverage.</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Wealth Creation</h3>
            <p className="text-sm text-muted-foreground">Analyze your investment diversification and retirement readiness.</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <PiggyBank className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Debt Management</h3>
            <p className="text-sm text-muted-foreground">Check your debt-to-income ratio and savings rate health.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
