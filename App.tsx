
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingBag, 
  Store, 
  User as UserIcon, 
  LogIn, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Star,
  Sparkles,
  ArrowRight,
  Package,
  Heart,
  ShieldCheck,
  Zap,
  Globe,
  Watch,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  Box,
  MapPin,
  Clock,
  Share2,
  Twitter,
  Facebook,
  Link as LinkIcon
} from 'lucide-react';
import { AccountType, User, Product, CartItem } from './types';
import { generateProductDescription } from './geminiService';

// --- Constants & Utilities ---

const EXCHANGE_RATES: Record<string, number> = {
  NGN: 1,
  USD: 0.000625, // 1/1600
  EUR: 0.000571  // 1/1750
};

const formatCurrency = (price: number, currency: string) => {
  const converted = price * EXCHANGE_RATES[currency];
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'NGN' ? 'NGN' : currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: currency === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(converted).replace('NGN', '₦');
};

// --- Components ---

const Navbar: React.FC<{ 
  user: User | null; 
  onLogout: () => void; 
  onOpenAuth: () => void;
  cartCount: number;
  onViewCart: () => void;
  onNavigate: (page: string) => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
}> = ({ user, onLogout, onOpenAuth, cartCount, onViewCart, onNavigate, currency, onCurrencyChange }) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => onNavigate('home')}
          >
            <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-white mr-4 shadow-xl group-hover:scale-105 transition-transform">
              <ShoppingBag size={24} />
            </div>
            <span className="text-3xl font-serif font-bold tracking-tighter text-slate-950">VORA</span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <button onClick={() => onNavigate('shop')} className="text-slate-600 hover:text-slate-950 font-semibold tracking-wide text-xs uppercase transition-colors">Collections</button>
            <button onClick={() => onNavigate('shop')} className="text-slate-600 hover:text-slate-950 font-semibold tracking-wide text-xs uppercase transition-colors">Watch House</button>
            {user?.type === AccountType.BUSINESS && (
              <button onClick={() => onNavigate('dashboard')} className="text-indigo-600 font-bold text-xs uppercase flex items-center gap-1.5">
                <Store size={16} /> Partner Dashboard
              </button>
            )}
          </div>

          <div className="flex items-center space-x-5">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors p-2"
              >
                {currency} <ChevronDown size={12} className={`transition-transform duration-300 ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute top-full right-0 mt-2 w-24 bg-white border border-slate-100 shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                  {['NGN', 'USD', 'EUR'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onCurrencyChange(c);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${currency === c ? 'text-slate-950' : 'text-slate-400'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => onNavigate('shop')}
              className="p-2 text-slate-500 hover:text-slate-950 transition-colors"
            >
              <Search size={22} />
            </button>
            
            {user ? (
              <div className="flex items-center gap-5">
                 {user.type === AccountType.USER && (
                   <button onClick={onViewCart} className="relative p-2 text-slate-500 hover:text-slate-950 transition-colors">
                     <ShoppingBag size={22} />
                     {cartCount > 0 && (
                       <span className="absolute -top-1 -right-1 bg-slate-950 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">
                         {cartCount}
                       </span>
                     )}
                   </button>
                 )}
                 <div className="flex items-center gap-4 pl-5 border-l border-slate-200">
                   <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.type}</p>
                     <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                   </div>
                   <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-600 transition-all">
                     <LogIn size={22} className="rotate-180" />
                   </button>
                 </div>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="bg-slate-950 text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Page Components ---

const Hero = ({ onShopNow }: { onShopNow: () => void }) => (
  <section className="relative overflow-hidden bg-[#fafafa] min-h-[85vh] flex items-center">
    <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
      <img 
        src="https://images.unsplash.com/photo-1441984908747-5a39bb646450?auto=format&fit=crop&q=80&w=1200" 
        className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
        alt="Hero Fashion"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] to-transparent"></div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      <div className="max-w-2xl">
        <span className="inline-block px-5 py-2 mb-8 text-xs font-bold tracking-[0.2em] text-slate-950 uppercase border border-slate-300 rounded-full">
          The Haute Couture House
        </span>
        <h1 className="text-6xl lg:text-9xl font-serif font-bold text-slate-950 leading-[0.9] mb-10">
          Timeless <br />
          <span className="italic text-slate-400">Elegance.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg font-light">
          Discover a curated universe of the finest timepieces and high-fashion collections. 
          Crafted for the bold, the refined, and the timeless.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={onShopNow}
            className="w-full sm:w-auto px-12 py-6 bg-slate-950 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-none hover:bg-slate-800 hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            Shop Collection <ArrowRight size={18} />
          </button>
          <button onClick={onShopNow} className="w-full sm:w-auto px-12 py-6 bg-transparent text-slate-950 text-xs font-bold uppercase tracking-[0.2em] border border-slate-300 rounded-none hover:bg-slate-100 transition-all">
            Watch House
          </button>
        </div>
      </div>
    </div>
  </section>
);

const CategoryShowcase: React.FC<{ onSelect: (cat: string) => void }> = ({ onSelect }) => {
  const categories = [
    { name: 'Luxury Watches', image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800', count: 'Heritage Timepieces' },
    { name: 'Fine Jewelry', image: 'https://images.unsplash.com/photo-1599643478118-d02272596a42?auto=format&fit=crop&q=80&w=800', count: 'Diamonds & Precious Metals' },
    { name: 'Male Collection', image: 'https://images.unsplash.com/photo-1593032465175-481ac7f402a1?auto=format&fit=crop&q=80&w=600', count: 'Luxury Suits & Wear' },
    { name: 'Female Collection', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600', count: 'High-End Couture' },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {categories.map((cat) => (
            <div 
              key={cat.name} 
              onClick={() => onSelect(cat.name)}
              className="group relative h-[600px] overflow-hidden cursor-pointer"
            >
              <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={cat.name} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute bottom-12 left-10 right-10 text-center">
                <h3 className="text-2xl font-serif font-bold text-white mb-3">{cat.name}</h3>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em]">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => (
  <section className="py-32 bg-[#0a0a0a] text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
        <div className="text-center">
          <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-10 hover:border-white transition-colors">
            <ShieldCheck size={32} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-serif font-bold mb-6 italic tracking-wide">Authenticity Guaranteed</h3>
          <p className="text-slate-400 font-light leading-loose text-sm px-4">Every piece in our collection is meticulously vetted by our curators for total authenticity.</p>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-10 hover:border-white transition-colors">
            <Globe size={32} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-serif font-bold mb-6 italic tracking-wide">Global Concierge</h3>
          <p className="text-slate-400 font-light leading-loose text-sm px-4">Our premium logistics network ensures your pieces arrive in pristine condition, anywhere in the world.</p>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-10 hover:border-white transition-colors">
            <Watch size={32} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-serif font-bold mb-6 italic tracking-wide">Watch Restoration</h3>
          <p className="text-slate-400 font-light leading-loose text-sm px-4">Access our exclusive network of master watchmakers for lifetime care and restoration services.</p>
        </div>
      </div>
    </div>
  </section>
);

const CheckoutPage: React.FC<{ items: CartItem[]; currency: string; onComplete: (ref: string) => void; onBack: () => void; onTrack: (ref: string) => void }> = ({ items, currency, onComplete, onBack, onTrack }) => {
  const [step, setStep] = useState(1);
  const [orderRef, setOrderRef] = useState('');
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15000;
  const total = subtotal + shipping;

  const handlePay = () => {
    const ref = `VORA-2025-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setOrderRef(ref);
    setStep(3);
    onComplete(ref);
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <h2 className="text-3xl font-serif font-bold mb-6">Your bag is empty</h2>
        <button onClick={onBack} className="text-slate-950 font-bold uppercase tracking-widest text-xs border-b-2 border-slate-950 pb-2">Back to Collection</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 animate-in fade-in duration-700">
      {step < 3 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <div className="flex items-center gap-4 mb-12">
              <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-950 transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <h1 className="text-4xl font-serif font-bold">Secure Checkout</h1>
            </div>

            <div className="flex gap-8 mb-16 border-b border-slate-100 pb-8">
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${step >= 1 ? 'text-slate-950' : 'text-slate-300'}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${step >= 1 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200'}`}>1</span>
                Shipping
              </div>
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${step >= 2 ? 'text-slate-950' : 'text-slate-300'}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${step >= 2 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200'}`}>2</span>
                Payment
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">First Name</label>
                    <input type="text" className="w-full border-b border-slate-200 py-4 focus:border-slate-950 outline-none font-light bg-transparent" placeholder="James" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Name</label>
                    <input type="text" className="w-full border-b border-slate-200 py-4 focus:border-slate-950 outline-none font-light bg-transparent" placeholder="Sterling" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shipping Address</label>
                  <input type="text" className="w-full border-b border-slate-200 py-4 focus:border-slate-950 outline-none font-light bg-transparent" placeholder="123 Luxury Ave, Victoria Island" />
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-6 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.4em] mt-12 hover:bg-slate-800 transition-all"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div className="p-8 border border-slate-950 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <CreditCard size={24} strokeWidth={1} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Credit or Debit Card</p>
                      <p className="text-[10px] text-slate-400">Secure encrypted payment</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handlePay}
                  className="w-full py-6 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-xl"
                >
                  Pay {formatCurrency(total, currency)}
                </button>
                <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors w-full text-center">Return to Shipping</button>
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-12 lg:sticky lg:top-32 h-fit border border-slate-100">
            <h2 className="text-xl font-serif font-bold mb-10 pb-6 border-b border-slate-200">Order Summary</h2>
            <div className="space-y-8 mb-10">
              {items.map(item => (
                <div key={item.id} className="flex gap-6">
                  <img src={item.imageUrl} className="w-20 h-24 object-cover grayscale-[0.2]" alt="" />
                  <div className="flex-1">
                    <p className="font-serif font-bold text-slate-950">{item.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.category}</p>
                    <p className="text-sm font-light mt-2">{formatCurrency(item.price, currency)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest">Total</span>
                <span className="text-3xl font-serif font-bold">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-slate-950 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <CheckCircle2 size={48} strokeWidth={1} />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-6 italic">Excellence Awaits.</h1>
          <p className="text-slate-400 font-light text-lg leading-loose mb-12">
            Your collection has been secured. Our concierge team will notify you as soon as your pieces are ready for transit.
          </p>
          <div className="p-8 border border-slate-100 bg-slate-50 mb-12 text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Order Reference</p>
            <p className="font-mono text-xs text-slate-950">{orderRef}</p>
          </div>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => onTrack(orderRef)}
              className="w-full py-6 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-xl"
            >
              Track My Order
            </button>
            <button 
              onClick={onBack}
              className="w-full py-6 bg-white border border-slate-200 text-slate-950 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-50 transition-all"
            >
              Return to Gallery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderTrackingPage: React.FC<{ initialId?: string; onBack: () => void }> = ({ initialId = '', onBack }) => {
  const [trackingId, setTrackingId] = useState(initialId);
  const [isSearching, setIsSearching] = useState(initialId !== '');
  const [orderFound, setOrderFound] = useState(initialId !== '');

  const statuses = [
    { label: 'Order Secured', status: 'completed', desc: 'Our concierge has verified your request.', icon: ShieldCheck, time: 'Dec 24, 10:20 AM' },
    { label: 'Curation Phase', status: 'current', desc: 'Master tailors are preparing your collection.', icon: Clock, time: 'In Progress' },
    { label: 'Sealed for Transit', status: 'pending', desc: 'Secured in climate-controlled vault.', icon: Box, time: 'Pending' },
    { label: 'Concierge Delivery', status: 'pending', desc: 'White-glove delivery to your location.', icon: Truck, time: 'Pending' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setIsSearching(true);
    // Simulation
    setTimeout(() => {
      setOrderFound(true);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto text-center mb-24">
        <h1 className="text-6xl font-serif font-bold text-slate-900 mb-8 italic">Order Concierge</h1>
        <p className="text-slate-400 font-light text-lg uppercase tracking-[0.2em]">Track the heritage of your secured pieces</p>
      </div>

      {!orderFound ? (
        <div className="max-w-xl mx-auto bg-white p-12 lg:p-16 border border-slate-100 shadow-xl">
           <form onSubmit={handleSearch} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Reference ID</label>
                <input 
                  type="text" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  className="w-full border-b border-slate-200 py-4 focus:border-slate-950 outline-none text-xl font-light bg-transparent uppercase" 
                  placeholder="VORA-2025-XXXXXX"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full py-6 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isSearching ? 'Accessing Ledger...' : 'Access Order Status'}
              </button>
           </form>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-1 space-y-12">
               <div className="p-10 bg-slate-950 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-2">Tracking Reference</p>
                  <h3 className="text-2xl font-serif font-bold mb-10">{trackingId}</h3>
                  <div className="flex items-center gap-4 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Active Consignment</span>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="text-slate-400" size={20} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Destination</p>
                      <p className="text-sm font-light text-slate-600">Victoria Island, Lagos, NG</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="text-slate-400" size={20} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Estimated Arrival</p>
                      <p className="text-sm font-light text-slate-600">Dec 28, 2025</p>
                    </div>
                  </div>
               </div>

               <button 
                onClick={() => setOrderFound(false)}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-950 border-b border-slate-200 pb-1"
               >
                 Track another order
               </button>
            </div>

            <div className="lg:col-span-2">
               <div className="relative space-y-0">
                  {statuses.map((item, idx) => (
                    <div key={idx} className="flex gap-12 group last:mb-0 mb-16">
                       <div className="relative flex flex-col items-center">
                          <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${
                            item.status === 'completed' ? 'bg-slate-950 text-white border-slate-950' : 
                            item.status === 'current' ? 'bg-white text-slate-950 border-slate-950 shadow-xl' : 
                            'bg-slate-50 text-slate-300 border-slate-100'
                          }`}>
                            <item.icon size={24} strokeWidth={1} />
                          </div>
                          {idx !== statuses.length - 1 && (
                            <div className={`w-[1px] h-full my-2 transition-all duration-1000 ${
                              item.status === 'completed' ? 'bg-slate-950' : 'bg-slate-100'
                            }`}></div>
                          )}
                       </div>
                       <div className="pt-2 flex-1 pb-16">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className={`text-xl font-serif font-bold ${item.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>
                               {item.label}
                             </h4>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.time}</span>
                          </div>
                          <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm">
                            {item.desc}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetailPage: React.FC<{ 
  product: Product; 
  allProducts: Product[];
  onAddToCart: (p: Product) => void; 
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  currency: string;
}> = ({ product, allProducts, onAddToCart, onBack, onSelectProduct, currency }) => {
  const [isCopied, setIsCopied] = useState(false);
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product, allProducts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-24">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-slate-400 hover:text-slate-950 transition-colors mb-12 uppercase text-[10px] font-bold tracking-[0.2em]"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32">
          <div className="space-y-8">
            <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
              <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
              <div className="absolute top-8 left-8">
                <span className="bg-slate-950 text-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em]">{product.category}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">{product.sellerName}</p>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-950 mb-8 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6 mb-12">
               <span className="text-4xl font-light text-slate-950">{formatCurrency(product.price, currency)}</span>
            </div>

            <div className="space-y-8 mb-16">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Provenance & Details</h3>
                <p className="text-lg text-slate-600 leading-relaxed font-light italic">"{product.description}"</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-[2] py-6 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                Add To Bag <ArrowRight size={18} />
              </button>
            </div>

            {/* Social Sharing Section */}
            <div className="pt-10 border-t border-slate-100">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                 <Share2 size={14} /> Share Piece
               </p>
               <div className="flex gap-4">
                  <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all">
                    <Twitter size={18} />
                  </button>
                  <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all">
                    <Facebook size={18} />
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 px-6 h-12 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all"
                  >
                    <LinkIcon size={16} /> {isCopied ? 'Copied' : 'Copy Link'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-slate-50 py-32 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Curated Pairings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {relatedProducts.map(p => (
                <div key={p.id} onClick={() => onSelectProduct(p)} className="cursor-pointer">
                  <ProductCard product={p} onAddToCart={onAddToCart} currency={currency} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const ProductCard: React.FC<{ 
  product: Product; 
  onAddToCart: (p: Product) => void; 
  isSeller?: boolean;
  onViewDetails?: (p: Product) => void;
  currency: string;
}> = ({ product, onAddToCart, isSeller, onViewDetails, currency }) => (
  <div 
    className="group bg-transparent overflow-hidden transition-all duration-700 cursor-pointer"
    onClick={() => onViewDetails && onViewDetails(product)}
  >
    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
      {/* Zoom effect on hover */}
      <img 
        src={product.imageUrl} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
        alt={product.name} 
      />
      
      {/* Wishlist icon reveal on hover */}
      <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="p-3 bg-white/90 backdrop-blur-md text-slate-950 rounded-full shadow-lg hover:bg-slate-950 hover:text-white transition-all"
        >
          <Heart size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="absolute bottom-6 left-6 right-6 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        {!isSeller && (
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full py-4 bg-white/95 backdrop-blur-md text-slate-950 text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-950 hover:text-white transition-all"
          >
            Add To Bag
          </button>
        )}
      </div>
    </div>
    <div className="pt-8 pb-12 text-center">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">{product.sellerName}</p>
      <h3 className="text-xl font-serif font-bold text-slate-950 mb-3">{product.name}</h3>
      <div className="flex items-center justify-center gap-4">
        <span className="text-lg font-light text-slate-950">{formatCurrency(product.price, currency)}</span>
      </div>
    </div>
  </div>
);

const Cart: React.FC<{ 
  items: CartItem[]; 
  onUpdateQuantity: (id: string, delta: number) => void; 
  onRemove: (id: string) => void; 
  onClose: () => void;
  onCheckout: () => void;
  currency: string;
}> = ({ items, onUpdateQuantity, onRemove, onClose, onCheckout, currency }) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-12 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">Your Bag</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking widest">{items.length} items collected</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={32} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <ShoppingBag size={80} strokeWidth={1} className="mb-6" />
              <p className="text-lg font-serif italic">Your bag is currently empty.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-8">
                <img src={item.imageUrl} className="w-24 h-32 object-cover bg-slate-100 grayscale-[0.3]" alt="" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif font-bold text-slate-950 text-lg">{item.name}</h3>
                    <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={18} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-slate-400 hover:text-slate-950 transition-colors">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-slate-400 hover:text-slate-950 transition-colors">+</button>
                    </div>
                    <span className="font-light text-slate-950">{formatCurrency(item.price * item.quantity, currency)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-12 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-end mb-10">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Subtotal</span>
              <span className="text-4xl font-serif font-bold text-slate-950">{formatCurrency(total, currency)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-8 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
            >
              Complete Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Auth Components ---

const AuthModal: React.FC<{ 
  onClose: () => void; 
  onLogin: (u: User) => void; 
}> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState<AccountType>(AccountType.USER);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || 'John Doe',
      type: accountType
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white p-12 lg:p-16 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-950 transition-colors">
          <X size={24} />
        </button>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 italic">Welcome Back</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-b border-slate-200 py-3 focus:border-slate-950 outline-none bg-transparent" placeholder="alex@example.com" />
          </div>
          <button type="submit" className="w-full py-6 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.4em] mt-10 hover:bg-slate-800 transition-all shadow-xl">Enter The House</button>
        </form>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ 
  user: User; 
  products: Product[]; 
  onAddProduct: (p: Product) => void; 
  onDeleteProduct: (id: string) => void; 
  onViewDetails: (p: Product) => void;
  currency: string;
}> = ({ user, products, onAddProduct, onDeleteProduct, onViewDetails, currency }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const myProducts = products.filter(p => p.sellerId === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div>
          <h1 className="text-6xl font-serif font-bold text-slate-900 italic">Partner Dashboard</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-10 py-5 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 shadow-xl"><Plus size={18} /> List New Piece</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="p-12 bg-slate-50 border border-slate-100">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total Value</p>
           <h3 className="text-4xl font-serif font-bold italic">{formatCurrency(myProducts.reduce((acc, p) => acc + p.price, 0), currency)}</h3>
        </div>
      </div>
      <div className="mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {myProducts.map(product => (
            <div key={product.id} className="relative group">
               <ProductCard product={product} onAddToCart={() => {}} isSeller={true} onViewDetails={onViewDetails} currency={currency} />
               <button onClick={() => onDeleteProduct(product.id)} className="absolute top-4 left-4 p-3 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Collection');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currency, setCurrency] = useState('NGN');
  const [activeTrackingId, setActiveTrackingId] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const initialProducts: Product[] = [
    // --- WATCHES ---
    { id: 'w1', name: 'Oyster Perpetual Royal', description: 'Ultimate statement in horological excellence.', price: 12500000, category: 'Luxury Watches', imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800', sellerId: 's_watch', sellerName: 'Vora Watch House' },
    { id: 'w2', name: 'Gold Chronograph Master', description: 'Performance meets 18k solid gold prestige.', price: 32000000, category: 'Luxury Watches', imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800', sellerId: 's_watch', sellerName: 'Vora Watch House' },
    { id: 'w3', name: 'Diamond Encrusted Petite', description: 'A jewelry piece that happens to tell time.', price: 25000000, category: 'Luxury Watches', imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800', sellerId: 's_watch', sellerName: 'Vora Watch House' },
    { id: 'w4', name: 'Silver Heritage Watch', description: 'Brushed silver with sapphire crystal coating.', price: 4200000, category: 'Luxury Watches', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800', sellerId: 's_watch', sellerName: 'Vora Watch House' },
    
    // --- JEWELRY ---
    { id: 'j1', name: 'Diamond Solitaire Necklace', description: 'A perfect 2-carat diamond set in platinum.', price: 15000000, category: 'Fine Jewelry', imageUrl: 'https://images.unsplash.com/photo-1599643478118-d02272596a42?auto=format&fit=crop&q=80&w=800', sellerId: 's_jewel', sellerName: 'Vora Atelier' },
    { id: 'j2', name: '18k Gold Link Chain', description: 'Hand-linked Italian gold of the highest purity.', price: 3500000, category: 'Fine Jewelry', imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=800', sellerId: 's_jewel', sellerName: 'Vora Atelier' },
    { id: 'j3', name: 'Eternal Diamond Band', description: 'Infinity setting with brilliant-cut diamonds.', price: 5500000, category: 'Fine Jewelry', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', sellerId: 's_jewel', sellerName: 'Vora Atelier' },
    { id: 'j4', name: 'Celestial Diamond Studs', description: 'Stars captured in high-clarity diamond earrings.', price: 2800000, category: 'Fine Jewelry', imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800', sellerId: 's_jewel', sellerName: 'Vora Atelier' },
    { id: 'j5', name: 'Majestic Gold Hoops', description: 'A timeless silhouette in 22k gold.', price: 1850000, category: 'Fine Jewelry', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', sellerId: 's_jewel', sellerName: 'Vora Atelier' },

    // --- FASHION ---
    { id: 'm1', name: 'Italian Navy Wool Suit', description: 'Tailored using Super 150s Italian wool.', price: 850000, category: 'Male Collection', imageUrl: 'https://images.unsplash.com/photo-1593032465175-481ac7f402a1?auto=format&fit=crop&q=80&w=800', sellerId: 's_fashion', sellerName: 'Vora Couture' },
    { id: 'f1', name: 'Ivory Satin Gown', description: 'Ethereal drape meets architectural precision.', price: 1200000, category: 'Female Collection', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', sellerId: 's_fashion', sellerName: 'Vora Couture' },
    { id: 'f2', name: 'Silk Slip Dress (Champagne)', description: 'Liquid silk that drapes beautifully over the form.', price: 450000, category: 'Female Collection', imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=800', sellerId: 's_fashion', sellerName: 'Vora Couture' },
    { id: 'f3', name: 'Cashmere Wrap Coat', description: 'The ultimate in winter luxury. 100% Mongolian cashmere.', price: 950000, category: 'Female Collection', imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800', sellerId: 's_fashion', sellerName: 'Vora Couture' },
    { id: 'f4', name: 'Midnight Lace Gown', description: 'Intricate French lace with hand-sewn detailing.', price: 1850000, category: 'Female Collection', imageUrl: 'https://images.unsplash.com/photo-1518911710364-17ec553bde5d?auto=format&fit=crop&q=80&w=800', sellerId: 's_fashion', sellerName: 'Vora Couture' },
    { id: 'f5', name: 'Structured Leather Tote', description: 'Italian calfskin with signature gold hardware.', price: 650000, category: 'Female Collection', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', sellerId: 's_fashion', sellerName: 'Vora Couture' },
    { id: 'f6', name: 'Crystal Embellished Stilettos', description: 'Hand-applied crystals on delicate silk mesh.', price: 580000, category: 'Female Collection', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800', sellerId: 's_fashion', sellerName: 'Vora Couture' },
  ];

  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(i => i.id !== id));

  const handleLogout = () => { setUser(null); setCurrentPage('home'); setSelectedProduct(null); };

  const handleViewDetails = (p: Product) => { setSelectedProduct(p); setCurrentPage('product-detail'); };

  const handleNavigate = (page: string) => { 
    setCurrentPage(page); 
    setSelectedProduct(null); 
    setActiveTrackingId('');
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleTrackOrder = (id: string) => {
    setActiveTrackingId(id);
    setCurrentPage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'All Collection') result = result.filter(p => p.category === selectedCategory);
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [products, selectedCategory, searchQuery]);

  const categories = ['All Collection', 'Luxury Watches', 'Fine Jewelry', 'Male Collection', 'Female Collection'];

  return (
    <div className="min-h-screen flex flex-col selection:bg-slate-950 selection:text-white">
      <Navbar 
        user={user} onLogout={handleLogout} onOpenAuth={() => setShowAuth(true)} 
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onViewCart={() => setShowCart(true)} onNavigate={handleNavigate}
        currency={currency} onCurrencyChange={setCurrency}
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-1000">
            <Hero onShopNow={() => handleNavigate('shop')} />
            <CategoryShowcase onSelect={(cat) => { setSelectedCategory(cat); handleNavigate('shop'); }} />
            <section className="py-32 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-24">
                  <h2 className="text-5xl font-serif font-bold text-slate-900 mb-6">Seasonal Highlights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {products.slice(0, 6).map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} onViewDetails={handleViewDetails} currency={currency} />)}
                </div>
              </div>
            </section>
            <BenefitsSection />
          </div>
        )}

        {currentPage === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-32 animate-in fade-in duration-1000">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-24 gap-12">
              <div>
                <h1 className="text-6xl font-serif font-bold text-slate-900 mb-6 italic">The House Catalog</h1>
                <p className="text-slate-400 font-light uppercase tracking-[0.2em] text-sm">Discover your next signature piece</p>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] font-bold uppercase tracking-[0.4em] pb-2 transition-all border-b-2 ${
                      selectedCategory === cat 
                        ? 'border-slate-950 text-slate-950' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} onViewDetails={handleViewDetails} currency={currency} />)}
            </div>
          </div>
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage product={selectedProduct} allProducts={products} onAddToCart={addToCart} onBack={() => handleNavigate('shop')} onSelectProduct={handleViewDetails} currency={currency} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage items={cartItems} currency={currency} onComplete={() => setCartItems([])} onBack={() => handleNavigate('shop')} onTrack={handleTrackOrder} />
        )}

        {currentPage === 'tracking' && (
          <OrderTrackingPage initialId={activeTrackingId} onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'dashboard' && user && user.type === AccountType.BUSINESS && (
          <Dashboard user={user} products={products} onAddProduct={(p) => setProducts([p, ...products])} onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))} onViewDetails={handleViewDetails} currency={currency} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:col-span-1 lg:grid-cols-4 gap-20 mb-24">
            <div className="col-span-1 md:col-span-2">
              <span className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">VORA</span>
              <p className="text-slate-400 text-lg max-w-sm mt-8 font-light leading-relaxed">Exclusive destination for the world's most refined collections.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-950 mb-8 uppercase tracking-[0.3em] text-[10px]">Service</h4>
              <ul className="space-y-6 text-slate-400 font-light text-sm">
                <li><button onClick={() => handleNavigate('tracking')} className="hover:text-slate-950 transition-colors">Track Order</button></li>
                <li><button className="hover:text-slate-950 transition-colors">Watch Servicing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-950 mb-8 uppercase tracking-[0.3em] text-[10px]">Information</h4>
              <ul className="space-y-6 text-slate-400 font-light text-sm">
                <li><button className="hover:text-slate-950 transition-colors">House Heritage</button></li>
                <li><button className="hover:text-slate-950 transition-colors">Private Concierge</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={(u) => { setUser(u); handleNavigate('shop'); }} />}
      {showCart && <Cart items={cartItems} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); handleNavigate('checkout'); }} currency={currency} />}
    </div>
  );
}
