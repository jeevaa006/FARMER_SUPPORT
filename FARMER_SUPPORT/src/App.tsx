/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Search, 
  User, 
  CircleDollarSign, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ArrowRight,
  Loader2,
  ChevronRight,
  Info,
  Languages,
  MessageSquare,
  FileText,
  Send
} from 'lucide-react';
import { checkEligibility, FarmerProfile, Scheme, askAgriAdvisor } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Lang = 'en' | 'ta';

const translations = {
  en: {
    title: "Farmer Support",
    heroTitle: "Find Government Schemes Easily",
    heroSub: "Enter your details to see which agricultural schemes you can apply for.",
    checkBtn: "Check Eligibility",
    profileTitle: "Your Details",
    nameLabel: "Full Name",
    stateLabel: "State",
    districtLabel: "District",
    landLabel: "Land Size (Acres)",
    categoryLabel: "Farmer Category",
    cropsLabel: "Crops You Grow",
    incomeLabel: "Annual Income",
    irrigationLabel: "Irrigation Type",
    insuranceLabel: "Crop Insurance",
    soilLabel: "Soil Type",
    findBtn: "Find Schemes",
    analyzing: "Analyzing...",
    readyTitle: "Ready to Help",
    readySub: "Fill the form to see available schemes.",
    resultsTitle: "Available Schemes",
    whyEligible: "Why you are",
    benefits: "Benefits",
    formalities: "How to Apply",
    documents: "Required Documents",
    applyNow: "Apply Now",
    source: "Official Source",
    home: "Home",
    schemes: "Schemes",
    support: "Support",
    advisorTitle: "AI Agri-Advisor",
    advisorSub: "Ask any farming related question",
    advisorPlaceholder: "e.g., How to improve rice yield in clay soil?",
    askBtn: "Ask Question",
    allCategories: "All Categories",
    categories: {
      Irrigation: "Irrigation",
      Crops: "Crops",
      Livestock: "Livestock",
      Machinery: "Machinery",
      Insurance: "Insurance",
      Financial: "Financial",
      Other: "Other"
    },
    states: ["Tamil Nadu", "Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Karnataka", "Andhra Pradesh", "Gujarat", "Madhya Pradesh", "Rajasthan", "West Bengal", "Bihar", "Other"],
    districts: {
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Tiruppur", "Vellore", "Thanjavur", "Thoothukudi", "Other"],
      "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Other"],
      "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Other"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Prayagraj", "Other"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Other"],
      "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Other"],
      "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Other"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Other"],
      "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Other"],
      "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Other"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Other"],
      "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Other"],
      "Other": ["Other"]
    },
    farmerCategories: {
      "Small/Marginal": "Small/Marginal",
      "Medium": "Medium",
      "Large": "Large",
      "SC/ST": "SC/ST",
      "Women Farmer": "Women Farmer"
    },
    crops: ["Rice", "Wheat", "Maize", "Sugarcane", "Cotton", "Pulses", "Vegetables", "Fruits", "Spices"],
    incomeRanges: ["Below ₹1 Lakh", "₹1 - ₹2.5 Lakh", "₹2.5 - ₹5 Lakh", "Above ₹5 Lakh"],
    irrigationTypes: {
      "Rainfed": "Rainfed",
      "Canal": "Canal",
      "Tube Well": "Tube Well",
      "Drip/Sprinkler": "Drip/Sprinkler"
    },
    eligibilityLabels: {
      "Eligible": "Eligible",
      "Potentially Eligible": "Potentially Eligible",
      "Not Eligible": "Not Eligible"
    },
    insuranceOptions: {
      "None": "None",
      "Active": "Active (PMFBY)",
      "Expired": "Expired"
    },
    soilTypes: {
      "Alluvial": "Alluvial",
      "Red": "Red",
      "Black": "Black",
      "Laterite": "Laterite",
      "Desert": "Desert",
      "Mountain": "Mountain"
    }
  },
  ta: {
    title: "விவசாயி ஆதரவு",
    heroTitle: "அரசு திட்டங்களை எளிதாகக் கண்டறியவும்",
    heroSub: "நீங்கள் எந்த விவசாயத் திட்டங்களுக்கு விண்ணப்பிக்கலாம் என்பதைப் பார்க்க உங்கள் விவரங்களை உள்ளிடவும்.",
    checkBtn: "தகுதியைச் சரிபார்க்கவும்",
    profileTitle: "உங்கள் விவரங்கள்",
    nameLabel: "முழு பெயர்",
    stateLabel: "மாநிலம்",
    districtLabel: "மாவட்டம்",
    landLabel: "நில அளவு (ஏக்கர்)",
    categoryLabel: "விவசாயி வகை",
    cropsLabel: "நீங்கள் வளர்க்கும் பயிர்கள்",
    incomeLabel: "ஆண்டு வருமானம்",
    irrigationLabel: "பாசன வகை",
    insuranceLabel: "பயிர் காப்பீடு",
    soilLabel: "மண் வகை",
    findBtn: "திட்டங்களைக் கண்டறியவும்",
    analyzing: "ஆராய்கிறது...",
    readyTitle: "உதவத் தயார்",
    readySub: "கிடைக்கக்கூடிய திட்டங்களைக் காண படிவத்தை நிரப்பவும்.",
    resultsTitle: "கிடைக்கக்கூடிய திட்டங்கள்",
    whyEligible: "நீங்கள் ஏன்",
    benefits: "நன்மைகள்",
    formalities: "விண்ணப்பிப்பது எப்படி",
    documents: "தேவையான ஆவணங்கள்",
    applyNow: "இப்போது விண்ணப்பிக்கவும்",
    source: "அதிகாரப்பூர்வ ஆதாரம்",
    home: "முகப்பு",
    schemes: "திட்டங்கள்",
    support: "ஆதரவு",
    advisorTitle: "AI விவசாய ஆலோசகர்",
    advisorSub: "விவசாயம் தொடர்பான எந்தக் கேள்வியையும் கேளுங்கள்",
    advisorPlaceholder: "உதாரணமாக: களிமண்ணில் நெல் விளைச்சலை அதிகரிப்பது எப்படி?",
    askBtn: "கேள்வி கேளுங்கள்",
    allCategories: "அனைத்து பிரிவுகள்",
    categories: {
      Irrigation: "நீர்ப்பாசனம்",
      Crops: "பயிர்கள்",
      Livestock: "கால்நடை",
      Machinery: "இயந்திரங்கள்",
      Insurance: "காப்பீடு",
      Financial: "நிதி",
      Other: "மற்றவை"
    },
    states: ["தமிழ்நாடு", "பஞ்சாப்", "ஹரியானா", "உத்தரபிரதேசம்", "மகாராஷ்டிரா", "கர்நாடகா", "ஆந்திரப் பிரதேசம்", "குஜராத்", "மத்தியப் பிரதேசம்", "ராஜஸ்தான்", "மேற்கு வங்காளம்", "பீகார்", "மற்றவை"],
    districts: {
      "Tamil Nadu": ["சென்னை", "கோயம்புத்தூர்", "மதுரை", "திருச்சி", "சேலம்", "ஈரோடு", "திருப்பூர்", "வேலூர்", "தஞ்சாவூர்", "தூத்துக்குடி", "மற்றவை"],
      "Punjab": ["அமிர்தசரஸ்", "லூதியானா", "ஜலந்தர்", "பாட்டியாலா", "பதிண்டா", "மொஹாலி", "மற்றவை"],
      "Haryana": ["குருகிராம்", "பரிதாபாத்", "பானிபட்", "அம்பாலா", "ஹிசார்", "மற்றவை"],
      "Uttar Pradesh": ["லக்னோ", "கான்பூர்", "ஆக்ரா", "வாரணாசி", "மீரட்", "பிரயாக்ராஜ்", "மற்றவை"],
      "Maharashtra": ["மும்பை", "புனே", "நாக்பூர்", "நாசிக்", "தானே", "அவுரங்காபாத்", "மற்றவை"],
      "Karnataka": ["பெங்களூரு", "மைசூரு", "ஹூப்பள்ளி", "மங்களூரு", "பெலகாவி", "மற்றவை"],
      "Andhra Pradesh": ["விசாகப்பட்டினம்", "விஜயவாடா", "குண்டூர்", "நெல்லூர்", "கர்னூல்", "மற்றவை"],
      "Gujarat": ["அகமதாபாத்", "சூரத்", "வதோதரா", "ராஜ்கோட்", "பாவநகர்", "மற்றவை"],
      "Madhya Pradesh": ["இந்தூர்", "போபால்", "ஜபல்பூர்", "குவாலியர்", "உஜ்ஜைன்", "மற்றவை"],
      "Rajasthan": ["ஜெய்ப்பூர்", "ஜோத்பூர்", "கோட்டா", "பிகானேர்", "அஜ்மீர்", "மற்றவை"],
      "West Bengal": ["கொல்கத்தா", "ஹவுரா", "துர்காபூர்", "அசன்சோல்", "சிலிகுரி", "மற்றவை"],
      "Bihar": ["பாட்னா", "கயா", "பாகல்பூர்", "முசாபர்பூர்", "பூர்னியா", "மற்றவை"],
      "Other": ["மற்றவை"]
    },
    farmerCategories: {
      "Small/Marginal": "சிறிய/குறு",
      "Medium": "நடுத்தர",
      "Large": "பெரிய",
      "SC/ST": "SC/ST",
      "Women Farmer": "பெண் விவசாயி"
    },
    crops: ["நெல்", "கோதுமை", "சோளம்", "கரும்பு", "பருத்தி", "பருப்பு வகைகள்", "காய்கறிகள்", "பழங்கள்", "வாசனை திரவியங்கள்"],
    incomeRanges: ["₹1 லட்சத்திற்கும் கீழே", "₹1 - ₹2.5 லட்சம்", "₹2.5 - ₹5 லட்சம்", "₹5 லட்சத்திற்கு மேல்"],
    irrigationTypes: {
      "Rainfed": "மழைநீர்",
      "Canal": "கால்வாய்",
      "Tube Well": "குழாய் கிணறு",
      "Drip/Sprinkler": "சொட்டுநீர்/தெளிப்பு"
    },
    eligibilityLabels: {
      "Eligible": "தகுதியுடையவர்",
      "Potentially Eligible": "தகுதி பெற வாய்ப்புள்ளது",
      "Not Eligible": "தகுதியற்றவர்"
    },
    insuranceOptions: {
      "None": "இல்லை",
      "Active": "செயலில் உள்ளது (PMFBY)",
      "Expired": "காலாவதியானது"
    },
    soilTypes: {
      "Alluvial": "வண்டல் மண்",
      "Red": "செம்மண்",
      "Black": "கரிசல் மண்",
      "Laterite": "சரளை மண்",
      "Desert": "பாலைவன மண்",
      "Mountain": "மலை மண்"
    }
  }
};

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [loading, setLoading] = useState(false);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorQuestion, setAdvisorQuestion] = useState('');
  const [advisorAnswer, setAdvisorAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<Scheme[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [profile, setProfile] = useState<FarmerProfile>({
    name: '',
    state: 'Tamil Nadu',
    district: 'Chennai',
    landSize: '',
    primaryCrops: '',
    annualIncome: 'Below ₹1 Lakh',
    category: 'Small/Marginal',
    irrigationType: 'Rainfed',
    insuranceStatus: 'None',
    soilType: 'Alluvial'
  });

  const t = translations[lang];

  const handleReset = () => {
    setProfile({
      name: '',
      state: 'Tamil Nadu',
      district: 'Chennai',
      landSize: '',
      primaryCrops: '',
      annualIncome: 'Below ₹1 Lakh',
      category: 'Small/Marginal',
      irrigationType: 'Rainfed',
      insuranceStatus: 'None',
      soilType: 'Alluvial'
    });
    setSelectedCrops([]);
    setResults(null);
    setAdvisorAnswer(null);
    setAdvisorQuestion('');
    setSelectedCategory('All');
  };

  const handleAdvisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorQuestion.trim()) return;
    setAdvisorLoading(true);
    try {
      const answer = await askAgriAdvisor(advisorQuestion, profile, lang);
      setAdvisorAnswer(answer);
    } catch (error) {
      console.error(error);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalProfile = {
        ...profile,
        primaryCrops: selectedCrops.join(', ')
      };
      const schemes = await checkEligibility(finalProfile, lang);
      setResults(schemes);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'state') {
      const firstDistrict = (translations.en.districts[value as keyof typeof translations.en.districts] || translations.en.districts["Other"])[0];
      setProfile(prev => ({ ...prev, state: value, district: firstDistrict }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCropToggle = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ta' : 'en');
  };

  const filteredResults = results?.filter(s => selectedCategory === 'All' || s.category === selectedCategory) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Simple Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="text-emerald-600" size={24} />
            <span className="font-bold text-lg tracking-tight">{t.title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Languages size={16} />
              {lang === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Simple Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{t.heroTitle}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t.heroSub}</p>
        </div>

        <div className="space-y-8">
          {/* Dashboard Header: Weather & Market (New Feature) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                </motion.div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Weather' : 'வானிலை'}</p>
                <p className="text-lg font-bold">32°C <span className="text-sm font-normal text-slate-500">{lang === 'en' ? 'Sunny' : 'வெயில்'}</span></p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <CircleDollarSign size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Rice Price' : 'நெல் விலை'}</p>
                <p className="text-lg font-bold">₹2,200 <span className="text-xs text-emerald-500 font-bold">↑ 2%</span></p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Insurance' : 'காப்பீடு'}</p>
                <p className="text-lg font-bold">PMFBY <span className="text-xs text-blue-500 font-bold">Active</span></p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <Info size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Helpline' : 'உதவி எண்'}</p>
                <p className="text-lg font-bold">1551</p>
              </div>
            </div>
          </div>

          {/* AI Agri-Advisor Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 z-0" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t.advisorTitle}</h2>
                  <p className="text-sm text-slate-500">{t.advisorSub}</p>
                </div>
              </div>

              <form onSubmit={handleAdvisorSubmit} className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={advisorQuestion}
                    onChange={(e) => setAdvisorQuestion(e.target.value)}
                    placeholder={t.advisorPlaceholder}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 min-h-[100px] resize-none"
                  />
                  <button 
                    disabled={advisorLoading || !advisorQuestion.trim()}
                    type="submit"
                    className="absolute bottom-4 right-4 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                  >
                    {advisorLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </div>
                {advisorAnswer && (
                  <button 
                    type="button"
                    onClick={() => { setAdvisorAnswer(null); setAdvisorQuestion(''); }}
                    className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                  >
                    <XCircle size={12} /> {lang === 'en' ? 'Clear Conversation' : 'உரையாடலை அழி'}
                  </button>
                )}
              </form>

              <AnimatePresence>
                {advisorAnswer && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-100 text-slate-700 text-sm leading-relaxed"
                  >
                    <p className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                      <Sprout size={16} /> {lang === 'en' ? 'Advisor Response:' : 'ஆலோசகர் பதில்:'}
                    </p>
                    <div className="markdown-body">
                      <Markdown>{advisorAnswer}</Markdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Landscape Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <User size={24} className="text-emerald-600" /> {t.profileTitle}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <User size={16} className="text-emerald-500" /> {t.nameLabel}
                  </label>
                  <input required name="name" value={profile.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50" />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> {t.stateLabel}
                  </label>
                  <select name="state" value={profile.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 appearance-none">
                    {t.states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Search size={16} className="text-emerald-500" /> {t.districtLabel}
                  </label>
                  <select name="district" value={profile.district} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 appearance-none">
                    {(t.districts[profile.state as keyof typeof t.districts] || t.districts["Other"]).map((d, idx) => {
                      const districtKey = (translations.en.districts[profile.state as keyof typeof translations.en.districts] || translations.en.districts["Other"])[idx];
                      return <option key={districtKey} value={districtKey}>{d}</option>;
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg> {t.landLabel}
                  </label>
                  <input required name="landSize" value={profile.landSize} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50" placeholder="e.g. 2.5" />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Sprout size={16} className="text-emerald-500" /> {t.categoryLabel}
                  </label>
                  <select name="category" value={profile.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 appearance-none">
                    {Object.entries(t.farmerCategories).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <CircleDollarSign size={16} className="text-emerald-500" /> {t.incomeLabel}
                  </label>
                  <select name="annualIncome" value={profile.annualIncome} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 appearance-none">
                    {t.incomeRanges.map((range, idx) => {
                      const rangeKey = translations.en.incomeRanges[idx];
                      return <option key={rangeKey} value={rangeKey}>{range}</option>;
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg> {t.irrigationLabel}
                  </label>
                  <select name="irrigationType" value={profile.irrigationType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 appearance-none">
                    {Object.entries(t.irrigationTypes).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-500" /> {t.insuranceLabel}
                  </label>
                  <select name="insuranceStatus" value={profile.insuranceStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 appearance-none">
                    {Object.entries(t.insuranceOptions).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Info size={16} className="text-emerald-500" /> {t.soilLabel}
                  </label>
                  <select name="soilType" value={profile.soilType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 appearance-none">
                    {Object.entries(t.soilTypes).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">{t.cropsLabel}</label>
                <div className="flex flex-wrap gap-3">
                  {t.crops.map((crop, idx) => {
                    const cropKey = translations.en.crops[idx];
                    const isSelected = selectedCrops.includes(cropKey);
                    return (
                      <label key={cropKey} className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-full border cursor-pointer transition-all text-sm font-medium",
                        isSelected ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isSelected}
                          onChange={() => handleCropToggle(cropKey)}
                        />
                        {crop}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-6">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full md:w-auto min-w-[240px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  {loading ? <><Loader2 className="animate-spin" size={24} /> {t.analyzing}</> : <>{t.findBtn} <Search size={24} /></>}
                </button>
                <button 
                  type="button"
                  onClick={handleReset}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  {lang === 'en' ? 'Reset' : 'மீட்டமை'}
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div id="results" className="space-y-8 pt-8">
            <AnimatePresence mode="wait">
              {!results && !loading && (
                <div className="bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Search className="text-slate-300" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-400 mb-2">{t.readyTitle}</h3>
                  <p className="text-slate-400 max-w-md mx-auto">{t.readySub}</p>
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 animate-pulse">
                      <div className="h-8 w-1/2 bg-slate-100 rounded mb-6"></div>
                      <div className="h-4 w-full bg-slate-100 rounded mb-3"></div>
                      <div className="h-4 w-3/4 bg-slate-100 rounded mb-8"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-slate-50 rounded-xl"></div>
                        <div className="h-20 bg-slate-50 rounded-xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-bold text-slate-900">{t.resultsTitle}</h2>
                      <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold">
                        {filteredResults.length} {lang === 'en' ? 'Found' : 'கண்டறியப்பட்டது'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                          selectedCategory === 'All' 
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                            : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-200"
                        )}
                      >
                        {t.allCategories}
                      </button>
                      {Object.entries(t.categories).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedCategory(key)}
                          className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                            selectedCategory === key 
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                              : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-200"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredResults.map((scheme, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col"
                      >
                        <div className="p-8 flex-grow">
                          <div className="flex justify-between items-start gap-4 mb-6">
                            <div className="flex flex-col gap-2">
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
                                {t.categories[scheme.category as keyof typeof t.categories]}
                              </span>
                              <h3 className="text-2xl font-bold text-emerald-800 leading-tight">{scheme.name}</h3>
                            </div>
                            <span className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                              scheme.eligibilityStatus === 'Eligible' ? "bg-emerald-100 text-emerald-700" :
                              scheme.eligibilityStatus === 'Potentially Eligible' ? "bg-amber-100 text-amber-700" :
                              "bg-rose-100 text-rose-700"
                            )}>
                              {t.eligibilityLabels[scheme.eligibilityStatus as keyof typeof t.eligibilityLabels]}
                            </span>
                          </div>
                          <p className="text-slate-600 mb-8 text-sm leading-relaxed">{scheme.description}</p>
                          
                          <div className="bg-emerald-50/50 rounded-2xl p-5 mb-8 text-sm border border-emerald-100/50">
                            <p className="font-black text-emerald-900/40 uppercase text-[10px] tracking-widest mb-2">
                              {t.whyEligible} {t.eligibilityLabels[scheme.eligibilityStatus as keyof typeof t.eligibilityLabels].toLowerCase()}:
                            </p>
                            <p className="text-emerald-900 font-medium italic leading-relaxed">"{scheme.reasoning}"</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CircleDollarSign size={14} /> {t.benefits}
                              </h4>
                              <ul className="space-y-3">
                                {scheme.benefits.map((b, i) => (
                                  <li key={i} className="text-xs text-slate-600 flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle2 size={14} /> {t.formalities}
                              </h4>
                              <ul className="space-y-3">
                                {scheme.formalities.map((f, i) => (
                                  <li key={i} className="text-xs text-slate-600 flex gap-3">
                                    <ChevronRight size={14} className="text-slate-300 shrink-0 mt-0.5" />
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-8 pt-8 border-t border-slate-100">
                            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <FileText size={14} /> {t.documents}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {scheme.requiredDocuments.map((doc, i) => (
                                <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold border border-amber-100">
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-8 py-5 flex justify-between items-center border-t border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.source}</span>
                          <a 
                            href={scheme.applyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10 active:scale-95"
                          >
                            {t.applyNow} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="text-emerald-600" size={20} />
            <span className="font-bold text-slate-900">{t.title}</span>
          </div>
          <p className="text-slate-400 text-xs">© 2024 {t.title}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
