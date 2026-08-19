import React, { useState } from 'react';
import { LayoutGrid, FileText, Bot, MessageSquare, LogOut, Settings, Terminal, Trash2 } from 'lucide-react';
import Auth from './components/Auth';

const INITIAL_INVOICES = [
  { id: 'INV-1042', client: 'Acme Corp', amount: 4500, daysLate: 15, status: 'Overdue' },
  { id: 'INV-9081', client: 'Northwind Traders', amount: 18750, daysLate: 0, status: 'Paid' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [loadingId, setLoadingId] = useState(null);
  const [agentLog, setAgentLog] = useState(null);
  
  // Loading state for initial fetch simulation
  const [initialLoading, setInitialLoading] = useState(false); // set true to test loading

  const [newClient, setNewClient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDays, setNewDays] = useState('');

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

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
    
    // Reset the log and show 'Thinking...'
    setAgentLog({ 
      status: 'Run Initiated', 
      invoiceId: invoice.id,
      client: invoice.client,
      data: null 
    });

    try {
      const response = await fetch('/api/flowtrust-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData: invoice }),
      });

      const data = await response.json();
      
      setAgentLog({
        status: 'Success',
        invoiceId: invoice.id,
        client: invoice.client,
        data: data
      });

      setInvoices(invoices.map(inv => 
        inv.id === invoice.id ? { ...inv, status: 'Draft Ready' } : inv
      ));

    } catch (error) {
      setAgentLog({ status: 'Error', invoiceId: invoice.id, client: invoice.client, data: null });
    } finally {
      setLoadingId(null);
    }
  };

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  if (initialLoading) {
    return (
      <div className="bg-paper text-ink font-sans antialiased min-h-screen flex flex-col">
        {/* Loading State Header */}
        <header className="h-16 bg-canvas border-b border-line flex items-center justify-between px-6 lg:px-8 shrink-0 z-20 relative">
            <div className="flex items-center gap-3">
                <span className="font-serif text-xl tracking-tight text-teal">FlowTrust</span>
            </div>
            <div className="flex items-center gap-5">
                <div className="w-8 h-8 rounded-full bg-skeleton skeleton-pulse"></div>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar */}
            <aside className="w-[72px] lg:w-[220px] bg-canvas border-r border-line flex flex-col py-6 shrink-0 z-10 hidden md:flex">
                <div className="px-6 space-y-4">
                    <div className="h-4 w-full bg-skeleton rounded skeleton-pulse"></div>
                    <div className="h-4 w-4/5 bg-skeleton rounded skeleton-pulse"></div>
                    <div className="h-4 w-3/4 bg-skeleton rounded skeleton-pulse"></div>
                    <div className="h-4 w-5/6 bg-skeleton rounded skeleton-pulse"></div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                {/* Skeleton Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line rounded-lg overflow-hidden border border-line mb-6">
                    <div className="bg-paper p-5">
                        <div className="h-3 w-24 bg-skeleton rounded mb-3 skeleton-pulse"></div>
                        <div className="h-8 w-32 bg-skeleton rounded skeleton-pulse"></div>
                    </div>
                    <div className="bg-paper p-5">
                        <div className="h-3 w-20 bg-skeleton rounded mb-3 skeleton-pulse"></div>
                        <div className="h-8 w-16 bg-skeleton rounded skeleton-pulse"></div>
                    </div>
                    <div className="bg-paper p-5">
                        <div className="h-3 w-28 bg-skeleton rounded mb-3 skeleton-pulse"></div>
                        <div className="h-8 w-20 bg-skeleton rounded skeleton-pulse"></div>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-[4fr_6fr] gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="bg-white border border-line rounded-lg p-5 h-40">
                             <div className="h-4 w-32 bg-skeleton rounded mb-6 skeleton-pulse"></div>
                             <div className="space-y-3">
                                 <div className="h-9 w-full bg-skeleton rounded skeleton-pulse"></div>
                                 <div className="h-9 w-full bg-skeleton rounded skeleton-pulse"></div>
                             </div>
                        </div>

                        <div className="bg-white border border-line rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-line">
                                <div className="h-4 w-40 bg-skeleton rounded skeleton-pulse"></div>
                            </div>
                            <div className="p-5 space-y-6">
                                {[1,2,3].map(i => (
                                  <div key={i} className="flex items-center gap-4">
                                      <div className="w-8 h-8 rounded bg-skeleton skeleton-pulse"></div>
                                      <div className="flex-1 space-y-2">
                                          <div className="h-3 w-full bg-skeleton rounded skeleton-pulse"></div>
                                          <div className="h-3 w-2/3 bg-skeleton rounded skeleton-pulse"></div>
                                      </div>
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-ink rounded-lg border border-line h-[500px] p-6 space-y-4">
                        <div className="h-4 w-48 bg-white/5 rounded skeleton-pulse"></div>
                        <div className="space-y-3 pt-6">
                            <div className="h-3 w-3/4 bg-white/5 rounded skeleton-pulse"></div>
                            <div className="h-3 w-1/2 bg-white/5 rounded skeleton-pulse"></div>
                            <div className="h-3 w-2/3 bg-white/5 rounded skeleton-pulse"></div>
                            <div className="h-3 w-full bg-white/5 rounded skeleton-pulse"></div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper text-ink font-sans antialiased min-h-screen flex flex-col selection:bg-teal-soft selection:text-teal-deep">
      {/* Top Bar */}
      <header className="h-16 bg-canvas border-b border-line flex items-center justify-between px-6 lg:px-8 shrink-0 z-20 relative">
          <div className="flex items-center gap-3">
              <span className="font-serif text-xl tracking-tight text-teal">FlowTrust</span>
              <span className="text-xs font-mono text-muted hidden sm:inline">/autonomous-collection-node</span>
          </div>
          <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage"></span> Node Active · auth_node_09
              </div>
              <button className="w-8 h-8 rounded-md border border-line flex items-center justify-center text-muted hover:bg-paper transition-colors">
                  <Settings className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white font-semibold text-xs ring-1 ring-line">
                U
              </div>
          </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

          {/* Sidebar */}
          <aside className="w-[72px] lg:w-[220px] bg-canvas border-r border-line flex flex-col py-6 shrink-0 z-10 hidden md:flex">
              <nav className="flex flex-col gap-1 px-3">
                  <a href="#" className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-sm font-medium text-ink border-l-2 border-teal bg-paper">
                      <LayoutGrid className="w-5 h-5 text-teal text-center" /><span className="hidden lg:inline">Console</span>
                  </a>
                  <a href="#" className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-paper transition-colors">
                      <FileText className="w-5 h-5 text-center" /><span className="hidden lg:inline">Invoices</span>
                  </a>
                  <a href="#" className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-paper transition-colors">
                      <LayoutGrid className="w-5 h-5 text-center" /><span className="hidden lg:inline">Ledger</span>
                  </a>
                  <a href="#" className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-paper transition-colors">
                      <Bot className="w-5 h-5 text-center" /><span className="hidden lg:inline">Agents</span>
                  </a>
                  <a href="#" className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-paper transition-colors">
                      <MessageSquare className="w-5 h-5 text-center" /><span className="hidden lg:inline">Messages</span>
                  </a>
              </nav>
              <div className="mt-auto px-3">
                  <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-paper transition-colors">
                      <LogOut className="w-5 h-5 text-center" /><span className="hidden lg:inline">Log Out</span>
                  </button>
              </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">

              {/* Lead Metrics */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line rounded-lg overflow-hidden border border-line mb-6">
                  <div className="bg-paper p-5">
                      <p className="text-xs font-medium text-muted mb-1">Total Outstanding</p>
                      <p className="font-serif text-3xl tracking-tight text-ink">${totalOutstanding.toLocaleString()}<span className="text-lg text-muted">.00</span></p>
                  </div>
                  <div className="bg-paper p-5">
                      <p className="text-xs font-medium text-muted mb-1">Active Invoices</p>
                      <p className="font-serif text-3xl tracking-tight text-ink">{invoices.length} <span className="text-sm font-sans font-medium text-sage">+1 weekly</span></p>
                  </div>
                  <div className="bg-paper p-5">
                      <p className="text-xs font-medium text-muted mb-1">Compliance Score</p>
                      <p className="font-serif text-3xl tracking-tight text-ink">98.2<span className="text-lg text-muted">%</span> <span className="w-1.5 h-1.5 inline-block align-middle ml-1 rounded-full bg-sage"></span></p>
                  </div>
              </section>

              {/* Asymmetric Two-Panel Split */}
              <section className="grid grid-cols-1 xl:grid-cols-[4fr_6fr] gap-4">

                  {/* Left Panel: Add Invoice + List */}
                  <div className="flex flex-col gap-4">

                      {/* Add Invoice Form */}
                      <article className="bg-white border border-line rounded-lg p-5">
                          <h3 className="text-sm font-semibold text-ink mb-4">Add {invoices.length === 0 && 'Your First '}Invoice</h3>
                          <form onSubmit={handleAddInvoice}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                <input type="text" value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="Client Name" className="col-span-2 w-full px-3 py-2 text-sm bg-paper border border-line rounded-md focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all placeholder:text-muted" required />
                                <input type="number" value={newDays} onChange={e => setNewDays(e.target.value)} placeholder="Days Late" className="w-full px-3 py-2 text-sm bg-paper border border-line rounded-md focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all placeholder:text-muted" required />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="Amount" className="flex-1 px-3 py-2 text-sm bg-paper border border-line rounded-md focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all placeholder:text-muted" required />
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal hover:bg-teal-deep rounded-md transition-colors shadow-sm whitespace-nowrap">Add Invoice</button>
                            </div>
                          </form>
                      </article>

                      {/* Outstanding Invoices List */}
                      {invoices.length === 0 ? (
                        <article className="bg-white border border-line rounded-lg overflow-hidden flex flex-col items-center justify-center py-20 px-6">
                            <div className="w-16 h-16 rounded-full bg-paper flex items-center justify-center border border-line mb-4">
                                <FileText className="w-8 h-8 text-line" />
                            </div>
                            <h3 className="text-base font-semibold text-ink mb-1">No invoices found</h3>
                            <p className="text-sm text-muted text-center max-w-[280px]">Add an outstanding invoice to start the autonomous collection process.</p>
                        </article>
                      ) : (
                        <article className="bg-white border border-line rounded-lg overflow-hidden overflow-x-auto">
                            <div className="px-5 py-3 border-b border-line flex items-center justify-between min-w-[500px]">
                                <h3 className="text-sm font-semibold text-ink">Outstanding Invoices</h3>
                                <span className="text-xs font-mono text-muted">{invoices.length} open</span>
                            </div>
                            <div className="px-5 py-2.5 grid grid-cols-12 gap-2 text-[11px] font-medium uppercase tracking-wide text-muted border-b border-line min-w-[500px]">
                                <div className="col-span-4">Client</div>
                                <div className="col-span-3">Amount</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-3 text-right">Actions</div>
                            </div>

                            {/* Rows */}
                            {invoices.map((invoice) => (
                              <div key={invoice.id} className="px-5 py-3 grid grid-cols-12 gap-2 items-center border-b border-line hover:bg-paper transition-colors group min-w-[500px]">
                                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                                      <div className={`w-7 h-7 rounded-md ${invoice.status === 'Overdue' ? 'bg-teal-soft text-teal' : 'bg-canvas text-ink'} flex items-center justify-center text-xs font-semibold shrink-0`}>
                                          {getInitials(invoice.client)}
                                      </div>
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-ink truncate">{invoice.client}</span>
                                        <span className="font-mono text-[10px] text-muted truncate">{invoice.id}</span>
                                      </div>
                                  </div>
                                  <div className="col-span-3 text-sm font-medium text-ink">${invoice.amount.toLocaleString()}.00</div>
                                  <div className="col-span-2">
                                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${invoice.status === 'Overdue' ? 'text-rust' : 'text-sage'} whitespace-nowrap`}>
                                          <span className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'Overdue' ? 'bg-rust' : 'bg-sage'}`}></span>
                                          {invoice.status}
                                      </span>
                                  </div>
                                  <div className="col-span-3 flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => runAgent(invoice)}
                                        disabled={loadingId === invoice.id || invoice.status === 'Draft Ready'}
                                        className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors whitespace-nowrap ${
                                          invoice.status === 'Draft Ready' ? 'text-teal bg-teal-soft hover:bg-canvas' : 'text-white bg-teal hover:bg-teal-deep'
                                        } disabled:opacity-50`}
                                      >
                                          {loadingId === invoice.id ? 'Working...' : invoice.status === 'Draft Ready' ? 'View' : 'Dispatch'}
                                      </button>
                                      <button onClick={() => deleteInvoice(invoice.id)} className="text-muted hover:text-ink transition-colors shrink-0 p-1">
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                            ))}
                        </article>
                      )}
                  </div>

                  {/* Right Panel: AI Orchestration Console */}
                  <article className="rounded-lg overflow-hidden border border-line flex flex-col min-h-[400px]">
                      <div className="bg-ink text-white px-5 py-3 flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-3">
                              <Terminal className="w-4 h-4 text-teal-soft" />
                              <h3 className="text-sm font-semibold tracking-wide">AI Orchestration Console</h3>
                          </div>
                          <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-rust/80"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-sage/80"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-teal-soft/80"></span>
                          </div>
                      </div>

                      <div className="bg-ink text-gray-300 font-mono text-xs leading-relaxed p-5 flex-1 overflow-y-auto">
                          {!agentLog ? (
                              <div className="h-full flex flex-col justify-end">
                                  <div className="space-y-2">
                                      <p className="flex items-center gap-2">
                                          <span className="text-teal-soft/40">▸</span>
                                          <span className="text-gray-500">FlowTrust AI collection node initialized...</span>
                                      </p>
                                      <p className="flex items-center gap-2">
                                          <span className="text-teal-soft/40">▸</span>
                                          <span className="text-gray-500">Awaiting invoice data for processing.</span><span className="w-2 h-3.5 bg-teal-soft/20 blink"></span>
                                      </p>
                                  </div>
                              </div>
                          ) : (
                              <div className="space-y-4">
                                  {/* Log entry */}
                                  <div className="node-line relative pl-8">
                                      <span className="text-gray-500">[System]</span> <span className="text-teal-soft">Run Initiated</span> — {agentLog.client} · {agentLog.invoiceId}
                                  </div>
                                  
                                  {/* Thinking node (if no data yet) */}
                                  {!agentLog.data && (
                                    <div className="node-line relative pl-8">
                                        <span className="text-gray-500">[Agent]</span> <span className="text-teal-soft">Thinking...</span>
                                        <p className="text-gray-500 mt-1 ml-1">Analyzing payment history, contract SLAs, and generating compliance-approved communications.</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-teal-soft">▸</span>
                                            <span className="w-2 h-3.5 bg-teal-soft blink"></span>
                                        </div>
                                    </div>
                                  )}

                                  {/* Compliance check and Output */}
                                  {agentLog.data && (
                                      <>
                                          <div className="node-line relative pl-8">
                                              <span className="text-gray-500">[Compliance]</span> <span className={agentLog.data.approved ? 'text-sage' : 'text-rust'}>{agentLog.data.approved ? 'Pass:' : 'Edited:'}</span> {agentLog.data.approved ? 'Compliance score verified. Proceeding within bounds.' : 'Message adjusted to meet compliance standards.'}
                                          </div>
                                          
                                          <div className="node-line relative pl-8">
                                              <span className="text-gray-500">[Output]</span> <span className="text-teal-soft">Drafted</span> — Email Template
                                              <div className="mt-2 border border-dashed border-gray-600 rounded-md p-3 bg-white/[0.03]">
                                                  <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                    {agentLog.data.final_message}
                                                  </div>
                                                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-700/50 pt-3">
                                                      <button className="px-3 py-1.5 text-xs font-medium text-gray-300 border border-gray-600 rounded hover:bg-white/5 transition-colors">Edit Draft</button>
                                                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-teal hover:bg-teal-deep rounded transition-colors">Approve &amp; Send</button>
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          <div className="pl-8 flex items-center gap-2">
                                              <span className="text-teal-soft">▸</span>
                                              <span className="text-gray-500">Awaiting approval</span><span className="w-2 h-3.5 bg-teal-soft blink"></span>
                                          </div>
                                      </>
                                  )}
                              </div>
                          )}
                      </div>
                  </article>
              </section>

              {/* Bottom Section: Aging Analytics Ledger */}
              {invoices.length > 0 && (
                <section className="mt-6 bg-white border border-line rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-line flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-muted mb-1">Aging Analytics Ledger</p>
                            <h2 className="font-serif text-3xl tracking-tight text-ink">${totalOutstanding.toLocaleString()}<span className="text-lg text-muted">.00</span> <span className="text-base font-sans font-medium text-muted">total outstanding</span></h2>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium">
                            <button className="px-3 py-1.5 rounded-md bg-teal text-white transition-colors">All</button>
                            <button className="px-3 py-1.5 rounded-md text-muted hover:bg-paper transition-colors">30–60 Days</button>
                            <button className="px-3 py-1.5 rounded-md text-muted hover:bg-paper transition-colors">60–90 Days</button>
                            <button className="px-3 py-1.5 rounded-md text-muted hover:bg-paper transition-colors">90+ Days</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="text-[11px] font-medium uppercase tracking-wide text-muted border-b border-line bg-paper">
                                    <th className="px-6 py-3">Invoice</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Days Past Due</th>
                                    <th className="px-6 py-3">Resolution Probability</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line text-sm">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-paper transition-colors">
                                        <td className="px-6 py-3.5 font-mono text-xs text-muted">{inv.id}</td>
                                        <td className="px-6 py-3.5 font-medium text-ink">{inv.client}</td>
                                        <td className="px-6 py-3.5 font-medium text-ink">${inv.amount.toLocaleString()}.00</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${inv.daysLate > 0 ? 'text-rust' : 'text-sage'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${inv.daysLate > 0 ? 'bg-rust' : 'bg-sage'}`}></span>
                                                {inv.daysLate > 0 ? `${inv.daysLate} days` : 'Resolved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${inv.daysLate > 0 ? 'text-rust' : 'text-sage'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${inv.daysLate > 0 ? 'bg-rust' : 'bg-sage'}`}></span>
                                                {inv.daysLate > 0 ? 'Low (24%)' : 'Cleared'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
              )}

          </main>
      </div>
    </div>
  );
}
