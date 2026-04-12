"use client";
import React, { useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2, Zap, ArrowRight, Target, Briefcase, Lightbulb, Cpu, CircuitBoard } from 'lucide-react';

const Dashboard = () => {
  const [fields, setFields] = useState({
    title: "",
    problem: "",
    targetUser: "",
    industry: "",
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/search-idea", fields);
      if (response.data.success) toast.success(response.data.message);
      router.push(`/idea/${response.data.data._id}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const fields_config = [
    { id: "title",      label: "Title",       placeholder: "e.g. Autonomous supply chain optimizer", icon: Lightbulb, maxLength: 80 },
    { id: "problem",    label: "Problem",     placeholder: "e.g. Fragmented logistics data silos",   icon: Cpu,       maxLength: 120 },
    { id: "targetUser", label: "Target user", placeholder: "e.g. Enterprise procurement teams",       icon: Target,    maxLength: 80 },
    { id: "industry",   label: "Industry",    placeholder: "e.g. Supply chain / logistics",           icon: Briefcase, maxLength: 80 },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 font-mono">
      <div className="w-full max-w-[480px]">

        {/* Badge row */}
        <div className="mb-8 flex items-center gap-2 text-[10px] tracking-[0.12em] text-gray-500 dark:text-neutral-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
          <CircuitBoard className="h-3 w-3 opacity-60" />
          <span>VENTUREMIND-AI</span>
          <span className="opacity-30">|</span>
          <span>IDEA PROCESSOR v2.0</span>
        </div>

        {/* Headline */}
        <h1 className="mb-1.5 font-sans text-[32px] font-medium leading-tight tracking-tight text-gray-900 dark:text-white">
          Neural Idea{" "}
          <span className="text-blue-500">Analyzer</span>
        </h1>

        {/* Subline */}
        <div className="mb-10 flex items-center gap-2 text-[11px] tracking-[0.08em] text-gray-400 dark:text-neutral-600">
          <Zap className="h-3 w-3 text-blue-500" />
          <span>INITIALIZE INPUT SEQUENCE</span>
          <span className="inline-block h-3 w-1.5 animate-[blink_1s_step-end_infinite] bg-blue-500" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {fields_config.map(({ id, label, placeholder, icon: Icon, maxLength }, index) => {
            const isFocused = focusedField === id;
            const charCount = fields[id as keyof typeof fields].length;

            return (
              <div
                key={id}
                className="group"
                style={{
                  opacity: 0,
                  animation: `slideUp 0.45s cubic-bezier(0.4,0,0.2,1) ${index * 80}ms forwards`,
                }}
              >
                {/* Label row */}
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Icon className="h-3 w-3 opacity-50 text-gray-500 dark:text-neutral-500" />
                  <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-gray-400 dark:text-neutral-500">
                    {label}
                  </span>
                  {isFocused && (
                    <span className="text-[9px] tracking-[0.1em] text-blue-500 animate-pulse">
                      › READY
                    </span>
                  )}
                  <span className="ml-auto text-[9px] tracking-wider text-gray-300 dark:text-neutral-700">
                    {charCount}/{maxLength}
                  </span>
                </div>

                {/* Input with animated underline */}
                <div className="relative">
                  <input
                    id={id}
                    name={id}
                    type="text"
                    value={fields[id as keyof typeof fields]}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(id)}
                    onBlur={() => setFocusedField(null)}
                    className="w-full border-b border-gray-200 dark:border-neutral-800 bg-transparent py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-neutral-700 outline-none caret-blue-500 transition-colors duration-200 focus:border-blue-500"
                  />
                  {/* Animated fill line */}
                  <div
                    className="absolute bottom-0 left-0 h-px bg-blue-500 transition-all duration-300"
                    style={{ width: isFocused ? '100%' : '0%' }}
                  />
                </div>
              </div>
            );
          })}

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-neutral-900" />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden border-b border-blue-500 bg-transparent py-3.5 text-left text-[11px] font-medium tracking-[0.14em] uppercase text-blue-500 transition-opacity duration-200 hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between"
          >
            {/* Shimmer */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="flex items-center gap-2">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "PROCESSING IDEA..." : "ANALYZE & INITIALIZE"}
            </span>

            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-[10px] tracking-[0.1em] text-gray-300 dark:text-neutral-700">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            <span>AI READY</span>
            <span className="opacity-40">|</span>
            <span>NEURAL ENGINE ONLINE</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            <span>v2.1.0</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;