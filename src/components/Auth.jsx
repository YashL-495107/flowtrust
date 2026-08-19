import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Auth({ setSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setErrorMsg(error.message);
      } else {
        alert('Signup successful! You can now log in.');
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        if (data.session) {
          setSession(data.session);
        }
      }
    }
  };

  return (
    <div className="bg-paper text-ink font-sans antialiased min-h-screen flex selection:bg-teal-soft selection:text-teal-deep">
      {/* Left: Branding & Intent */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-ink p-16 relative overflow-hidden">
        <div className="z-10">
          <span className="font-serif text-2xl tracking-tight text-white">FlowTrust</span>
        </div>
        
        <div className="z-10 max-w-md">
          <h1 className="font-serif text-5xl leading-tight text-white mb-6">Autonomous financial infrastructure for modern recovery.</h1>
          <p className="text-gray-400 text-lg leading-relaxed">Secure, compliant, and precise overdue invoice management powered by specialized AI agents.</p>
        </div>

        <div className="z-10 flex items-center gap-6 text-xs font-mono text-gray-500 uppercase tracking-widest">
          <span>Node: auth_01</span>
          <span>Region: global_primary</span>
          <span>&copy; 2026 FlowTrust AI</span>
        </div>

        {/* Abstract geometry for professional feel */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] border border-white rounded-full"></div>
          <div className="absolute top-[15%] right-[-15%] w-[600px] h-[600px] border border-white rounded-full"></div>
          <div className="absolute bottom-[20%] left-[20%] w-[1px] h-[400px] bg-white"></div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden mb-12">
            <span className="font-serif text-2xl tracking-tight text-teal">FlowTrust</span>
          </div>

          <h2 className="text-2xl font-semibold text-ink mb-2">Access the console</h2>
          <p className="text-sm text-muted mb-6">Enter your credentials to manage your collection nodes.</p>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-6 border border-red-200">
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="finance@company.com" 
                className="w-full px-4 py-3 bg-white border border-line rounded-md focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted">Password</label>
                {!isSignUp && <a href="#" className="text-[11px] font-semibold uppercase tracking-wider text-teal hover:text-teal-deep transition-colors">Forgot Access?</a>}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-white border border-line rounded-md focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-teal text-white py-3.5 rounded-md font-medium hover:bg-teal-deep transition-all shadow-sm flex items-center justify-center gap-2">
                {isSignUp ? 'Sign Up' : 'Sign In to Node'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-12 pt-12 border-t border-line text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-teal font-semibold hover:underline">
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an instance? Request access"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
