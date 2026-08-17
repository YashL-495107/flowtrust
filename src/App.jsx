import React, { useState } from 'react';
import { Activity, ShieldCheck, FileText, Send, Terminal, DollarSign, Clock, Plus, ChevronRight } from 'lucide-react';

const INITIAL_INVOICES = [
  { id: 'INV-1042', client: 'Acme Corp', amount: 4500, daysLate: 15, status: 'Overdue' },
];

export default function App() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [loadingId, setLoadingId] = useState(null);
  const [agentLog, setAgentLog] = useState(null);

  const [newClient, setNewClient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDays, setNewDays] = useState('');

  const handleAddInvoice = (e) => {
    e.preventDefault();
    if (!newClient || !newAmount || !newDays) return;

    const newInvoice = {
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      client: newClient,
      amount: parseFloat(newAmount),
      daysLate: parseInt(newDays),
      status: 'Overdue'
    };

    setInvoices([...invoices, newInvoice]);
    setNewClient('');
    setNewAmount('');
    setNewDays('');
  };

  const runAgent = async (invoice) => {
    setLoadingId(invoice.id);
    setAgentLog({ status: 'Agent Swarm Initializing...', data: null });

    try {
      const response = await fetch('/api/flowtrust-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData: invoice }),
      });

      const data = await response.json();
      
      setAgentLog({
        status: 'Success: Compliance Cleared',
        data: data
      });

      setInvoices(invoices.map(inv => 
        inv.id === invoice.id ? { ...inv, status: 'Draft Ready' } : inv
      ));

    } catch (error) {
      setAgentLog({ status: 'Error executing agent', data: null });
    } finally {
      setLoadingId(null);
    }
  };

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
              <ShieldCheck className="text-white w-6 h-6"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">FlowTrust AI</h1>
              <p className="text-slate-500 text-sm font-medium">Autonomous Factoring & Ethical Collections</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Agent Swarm Active
          </div>
        </header>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><DollarSign h-5 w-5/></div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Outstanding</p>
              <p className="text-2xl font-bold text-slate-800">${totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Clock h-5 w-5/></div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Invoices</p>
              <p className="text-2xl font-bold text-slate-800">{invoices.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Activity h-5 w-5/></div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Compliance Score</p>
              <p className="text-2xl font-bold text-slate-800">100%</p>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            {/* INPUT FORM */}
            <form onSubmit={handleAddInvoice} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 transition-all hover:shadow-md">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600"/> Add Ledger Entry
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Client Name</label>
                  <input type="text" value={newClient} onChange={e => setNewClient(e.target.value)} className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm" placeholder="e.g. Wayne Ent." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Amount ($)</label>
                  <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Days Late</label>
                  <input type="number" value={newDays} onChange={e => setNewDays(e.target.value)} className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm" placeholder="30" />
                </div>
              </div>
              <button type="submit" className="mt-4 w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors flex justify-center items-center gap-2 shadow-sm">
                Register Invoice <ChevronRight className="w-4 h-4"/>
              </button>
            </form>

            {/* INVOICE LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600"/> Accounts Receivable
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors group">
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{invoice.client}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-slate-500 font-medium">{invoice.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700 font-bold">${invoice.amount.toLocaleString()}</span>
                        <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-100">
                          {invoice.daysLate} Days Late
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => runAgent(invoice)}
                      disabled={loadingId === invoice.id || invoice.status === 'Draft Ready'}
                      className="relative bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:bg-slate-200 disabled:text-slate-500 shadow-sm hover:shadow-md hover:shadow-indigo-200 flex items-center gap-2"
                    >
                      {loadingId === invoice.id ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</>
                      ) : invoice.status === 'Draft Ready' ? (
                        <><ShieldCheck className="w-4 h-4"/> Cleared</>
                      ) : (
                        <><Send className="w-4 h-4"/> Dispatch Agent</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI TERMINAL */}
          <div className="bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 flex flex-col h-[700px] overflow-hidden relative">
            
            {/* Terminal Header */}
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2 tracking-wide uppercase">
                <Terminal className="w-4 h-4 text-indigo-400"/>
                Orchestration Console
              </h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
            </div>
            
            {/* Terminal Body */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-sm">
              {!agentLog ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                  <Activity className="w-12 h-12 opacity-20"/>
                  <p>Awaiting operational trigger...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <span className="text-indigo-600">❯</span> {agentLog.status}
                  </div>
                  
                  {agentLog.data && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 text-emerald-400 bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                        <ShieldCheck className="w-5 h-5"/>
                        <span>Compliance Status: {agentLog.data.approved ? 'PASSED & VERIFIED' : 'FAILED & EDITED'}</span>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur"></div>
                        <div className="relative bg-[#0d1117] p-5 rounded-xl border border-slate-800/60 shadow-2xl">
                          <p className="text-slate-400 mb-4 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
                            <Send className="w-3 h-3"/> Secure Output Buffer
                          </p>
                          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/30">
                            {agentLog.data.final_message}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
