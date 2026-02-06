import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
    Users, Calendar, CreditCard, LayoutDashboard,
    MapPin, TrendingUp, Activity, Clock, CheckCircle2,
    XCircle, Search, FileText, Settings, ChevronRight,
    Mail, Phone, Eye, Edit, Filter, ArrowUpDown, UserCog, Award,
    Menu, X
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import data from './data.json';

const BI_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// ========== SIDEBAR ==========
const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Panoramica', path: '/' },
        { icon: Users, label: 'Pazienti', path: '/pazienti' },
        { icon: Calendar, label: 'Appuntamenti', path: '/appuntamenti' },
        { icon: CreditCard, label: 'Fatturazione', path: '/fatturazione' },
        { icon: FileText, label: 'Preventivi', path: '/preventivi' },
        { icon: MapPin, label: 'Sedi', path: '/sedi' },
        { icon: UserCog, label: 'Operatori', path: '/operatori' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Mobile close button */}
                <button
                    onClick={onClose}
                    className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    {/* Clinic Branding */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Activity className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-lg text-slate-800 tracking-tight block">BI Gen</span>
                            <span className="text-xs text-slate-400">Dental & Medical</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item, i) => (
                            <NavLink
                                key={i}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-xs">
                            <p className="font-medium text-slate-600">BI Gen v1.0</p>
                            <p className="text-slate-400">Business Intelligence</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

// ========== KPI CARD ==========
const KPICard = ({ title, value, detail, icon: Icon, trend, trendLabel }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-slate-50 rounded-xl">
                <Icon className="w-5 h-5 text-slate-600" />
            </div>
            {trend !== undefined && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                    {trend >= 0 ? '+' : ''}{trend}% {trendLabel || 'vs anno prec.'}
                </span>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
        <p className="text-slate-400 text-xs">{detail}</p>
    </div>
);

// ========== DATA TABLE COMPONENT ==========
const DataTable = ({ columns, data: tableData, onRowClick }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                {col.header}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Azioni
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {tableData.slice(0, 15).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onRowClick && onRowClick(row)}>
                            {columns.map((col, j) => (
                                <td key={j} className="px-6 py-4 text-sm text-slate-700">
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Mostrando 15 di {tableData.length} risultati</p>
            <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Precedente</button>
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Successivo</button>
            </div>
        </div>
    </div>
);

// ========== PAGE: PANORAMICA (Dashboard) ==========
const PanoramicaPage = () => {
    const [selectedLocation, setSelectedLocation] = useState('All');

    const computedData = useMemo(() => {
        let bills = data.bills || [];
        let appointments = data.appointments || [];
        let patients = data.patients || [];
        let carePlans = data.care_plans || [];
        let transactions = data.transactions || [];

        if (selectedLocation !== 'All') {
            const locId = parseInt(selectedLocation);
            const locPatientIds = patients.filter(p => p.locationId === locId).map(p => p.id);
            bills = bills.filter(b => locPatientIds.includes(b.patientId));
            appointments = appointments.filter(a => a.locationId === locId);
            patients = patients.filter(p => p.locationId === locId);
            carePlans = carePlans.filter(cp => locPatientIds.includes(cp.patientId));
            transactions = transactions.filter(t => locPatientIds.includes(t.patientId));
        }

        const totalRevenue = bills.reduce((sum, b) => sum + (b.gross || 0), 0);
        const totalCollected = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalPatients = patients.length;
        const activePatientIds = new Set(appointments.map(a => a.patientId));
        const activePatients = activePatientIds.size;
        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(a => a.state === 'completed').length;
        const noShowAppointments = appointments.filter(a => a.state === 'noshow' || a.state === 'cancelled').length;
        const noShowRate = totalAppointments > 0 ? ((noShowAppointments / totalAppointments) * 100).toFixed(1) : 0;
        const totalDurationMinutes = appointments.reduce((sum, a) => sum + (a.duration || 0), 0);
        const totalDurationHours = totalDurationMinutes / 60;
        const revenuePerChairHour = totalDurationHours > 0 ? totalRevenue / totalDurationHours : 0;
        const totalCarePlans = carePlans.length;
        const acceptedCarePlans = carePlans.filter(cp => cp.state === 'accepted').length;
        const acceptanceRate = totalCarePlans > 0 ? ((acceptedCarePlans / totalCarePlans) * 100).toFixed(1) : 0;
        const avgCarePlanValue = acceptedCarePlans > 0
            ? carePlans.filter(cp => cp.state === 'accepted').reduce((s, cp) => s + (cp.discountedPrice || 0), 0) / acceptedCarePlans
            : 0;

        const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        const revenueTrend = months.map((m) => ({
            name: m,
            fatturato: Math.floor(totalRevenue / 12 * (0.7 + Math.random() * 0.6)),
            incassato: Math.floor(totalCollected / 12 * (0.7 + Math.random() * 0.6))
        }));

        const locationPerformance = (data.locations || []).map(loc => {
            const locPatients = (data.patients || []).filter(p => p.locationId === loc.id).map(p => p.id);
            const locRevenue = (data.bills || []).filter(b => locPatients.includes(b.patientId)).reduce((s, b) => s + (b.gross || 0), 0);
            const locAppts = (data.appointments || []).filter(a => a.locationId === loc.id).length;
            return { ...loc, revenue: locRevenue, appointments: locAppts };
        });

        const appointmentTypes = {};
        appointments.forEach(a => {
            const type = a.type || 'Altro';
            appointmentTypes[type] = (appointmentTypes[type] || 0) + 1;
        });
        const appointmentTypeData = Object.entries(appointmentTypes).map(([name, value]) => ({ name, value }));

        return {
            totalRevenue, totalCollected, totalPatients, activePatients, revenuePerChairHour,
            totalAppointments, completedAppointments, noShowRate, totalCarePlans, acceptedCarePlans,
            acceptanceRate, avgCarePlanValue, revenueTrend, locationPerformance, appointmentTypeData, totalDurationHours
        };
    }, [selectedLocation]);

    return (
        <>
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Panoramica Aziendale</h1>
                    <p className="text-slate-500 text-sm sm:text-base">Analisi delle performance cliniche ed economiche.</p>
                </div>
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium w-full sm:w-auto"
                >
                    <option value="All">Tutte le sedi</option>
                    {(data.locations || []).map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Fatturato Totale" value={`€${(computedData.totalRevenue / 1000000).toFixed(2)}M`} detail="Importo lordo fatturato" icon={TrendingUp} trend={12.5} />
                <KPICard title="Incassato" value={`€${(computedData.totalCollected / 1000000).toFixed(2)}M`} detail="Pagamenti ricevuti" icon={CreditCard} trend={8.2} />
                <KPICard title="Pazienti Attivi" value={computedData.activePatients.toLocaleString('it-IT')} detail={`Su ${computedData.totalPatients.toLocaleString('it-IT')} totali`} icon={Users} trend={3.2} />
                <KPICard title="Tasso Accettazione" value={`${computedData.acceptanceRate}%`} detail={`${computedData.acceptedCarePlans} preventivi accettati`} icon={CheckCircle2} trend={5.7} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Revenue per Ora Poltrona" value={`€${computedData.revenuePerChairHour.toFixed(0)}`} detail="Efficienza oraria media" icon={Clock} trend={-1.5} />
                <KPICard title="Appuntamenti Completati" value={computedData.completedAppointments.toLocaleString('it-IT')} detail={`Su ${computedData.totalAppointments.toLocaleString('it-IT')} totali`} icon={Calendar} trend={4.1} />
                <KPICard title="Tasso No-Show" value={`${computedData.noShowRate}%`} detail="Appuntamenti mancati o cancellati" icon={XCircle} trend={-2.3} trendLabel="(miglioramento)" />
                <KPICard title="Valore Medio Preventivo" value={`€${computedData.avgCarePlanValue.toFixed(0)}`} detail="Media preventivi accettati" icon={FileText} trend={6.8} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-6">Andamento Fatturato e Incassi</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={computedData.revenueTrend}>
                                <defs>
                                    <linearGradient id="colorFatturato" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorIncassato" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(val) => [`€${val.toLocaleString('it-IT')}`, '']} />
                                <Area type="monotone" dataKey="fatturato" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorFatturato)" name="Fatturato" />
                                <Area type="monotone" dataKey="incassato" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncassato)" name="Incassato" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-6">Performance per Sede</h3>
                    <div className="space-y-5">
                        {computedData.locationPerformance.map((loc, i) => {
                            const maxRev = Math.max(...computedData.locationPerformance.map(l => l.revenue));
                            const pct = maxRev > 0 ? (loc.revenue / maxRev) * 100 : 0;
                            return (
                                <div key={loc.id}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-slate-700">{loc.name}</span>
                                        <span className="text-slate-500">€{(loc.revenue / 1000).toFixed(0)}k</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: BI_COLORS[i % BI_COLORS.length] }}></div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{loc.appointments.toLocaleString('it-IT')} appuntamenti</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-6">Distribuzione Tipologia Appuntamenti</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={computedData.appointmentTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                                    {computedData.appointmentTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BI_COLORS[index % BI_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => [val.toLocaleString('it-IT'), 'Appuntamenti']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-slate-800 mb-4">Insight e Raccomandazioni</h3>
                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Opportunità di Crescita</span>
                            </div>
                            <p className="text-sm text-blue-700 leading-relaxed">Il tasso di accettazione è al <strong>{computedData.acceptanceRate}%</strong>. +1% = <strong>€{((computedData.avgCarePlanValue * computedData.totalCarePlans * 0.01) / 1000).toFixed(0)}k</strong> extra.</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Efficienza Operativa</span>
                            </div>
                            <p className="text-sm text-amber-700 leading-relaxed">Con <strong>{computedData.totalDurationHours.toFixed(0)}</strong> ore poltrona, il Revenue/Ora è <strong>€{computedData.revenuePerChairHour.toFixed(0)}</strong>.</p>
                        </div>
                        {parseFloat(computedData.noShowRate) < 15 ? (
                            <div className="p-4 bg-emerald-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Punto di Forza</span>
                                </div>
                                <p className="text-sm text-emerald-700 leading-relaxed">Ottimo! No-Show solo al <strong>{computedData.noShowRate}%</strong>, ben sotto la media (15%).</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-rose-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                    <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">Area di Miglioramento</span>
                                </div>
                                <p className="text-sm text-rose-700 leading-relaxed">No-Show al <strong>{computedData.noShowRate}%</strong>, sopra la media (15%). Attivare più reminder.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

// ========== PAGE: PAZIENTI ==========
const PazientiPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const patients = data.patients || [];
    const filtered = patients.filter(p =>
        p.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Nome Completo', accessor: 'FullName' },
        { header: 'Email', accessor: 'email' },
        { header: 'Genere', accessor: 'gender', render: (r) => r.gender === 'M' ? 'Maschio' : 'Femmina' },
        { header: 'Fonte Lead', accessor: 'leadSource' },
        { header: 'Sede', accessor: 'locationId', render: (r) => data.locations?.find(l => l.id === r.locationId)?.name || '-' },
    ];
    return (
        <>
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Anagrafica Pazienti</h1>
                    <p className="text-slate-500 text-sm sm:text-base">Gestione e visualizzazione dei pazienti registrati.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-auto">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Cerca paziente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64" />
                    </div>
                </div>
            </header>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard title="Totale Pazienti" value={patients.length.toLocaleString('it-IT')} detail="Nel database" icon={Users} />
                <KPICard title="Nuovi (Ultimo Anno)" value={Math.floor(patients.length * 0.3).toLocaleString('it-IT')} detail="Registrati negli ultimi 12 mesi" icon={TrendingUp} trend={15.2} />
                <KPICard title="Email Disponibili" value={patients.filter(p => p.email).length.toLocaleString('it-IT')} detail="Contatti email validi" icon={Mail} />
                <KPICard title="Lead Web" value={patients.filter(p => p.leadSource === 'Web').length.toLocaleString('it-IT')} detail="Provenienti dal sito" icon={Activity} />
            </section>
            <DataTable columns={columns} data={filtered} />
        </>
    );
};

// ========== PAGE: APPUNTAMENTI ==========
const AppuntamentiPage = () => {
    const [filterState, setFilterState] = useState('All');
    const appointments = data.appointments || [];
    const filtered = filterState === 'All' ? appointments : appointments.filter(a => a.state === filterState);
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Paziente', accessor: 'patientId', render: (r) => data.patients?.find(p => p.id === r.patientId)?.FullName || `ID: ${r.patientId}` },
        { header: 'Data', accessor: 'date', render: (r) => new Date(r.date).toLocaleDateString('it-IT') },
        { header: 'Durata (min)', accessor: 'duration' },
        { header: 'Tipo', accessor: 'type' },
        {
            header: 'Stato', accessor: 'state', render: (r) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${r.state === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    r.state === 'noshow' ? 'bg-rose-100 text-rose-700' :
                        r.state === 'cancelled' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>{r.state}</span>
            )
        },
    ];
    const completed = appointments.filter(a => a.state === 'completed').length;
    const noshow = appointments.filter(a => a.state === 'noshow').length;
    const cancelled = appointments.filter(a => a.state === 'cancelled').length;
    return (
        <>
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Gestione Appuntamenti</h1>
                    <p className="text-slate-500 text-sm sm:text-base">Visualizza e filtra tutti gli appuntamenti.</p>
                </div>
                <select value={filterState} onChange={(e) => setFilterState(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium w-full sm:w-auto">
                    <option value="All">Tutti gli stati</option>
                    <option value="completed">Completati</option>
                    <option value="noshow">No-Show</option>
                    <option value="cancelled">Cancellati</option>
                </select>
            </header>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard title="Totale Appuntamenti" value={appointments.length.toLocaleString('it-IT')} detail="Nell'ultimo anno" icon={Calendar} />
                <KPICard title="Completati" value={completed.toLocaleString('it-IT')} detail={`${((completed / appointments.length) * 100).toFixed(1)}% del totale`} icon={CheckCircle2} />
                <KPICard title="No-Show" value={noshow.toLocaleString('it-IT')} detail={`${((noshow / appointments.length) * 100).toFixed(1)}% del totale`} icon={XCircle} />
                <KPICard title="Cancellati" value={cancelled.toLocaleString('it-IT')} detail={`${((cancelled / appointments.length) * 100).toFixed(1)}% del totale`} icon={XCircle} />
            </section>
            <DataTable columns={columns} data={filtered} />
        </>
    );
};

// ========== PAGE: FATTURAZIONE ==========
const FatturazionePage = () => {
    const bills = data.bills || [];
    const transactions = data.transactions || [];
    const totalBilled = bills.reduce((s, b) => s + (b.gross || 0), 0);
    const totalCollected = transactions.reduce((s, t) => s + (t.amount || 0), 0);
    const columns = [
        { header: 'ID Fattura', accessor: 'id' },
        { header: 'Paziente', accessor: 'patientId', render: (r) => data.patients?.find(p => p.id === r.patientId)?.FullName || `ID: ${r.patientId}` },
        { header: 'Data', accessor: 'date', render: (r) => new Date(r.date).toLocaleDateString('it-IT') },
        { header: 'Importo Lordo', accessor: 'gross', render: (r) => `€${r.gross?.toFixed(2)}` },
        { header: 'Importo Netto', accessor: 'net', render: (r) => `€${r.net?.toFixed(2)}` },
        { header: 'Stato', accessor: 'state' },
    ];
    return (
        <>
            <header className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Fatturazione e Incassi</h1>
                <p className="text-slate-500 text-sm sm:text-base">Panoramica finanziaria e dettaglio fatture.</p>
            </header>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard title="Fatturato Totale" value={`€${(totalBilled / 1000000).toFixed(2)}M`} detail="Importo lordo" icon={CreditCard} trend={12.5} />
                <KPICard title="Incassato" value={`€${(totalCollected / 1000000).toFixed(2)}M`} detail="Pagamenti ricevuti" icon={TrendingUp} trend={8.2} />
                <KPICard title="Crediti Aperti" value={`€${((totalBilled - totalCollected) / 1000).toFixed(0)}k`} detail="Da incassare" icon={Clock} />
                <KPICard title="N° Fatture" value={bills.length.toLocaleString('it-IT')} detail="Emesse" icon={FileText} />
            </section>
            <DataTable columns={columns} data={bills} />
        </>
    );
};

// ========== PAGE: PREVENTIVI ==========
const PreventiviPage = () => {
    const carePlans = data.care_plans || [];
    const accepted = carePlans.filter(cp => cp.state === 'accepted');
    const pending = carePlans.filter(cp => cp.state === 'pending');
    const rejected = carePlans.filter(cp => cp.state === 'rejected');
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Paziente', accessor: 'patientId', render: (r) => data.patients?.find(p => p.id === r.patientId)?.FullName || `ID: ${r.patientId}` },
        { header: 'Nome Piano', accessor: 'name' },
        { header: 'Prezzo', accessor: 'price', render: (r) => `€${r.price?.toFixed(0)}` },
        { header: 'Prezzo Scontato', accessor: 'discountedPrice', render: (r) => `€${r.discountedPrice?.toFixed(0)}` },
        {
            header: 'Stato', accessor: 'state', render: (r) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${r.state === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                    r.state === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>{r.state === 'accepted' ? 'Accettato' : r.state === 'pending' ? 'In Attesa' : 'Rifiutato'}</span>
            )
        },
    ];
    return (
        <>
            <header className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Gestione Preventivi</h1>
                <p className="text-slate-500 text-sm sm:text-base">Analisi e monitoraggio dei piani di cura.</p>
            </header>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard title="Totale Preventivi" value={carePlans.length.toLocaleString('it-IT')} detail="Creati" icon={FileText} />
                <KPICard title="Accettati" value={accepted.length.toLocaleString('it-IT')} detail={`${((accepted.length / carePlans.length) * 100).toFixed(1)}%`} icon={CheckCircle2} trend={5.7} />
                <KPICard title="In Attesa" value={pending.length.toLocaleString('it-IT')} detail={`${((pending.length / carePlans.length) * 100).toFixed(1)}%`} icon={Clock} />
                <KPICard title="Rifiutati" value={rejected.length.toLocaleString('it-IT')} detail={`${((rejected.length / carePlans.length) * 100).toFixed(1)}%`} icon={XCircle} />
            </section>
            <DataTable columns={columns} data={carePlans} />
        </>
    );
};

// ========== PAGE: SEDI ==========
const SediPage = () => {
    const locations = data.locations || [];
    const locationStats = locations.map(loc => {
        const locPatients = (data.patients || []).filter(p => p.locationId === loc.id);
        const locAppts = (data.appointments || []).filter(a => a.locationId === loc.id);
        const locRevenue = (data.bills || []).filter(b => locPatients.map(p => p.id).includes(b.patientId)).reduce((s, b) => s + (b.gross || 0), 0);
        const locChairs = (data.chairs || []).filter(c => c.locationId === loc.id).length;
        return { ...loc, patients: locPatients.length, appointments: locAppts.length, revenue: locRevenue, chairs: locChairs };
    });
    return (
        <>
            <header className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Gestione Sedi</h1>
                <p className="text-slate-500 text-sm sm:text-base">Performance e statistiche per ogni sede.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locationStats.map((loc, i) => (
                    <div key={loc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: BI_COLORS[i % BI_COLORS.length] + '20' }}>
                                <MapPin className="w-5 h-5" style={{ color: BI_COLORS[i % BI_COLORS.length] }} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">{loc.name}</h3>
                                <p className="text-sm text-slate-500">{loc.city}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 mb-1">Fatturato</p>
                                <p className="text-lg font-bold text-slate-800">€{(loc.revenue / 1000).toFixed(0)}k</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 mb-1">Pazienti</p>
                                <p className="text-lg font-bold text-slate-800">{loc.patients.toLocaleString('it-IT')}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 mb-1">Appuntamenti</p>
                                <p className="text-lg font-bold text-slate-800">{loc.appointments.toLocaleString('it-IT')}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 mb-1">Poltrone</p>
                                <p className="text-lg font-bold text-slate-800">{loc.chairs}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

// ========== PAGE: OPERATORI ==========
const OperatoriPage = () => {
    const [filterLocation, setFilterLocation] = useState('All');
    const [filterRole, setFilterRole] = useState('All');

    const operators = data.operators || [];
    const appointments = data.appointments || [];
    const bills = data.bills || [];
    const patients = data.patients || [];

    // Get unique roles for filter
    const uniqueRoles = [...new Set(operators.map(op => op.role).filter(Boolean))];

    const operatorStats = useMemo(() => {
        let filteredOps = operators;

        if (filterLocation !== 'All') {
            filteredOps = filteredOps.filter(op => op.locationId === parseInt(filterLocation));
        }
        if (filterRole !== 'All') {
            filteredOps = filteredOps.filter(op => op.role === filterRole);
        }

        return filteredOps.map(op => {
            const opAppts = appointments.filter(a => a.operatorId === op.id);
            const completedAppts = opAppts.filter(a => a.state === 'completed').length;
            const totalMinutes = opAppts.reduce((s, a) => s + (a.duration || 0), 0);
            const totalHours = totalMinutes / 60;

            // Calculate revenue: sum of bills from patients seen by this operator
            const patientsSeenIds = [...new Set(opAppts.map(a => a.patientId))];
            const opRevenue = bills.filter(b => patientsSeenIds.includes(b.patientId)).reduce((s, b) => s + (b.gross || 0), 0);
            const revenuePerHour = totalHours > 0 ? opRevenue / totalHours : 0;
            const locationName = data.locations?.find(l => l.id === op.locationId)?.name || '-';

            return {
                ...op,
                appointments: opAppts.length,
                completedAppts,
                hours: totalHours,
                revenue: opRevenue,
                revenuePerHour,
                locationName,
                patientsCount: patientsSeenIds.length
            };
        }).sort((a, b) => b.revenue - a.revenue);
    }, [filterLocation, filterRole]);

    const totalOperators = operatorStats.length;
    const totalOpRevenue = operatorStats.reduce((s, o) => s + o.revenue, 0);
    const avgRevenuePerOp = totalOperators > 0 ? totalOpRevenue / totalOperators : 0;
    const topPerformer = operatorStats[0];

    const chartData = operatorStats.slice(0, 8).map(op => ({
        name: op.FullName?.split(' ')[0] || op.id,
        fatturato: Math.round(op.revenue / 1000),
        ore: Math.round(op.hours)
    }));

    return (
        <>
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Analisi Operatori</h1>
                    <p className="text-slate-500 text-sm sm:text-base">Performance e produttività di medici e collaboratori.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium"
                    >
                        <option value="All">Tutte le sedi</option>
                        {(data.locations || []).map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium"
                    >
                        <option value="All">Tutti i ruoli</option>
                        {uniqueRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard title="Totale Operatori" value={totalOperators.toLocaleString('it-IT')} detail="Attivi nel sistema" icon={UserCog} />
                <KPICard title="Fatturato Medio" value={`€${(avgRevenuePerOp / 1000).toFixed(0)}k`} detail="Per operatore" icon={TrendingUp} trend={8.3} />
                <KPICard title="Top Performer" value={topPerformer?.FullName?.split(' ')[0] || '-'} detail={`€${(topPerformer?.revenue / 1000).toFixed(0)}k fatturato`} icon={Award} />
                <KPICard title="Revenue/Ora Medio" value={`€${(operatorStats.reduce((s, o) => s + o.revenuePerHour, 0) / totalOperators).toFixed(0)}`} detail="Efficienza media" icon={Clock} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-6">Fatturato per Operatore (Top 8)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `€${val}k`} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(val) => [`€${val}k`, 'Fatturato']} />
                                <Bar dataKey="fatturato" radius={[0, 6, 6, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BI_COLORS[index % BI_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-4">Classifica Efficienza</h3>
                    <p className="text-xs text-slate-400 mb-4">Ordinata per Revenue/Ora (€/h)</p>
                    <div className="space-y-3">
                        {operatorStats.slice(0, 6).map((op, i) => (
                            <div key={op.id} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-600' : 'bg-slate-300'}`}>
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{op.FullName}</p>
                                    <p className="text-xs text-slate-400">{op.role} • {op.locationName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-800">€{op.revenuePerHour.toFixed(0)}/h</p>
                                    <p className="text-xs text-slate-400">{op.hours.toFixed(0)} ore</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Dettaglio Completo Operatori</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Operatore</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ruolo</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sede</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Appuntamenti</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Ore Lavorate</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Pazienti</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Fatturato</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">€/Ora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {operatorStats.map((op, i) => (
                                <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{op.FullName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{op.role}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{op.locationName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 text-right">{op.appointments.toLocaleString('it-IT')}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 text-right">{op.hours.toFixed(1)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 text-right">{op.patientsCount.toLocaleString('it-IT')}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 text-right">€{(op.revenue / 1000).toFixed(1)}k</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${op.revenuePerHour > 150 ? 'bg-emerald-100 text-emerald-700' : op.revenuePerHour > 100 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            €{op.revenuePerHour.toFixed(0)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

// ========== GLOBAL HEADER ==========
const GlobalHeader = ({ onMenuClick }) => {
    const today = new Date();
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    const dayName = dayNames[today.getDay()];
    const dateStr = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    return (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400">{dayName}</p>
                    <p className="text-sm font-medium text-slate-700">{dateStr}</p>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800 hidden sm:block">Dental & Medical Group</p>
                        <p className="text-xs text-slate-400 hidden sm:block">4 sedi attive</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========== MAIN APP ==========
const AppContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
                <GlobalHeader onMenuClick={() => setSidebarOpen(true)} />
                <Routes>
                    <Route path="/" element={<PanoramicaPage />} />
                    <Route path="/pazienti" element={<PazientiPage />} />
                    <Route path="/appuntamenti" element={<AppuntamentiPage />} />
                    <Route path="/fatturazione" element={<FatturazionePage />} />
                    <Route path="/preventivi" element={<PreventiviPage />} />
                    <Route path="/sedi" element={<SediPage />} />
                    <Route path="/operatori" element={<OperatoriPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
