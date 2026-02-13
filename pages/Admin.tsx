
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent, Amenity, FAQItem, Stat, ConnectivityItem, ConstructionUpdateItem } from '../types';
import { getContent, saveContent, loginAdmin, verifyToken, getLeads, LeadRecord } from '../services/contentService';
import { 
  Lock, LogOut, Save, Plus, Trash2, LayoutDashboard, 
  Home, Info, Dumbbell, Map, Building2, HelpCircle, FileText, Users, Download
} from 'lucide-react';

const ADMIN_TOKEN_KEY = 'adminToken';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Content State
  const [content, setContent] = useState<AppContent | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'amenities' | 'connectivity' | 'developer' | 'faq' | 'leads'>('hero');
  const [notification, setNotification] = useState('');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState('');
  const tabOptions: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'Project Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'connectivity', label: 'Connectivity' },
    { id: 'developer', label: 'Developer Info' },
    { id: 'faq', label: 'FAQ Manager' },
    { id: 'leads', label: 'Leads' }
  ];
  const adminTextFix = `
    .admin-panel input,
    .admin-panel textarea,
    .admin-panel select {
      color: #000 !important;
    }
    .admin-panel input::placeholder,
    .admin-panel textarea::placeholder {
      color: #6b7280 !important;
      opacity: 1;
    }
  `;

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) {
        if (mounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      const isValid = await verifyToken(token);
      if (!isValid) {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        if (mounted) {
          setIsAuthenticated(false);
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const data = await getContent();
        if (mounted) {
          setContent(data);
          setIsAuthenticated(true);
        }
      } finally {
        if (mounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const loadLeads = async () => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setIsLeadsLoading(true);
    setLeadsError('');
    try {
      const data = await getLeads(token);
      setLeads(data);
    } catch {
      setLeadsError('Could not load leads. Please refresh.');
    } finally {
      setIsLeadsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leads') {
      loadLeads();
    }
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginAdmin(email, password);
      const data = await getContent();
      sessionStorage.setItem(ADMIN_TOKEN_KEY, result.token);
      setIsAuthenticated(true);
      setContent(data);
      setError('');
    } catch {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate('/');
  };

  const handleSave = async () => {
    if (content) {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) {
        setError('Session expired. Please login again.');
        setIsAuthenticated(false);
        return;
      }

      try {
        await saveContent(content, token);
        setNotification('Changes saved successfully!');
        setTimeout(() => setNotification(''), 3000);
      } catch {
        setError('Failed to save changes. Please login again.');
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setIsAuthenticated(false);
      }
    }
  };

  // --- Handlers ---

  const handleHeroChange = (field: keyof AppContent['hero'], value: string) => {
    if (!content) return;
    setContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const handleAboutChange = (field: keyof AppContent['about'], value: string) => {
    if (!content) return;
    setContent({ ...content, about: { ...content.about, [field]: value } });
  };

  const handleAmenityChange = (id: string, field: keyof Amenity, value: string) => {
    if (!content) return;
    const newItems = content.amenities.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setContent({ ...content, amenities: { ...content.amenities, items: newItems } });
  };

  const addAmenity = () => {
     if(!content) return;
     const newId = Date.now().toString();
     setContent({
         ...content,
         amenities: {
             ...content.amenities,
             items: [...content.amenities.items, { id: newId, title: 'New Amenity', icon: 'Star' }]
         }
     });
  }

  const deleteAmenity = (id: string) => {
      if(!content) return;
      setContent({
          ...content,
          amenities: {
              ...content.amenities,
              items: content.amenities.items.filter(i => i.id !== id)
          }
      });
  }

  const handleConnectivityChange = (field: keyof AppContent['connectivity'], value: string) => {
     if(!content) return;
     // @ts-ignore
     setContent({ ...content, connectivity: { ...content.connectivity, [field]: value } });
  };

  const handleConnectivityItemChange = (id: string, field: keyof ConnectivityItem, value: string) => {
    if (!content) return;
    const newItems = content.connectivity.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setContent({ ...content, connectivity: { ...content.connectivity, items: newItems } });
  };
  
  const addConnectivityItem = () => {
      if(!content) return;
      const newId = Date.now().toString();
      setContent({
          ...content,
          connectivity: {
              ...content.connectivity,
              items: [...content.connectivity.items, { id: newId, location: 'New Location', time: '10 Mins' }]
          }
      });
  }

  const deleteConnectivityItem = (id: string) => {
      if(!content) return;
      setContent({
          ...content,
          connectivity: {
              ...content.connectivity,
              items: content.connectivity.items.filter(i => i.id !== id)
          }
      });
  }

  const handleDeveloperChange = (field: keyof AppContent['developer'], value: string) => {
      if(!content) return;
      setContent({...content, developer: {...content.developer, [field]: value}});
  }

  const handleStatChange = (id: string, field: keyof Stat, value: string) => {
     if (!content) return;
     const newStats = content.developer.stats.map(s => 
       s.id === id ? { ...s, [field]: value } : s
     );
     setContent({ ...content, developer: { ...content.developer, stats: newStats } });
  };

  const handleUpdateChange = (id: string, field: keyof ConstructionUpdateItem, value: string) => {
      if(!content) return;
      const newUpdates = (content.developer.updates || []).map(u => 
        u.id === id ? { ...u, [field]: value } : u
      );
      setContent({ ...content, developer: { ...content.developer, updates: newUpdates }});
  };

  const addUpdate = () => {
      if(!content) return;
      const newId = Date.now().toString();
      const newUpdate: ConstructionUpdateItem = {
          id: newId,
          title: 'New Tower',
          description: 'Works Started',
          status: 'In Progress',
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop'
      };
      setContent({
          ...content,
          developer: {
              ...content.developer,
              updates: [...(content.developer.updates || []), newUpdate]
          }
      });
  };

  const deleteUpdate = (id: string) => {
      if(!content) return;
      setContent({
          ...content,
          developer: {
              ...content.developer,
              updates: content.developer.updates.filter(u => u.id !== id)
          }
      });
  };

  const handleFAQChange = (id: string, field: keyof FAQItem, value: string) => {
    if (!content) return;
    const newFaq = content.faq.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    );
    setContent({ ...content, faq: newFaq });
  };

  const addFAQ = () => {
     if(!content) return;
     const newId = Date.now().toString();
     setContent({
        ...content,
        faq: [...content.faq, { id: newId, question: 'New Question', answer: 'New Answer' }]
     });
  };

  const deleteFAQ = (id: string) => {
     if(!content) return;
     setContent({
        ...content,
        faq: content.faq.filter(f => f.id !== id)
     });
  };

  const downloadLeadsCsv = () => {
    const headers = ['id', 'name', 'phone', 'email', 'source', 'notes', 'created_at'];
    const escapeCsv = (value: unknown) => {
      const text = String(value ?? '');
      if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };
    const rows = leads.map((lead) =>
      [lead.id, lead.name, lead.phone, lead.email || '', lead.source, lead.notes || '', lead.created_at]
        .map(escapeCsv)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vignaharta_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isBootstrapping) {
    return <div className="flex h-screen items-center justify-center text-green-600">Loading Dashboard...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-panel min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
        <style>{adminTextFix}</style>
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-gray-900 opacity-90"></div>
             <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Background" />
        </div>

        <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95 border border-white/20 mx-4">
          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                <Lock size={32} />
             </div>
          </div>
          <h2 className="text-3xl font-display text-center text-gray-800 mb-2">Admin Login</h2>
          <p className="text-center text-gray-500 text-sm mb-8">Manage your real estate content securely</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <input
                type="password"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
              />
            </div>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
            
            <button
              type="submit"
              className="w-full bg-green-700 text-white font-bold py-4 rounded-lg hover:bg-green-800 transition-transform active:scale-95 shadow-lg uppercase tracking-wider text-sm"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!content) return <div className="flex h-screen items-center justify-center text-green-600">Loading Dashboard...</div>;

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center px-6 py-4 transition-colors relative group ${
            activeTab === id 
            ? 'text-green-700 bg-green-50 font-bold' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
        <Icon size={20} className={`mr-4 ${activeTab === id ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
        <span className="text-sm tracking-wide">{label}</span>
        {activeTab === id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600"></div>}
    </button>
  );

  return (
    <div className="admin-panel min-h-screen bg-gray-100 flex flex-col font-sans">
      <style>{adminTextFix}</style>
      {/* Top Bar */}
      <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-8 fixed w-full z-20">
        <div className="flex items-center">
             <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">V</div>
             <span className="font-display font-bold text-lg md:text-xl text-gray-800">Vignaharta <span className="text-gray-400 font-normal hidden sm:inline">Panel</span></span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
             <a href="#/" target="_blank" className="text-gray-500 hover:text-green-600 text-xs md:text-sm font-medium flex items-center">
                 <LayoutDashboard size={16} className="md:mr-2"/> <span className="hidden md:inline">View Live Site</span>
             </a>
             <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
             <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center">
                 <LogOut size={16} className="md:mr-2"/> <span className="hidden md:inline">Logout</span>
             </button>
        </div>
      </header>

      <div className="flex pt-16 h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto hidden md:block">
            <div className="py-6">
                <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Content Modules</p>
                <nav>
                    <NavItem id="hero" icon={Home} label="Hero Section" />
                    <NavItem id="about" icon={Info} label="Project Overview" />
                    <NavItem id="amenities" icon={Dumbbell} label="Amenities" />
                    <NavItem id="connectivity" icon={Map} label="Connectivity" />
                    <NavItem id="developer" icon={Building2} label="Developer Info" />
                    <NavItem id="faq" icon={HelpCircle} label="FAQ Manager" />
                    <NavItem id="leads" icon={Users} label="Leads" />
                </nav>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
            <div className="max-w-5xl mx-auto">
                {/* Mobile Module Switcher */}
                <div className="md:hidden mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Content Module
                    </label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                    >
                      {tabOptions.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                          {tab.label}
                        </option>
                      ))}
                    </select>
                </div>
                
                {/* Header for Content Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab === 'about' ? 'Project Overview' : activeTab.replace(/([A-Z])/g, ' $1').trim()}</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage content for the {activeTab} section.</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="w-full md:w-auto flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 font-bold tracking-wide"
                    >
                        <Save size={18} className="mr-2" /> Save Changes
                    </button>
                </div>

                {/* Notifications */}
                {notification && (
                    <div className="mb-8 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center shadow-sm animate-fade-in-up">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {notification}
                    </div>
                )}

                {/* Forms */}
                <div className="space-y-8 animate-fade-in-up">
                    
                    {/* HERO SECTION */}
                    {activeTab === 'hero' && (
                        <div className="grid gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center"><FileText size={18} className="mr-2 text-green-600"/> Main Headlines</h3>
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Top Tagline</label>
                                        <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all" 
                                            value={content.hero.title} onChange={(e) => handleHeroChange('title', e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Name (Large Display)</label>
                                        <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all font-display text-lg" 
                                            value={content.hero.projectName} onChange={(e) => handleHeroChange('projectName', e.target.value)} />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                                        <textarea rows={2} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all" 
                                            value={content.hero.subtitle} onChange={(e) => handleHeroChange('subtitle', e.target.value)} />
                                    </div>
                                     <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location Text</label>
                                        <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all" 
                                            value={content.hero.location} onChange={(e) => handleHeroChange('location', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">Pricing Configuration</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Offer 1</label>
                                        <input type="text" placeholder="Label (e.g. 1 BHK)" className="w-full mb-2 p-2 border rounded" value={content.hero.price1Label} onChange={(e) => handleHeroChange('price1Label', e.target.value)} />
                                        <input type="text" placeholder="Price" className="w-full p-2 border rounded font-bold text-green-700" value={content.hero.price1Value} onChange={(e) => handleHeroChange('price1Value', e.target.value)} />
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Offer 2</label>
                                        <input type="text" placeholder="Label (e.g. 2 BHK)" className="w-full mb-2 p-2 border rounded" value={content.hero.price2Label} onChange={(e) => handleHeroChange('price2Label', e.target.value)} />
                                        <input type="text" placeholder="Price" className="w-full p-2 border rounded font-bold text-green-700" value={content.hero.price2Value} onChange={(e) => handleHeroChange('price2Value', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABOUT SECTION */}
                    {activeTab === 'about' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <h3 className="font-bold text-gray-800 mb-6">Project Overview</h3>
                             <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all" 
                                        value={content.about.title} onChange={(e) => handleAboutChange('title', e.target.value)} />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description Content</label>
                                    <textarea rows={12} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all leading-relaxed" 
                                        value={content.about.description} onChange={(e) => handleAboutChange('description', e.target.value)} />
                                    <p className="text-xs text-gray-400 mt-2 text-right">Supports multi-line text</p>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* AMENITIES SECTION */}
                    {activeTab === 'amenities' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Section Headlines</h3>
                                <div className="grid gap-4">
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg" value={content.amenities.title} onChange={(e) => setContent({ ...content, amenities: { ...content.amenities, title: e.target.value } })} placeholder="Title" />
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg" value={content.amenities.subtitle} onChange={(e) => setContent({ ...content, amenities: { ...content.amenities, subtitle: e.target.value } })} placeholder="Subtitle" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-800">Amenities List</h3>
                                    <button onClick={addAmenity} className="text-xs flex items-center bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 px-3 py-2 rounded-lg transition-colors font-bold uppercase tracking-wide">
                                        <Plus size={14} className="mr-2"/> Add Amenity
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {content.amenities.items.map((item) => (
                                    <div key={item.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative group hover:border-green-300 transition-colors">
                                        <button onClick={() => deleteAmenity(item.id)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="mb-3">
                                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Title</label>
                                            <input type="text" className="w-full p-2 border border-gray-200 rounded bg-white text-sm font-medium" value={item.title} onChange={(e) => handleAmenityChange(item.id, 'title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Icon ID</label>
                                            <input type="text" className="w-full p-2 border border-gray-200 rounded bg-white text-xs font-mono text-gray-500" value={item.icon} onChange={(e) => handleAmenityChange(item.id, 'icon', e.target.value)} />
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONNECTIVITY SECTION */}
                    {activeTab === 'connectivity' && (
                        <div className="space-y-6">
                             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Connectivity Details</h3>
                                <div className="space-y-4">
                                     <input type="text" className="w-full p-3 border border-gray-200 rounded-lg" value={content.connectivity.title} onChange={(e) => handleConnectivityChange('title', e.target.value)} placeholder="Title" />
                                     <textarea rows={3} className="w-full p-3 border border-gray-200 rounded-lg" value={content.connectivity.description} onChange={(e) => handleConnectivityChange('description', e.target.value)} placeholder="Description" />
                                     <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Google Maps Embed URL</label>
                                        <input type="text" className="w-full p-2 border border-gray-200 rounded bg-gray-50 text-xs font-mono text-gray-600 mt-1" value={content.connectivity.mapUrl} onChange={(e) => handleConnectivityChange('mapUrl', e.target.value)} />
                                     </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-800">Nearby Locations</h3>
                                    <button onClick={addConnectivityItem} className="text-xs flex items-center bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 px-3 py-2 rounded-lg transition-colors font-bold uppercase tracking-wide">
                                        <Plus size={14} className="mr-2"/> Add Location
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {content.connectivity.items.map((item) => (
                                    <div key={item.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 flex gap-4 items-center relative group">
                                        <div className="flex-grow">
                                            <input type="text" className="w-full p-2 border border-gray-200 rounded mb-2 text-sm font-bold text-gray-800" value={item.location} onChange={(e) => handleConnectivityItemChange(item.id, 'location', e.target.value)} placeholder="Location Name" />
                                            <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs text-gray-600" value={item.time} onChange={(e) => handleConnectivityItemChange(item.id, 'time', e.target.value)} placeholder="Time (e.g. 5 Mins)" />
                                        </div>
                                        <button onClick={() => deleteConnectivityItem(item.id)} className="p-2 text-gray-300 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DEVELOPER SECTION */}
                    {activeTab === 'developer' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">About Developer</h3>
                                <div className="space-y-4">
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg" value={content.developer.title} onChange={(e) => handleDeveloperChange('title', e.target.value)} />
                                    <textarea rows={6} className="w-full p-3 border border-gray-200 rounded-lg" value={content.developer.description} onChange={(e) => handleDeveloperChange('description', e.target.value)} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-6">Key Statistics</h3>
                                    <div className="space-y-4">
                                        {content.developer.stats.map((stat) => (
                                            <div key={stat.id} className="flex gap-4">
                                                <div className="w-1/2">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Value</label>
                                                    <input type="text" className="w-full p-2 border rounded font-bold text-green-800" value={stat.value} onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)} />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Label</label>
                                                    <input type="text" className="w-full p-2 border rounded" value={stat.label} onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-gray-800">Construction Updates</h3>
                                        <button onClick={addUpdate} className="text-xs flex items-center bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 px-3 py-2 rounded-lg transition-colors font-bold uppercase tracking-wide">
                                            <Plus size={14} className="mr-2"/> Add Update
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {content.developer.updates && content.developer.updates.map((update) => (
                                            <div key={update.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative group">
                                                <button onClick={() => deleteUpdate(update.id)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Location / Title</label>
                                                        <input type="text" className="w-full p-2 border border-gray-200 rounded text-sm font-bold text-gray-800" value={update.title} onChange={(e) => handleUpdateChange(update.id, 'title', e.target.value)} placeholder="e.g. Tower A" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Work Description</label>
                                                        <input type="text" className="w-full p-2 border border-gray-200 rounded text-sm text-gray-600" value={update.description} onChange={(e) => handleUpdateChange(update.id, 'description', e.target.value)} placeholder="e.g. Excavation Complete" />
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Current Status</label>
                                                        <select 
                                                            className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                                                            value={update.status}
                                                            onChange={(e) => handleUpdateChange(update.id, 'status', e.target.value)}
                                                        >
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="Ready">Ready</option>
                                                            <option value="On Hold">On Hold</option>
                                                        </select>
                                                    </div>
                                                     <div>
                                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Image URL</label>
                                                        <input type="text" className="w-full p-2 border border-gray-200 rounded text-xs text-blue-600" value={update.image} onChange={(e) => handleUpdateChange(update.id, 'image', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FAQ SECTION */}
                    {activeTab === 'faq' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <div className="flex justify-between items-center mb-8">
                                <h3 className="font-bold text-gray-800">Frequently Asked Questions</h3>
                                <button onClick={addFAQ} className="text-xs flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-bold uppercase tracking-wide shadow-md">
                                    <Plus size={14} className="mr-2"/> Add Question
                                </button>
                             </div>

                             <div className="space-y-4">
                                {content.faq.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50 group hover:border-green-300 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Q {item.id}</span>
                                            <button onClick={() => deleteFAQ(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <input type="text" className="w-full p-3 border border-gray-200 rounded-lg mb-3 font-bold text-gray-800 focus:ring-2 focus:ring-green-100 outline-none" 
                                            value={item.question} onChange={(e) => handleFAQChange(item.id, 'question', e.target.value)} placeholder="Enter Question" />
                                        <textarea rows={3} className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:ring-2 focus:ring-green-100 outline-none" 
                                            value={item.answer} onChange={(e) => handleFAQChange(item.id, 'answer', e.target.value)} placeholder="Enter Answer" />
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* LEADS SECTION */}
                    {activeTab === 'leads' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-800">Submitted Leads</h3>
                                    <p className="text-sm text-gray-500 mt-1">All enquiries, brochure requests, and price sheet requests.</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={loadLeads}
                                    className="inline-flex items-center justify-center bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
                                  >
                                    Refresh Leads
                                  </button>
                                  <button
                                    onClick={downloadLeadsCsv}
                                    className="inline-flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black"
                                  >
                                    <Download size={16} className="mr-2" /> Download CSV
                                  </button>
                                </div>
                            </div>

                            {isLeadsLoading && <div className="text-sm text-gray-500">Loading leads...</div>}
                            {leadsError && <div className="text-sm text-red-600">{leadsError}</div>}

                            {!isLeadsLoading && !leadsError && (
                              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                  <table className="min-w-full text-sm text-gray-900">
                                      <thead className="bg-gray-50 text-gray-600">
                                          <tr>
                                              <th className="text-left p-3">Date</th>
                                              <th className="text-left p-3">Name</th>
                                              <th className="text-left p-3">Phone</th>
                                              <th className="text-left p-3">Email</th>
                                              <th className="text-left p-3">Source</th>
                                              <th className="text-left p-3">Notes</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {leads.length === 0 && (
                                            <tr>
                                              <td className="p-4 text-gray-500" colSpan={6}>No leads yet.</td>
                                            </tr>
                                          )}
                                          {leads.map((lead) => (
                                            <tr key={lead.id} className="border-t border-gray-100 align-top">
                                              <td className="p-3 whitespace-nowrap text-gray-800">{new Date(lead.created_at).toLocaleString()}</td>
                                              <td className="p-3 text-gray-900 font-medium">{lead.name}</td>
                                              <td className="p-3 whitespace-nowrap text-gray-800">{lead.phone}</td>
                                              <td className="p-3 text-gray-800">{lead.email || '-'}</td>
                                              <td className="p-3 capitalize whitespace-nowrap text-gray-800">{lead.source.replace('_', ' ')}</td>
                                              <td className="p-3 text-gray-700">{lead.notes || '-'}</td>
                                            </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </main>
      </div>
    </div>
  );
};
