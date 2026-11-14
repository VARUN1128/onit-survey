import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Search, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  X, 
  Layers, 
  BarChart3, 
  MapPin, 
  Briefcase, 
  Star,
  Sparkles,
  Filter
} from 'lucide-react';
import { SurveyRecord, CRITERIA_LIST } from '../types/survey';
import { fetchSurveyResponses } from '../lib/supabase';

interface AdminDashboardProps {
  onBackToSurvey: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSurvey }) => {
  const [records, setRecords] = useState<SurveyRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [adoptionFilter, setAdoptionFilter] = useState<'all' | 'Yes' | 'No'>('all');
  const [selectedRecord, setSelectedRecord] = useState<SurveyRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    const result = await fetchSurveyResponses();
    setRecords(result.records);
    setIsLive(result.isLive);
    if (result.error && !result.isLive) {
      setErrorMessage(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.location && r.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.referral_name && r.referral_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAdoption = 
        adoptionFilter === 'all' || r.would_use_onit === adoptionFilter;

      return matchesSearch && matchesAdoption;
    });
  }, [records, searchTerm, adoptionFilter]);

  // Analytics Calculations
  const stats = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return {
        total: 0,
        adoptionRate: 0,
        onlinePlatformInterest: 0,
        referralCount: 0,
        serviceCounts: {} as Record<string, number>,
        challengeCounts: {} as Record<string, number>,
        discoveryCounts: {} as Record<string, number>,
        frequencyCounts: {} as Record<string, number>,
        criteriaScores: {} as Record<string, number>,
      };
    }

    const wouldUseCount = records.filter((r) => r.would_use_onit === 'Yes').length;
    const onlineInterestedCount = records.filter(
      (r) => r.interested_in_online_platform === 'Yes'
    ).length;
    const hasReferralCount = records.filter(
      (r) => r.referral_name && r.referral_name.trim().toLowerCase() !== 'none'
    ).length;

    // Service counts
    const serviceCounts: Record<string, number> = {};
    records.forEach((r) => {
      (r.required_services || []).forEach((srv) => {
        serviceCounts[srv] = (serviceCounts[srv] || 0) + 1;
      });
    });

    // Challenge counts
    const challengeCounts: Record<string, number> = {};
    records.forEach((r) => {
      (r.booking_challenges || []).forEach((ch) => {
        challengeCounts[ch] = (challengeCounts[ch] || 0) + 1;
      });
    });

    // Discovery counts
    const discoveryCounts: Record<string, number> = {};
    records.forEach((r) => {
      (r.provider_discovery_methods || []).forEach((dm) => {
        discoveryCounts[dm] = (discoveryCounts[dm] || 0) + 1;
      });
    });

    // Frequency counts
    const frequencyCounts: Record<string, number> = {};
    records.forEach((r) => {
      if (r.service_frequency) {
        frequencyCounts[r.service_frequency] = (frequencyCounts[r.service_frequency] || 0) + 1;
      }
    });

    // Criteria importance score (1 to 5 points)
    const ratingWeight: Record<string, number> = {
      'Not Important': 1,
      'Slightly Important': 2,
      'Important': 3,
      'Very Important': 4,
      'Extremely Important': 5,
    };

    const criteriaScores: Record<string, number> = {};
    CRITERIA_LIST.forEach((crit) => {
      let sum = 0;
      let count = 0;
      records.forEach((r) => {
        const rating = r.service_provider_criteria?.[crit];
        if (rating && ratingWeight[rating]) {
          sum += ratingWeight[rating];
          count++;
        }
      });
      criteriaScores[crit] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
    });

    return {
      total,
      adoptionRate: Math.round((wouldUseCount / total) * 100),
      onlinePlatformInterest: Math.round((onlineInterestedCount / total) * 100),
      referralCount: hasReferralCount,
      serviceCounts,
      challengeCounts,
      discoveryCounts,
      frequencyCounts,
      criteriaScores,
    };
  }, [records]);

  // Export to CSV
  const handleExportCSV = () => {
    if (records.length === 0) return;

    const headers = [
      'Submission ID',
      'Name',
      'Age',
      'Location',
      'Occupation',
      'Currently Uses Services',
      'Required Services',
      'Other Service',
      'Frequency',
      'Discovery Methods',
      'Other Discovery',
      'Interested in Online Platform',
      'Challenges',
      'Would Use ONIT',
      'Referral Name',
      'Created At',
    ];

    const rows = records.map((r) => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.age ?? '',
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${r.occupation.replace(/"/g, '""')}"`,
      r.currently_uses_services,
      `"${(r.required_services || []).join(', ')}"`,
      `"${(r.other_service || '').replace(/"/g, '""')}"`,
      r.service_frequency,
      `"${(r.provider_discovery_methods || []).join(', ')}"`,
      `"${(r.other_discovery_method || '').replace(/"/g, '""')}"`,
      r.interested_in_online_platform,
      `"${(r.booking_challenges || []).join(', ')}"`,
      r.would_use_onit,
      `"${(r.referral_name || '').replace(/"/g, '""')}"`,
      r.created_at,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `onit_survey_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSurvey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#F2F3FC] text-neutral-700 hover:text-[#14143A] text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Survey</span>
            </button>

            <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <img src="/onit-logo.svg" alt="ONIT" className="h-6 w-auto" />
              <span className="font-montserrat text-sm font-extrabold text-[#14143A]">
                Research Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Supabase DB
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Preview Mode
              </span>
            )}

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              title="Refresh responses"
              className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-[#14143A] hover:border-neutral-300 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6E76E0]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#14143A] hover:bg-[#2E3180] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* Notice Banner when in Preview / Mock mode */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold">Supabase Connection Notice:</strong>
              <p className="text-amber-800 leading-relaxed">{errorMessage}</p>
              <p className="text-amber-700 text-xs">
                To connect live responses, add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> file.
              </p>
            </div>
          </div>
        )}

        {/* 4 Key Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total Responses */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-card">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Responses</span>
              <div className="w-8 h-8 rounded-xl bg-[#F2F3FC] text-[#6E76E0] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#14143A]">
              {loading ? '...' : stats.total}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Total customer submissions</p>
          </div>

          {/* Adoption Readiness */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-card">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Adoption Ready</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-montserrat font-extrabold text-emerald-600">
              {loading ? '...' : `${stats.adoptionRate}%`}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Will use ONIT if criteria met</p>
          </div>

          {/* Online Platform Demand */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-card">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Online Booking</span>
              <div className="w-8 h-8 rounded-xl bg-[#F2F3FC] text-[#14143A] flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#6E76E0]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#14143A]">
              {loading ? '...' : `${stats.onlinePlatformInterest}%`}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Interested in booking via app</p>
          </div>

          {/* Referral Leads */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-card">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Referral Leads</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#14143A]">
              {loading ? '...' : stats.referralCount}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Named peer recommendations</p>
          </div>
        </div>

        {/* Analytics Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Top Home Services in Demand */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6E76E0]" />
                <h3 className="font-montserrat font-bold text-sm sm:text-base text-[#14143A]">
                  Home Services in Demand
                </h3>
              </div>
              <span className="text-xs text-neutral-400">Multi-select frequency</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(stats.serviceCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([service, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={service} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-neutral-700">{service}</span>
                        <span className="text-neutral-500 font-bold">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#14143A] to-[#6E76E0] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(stats.serviceCounts).length === 0 && (
                <p className="text-xs text-neutral-400 py-4 text-center">No service data recorded yet.</p>
              )}
            </div>
          </div>

          {/* Biggest Customer Challenges */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <h3 className="font-montserrat font-bold text-sm sm:text-base text-[#14143A]">
                  Key Customer Pain Points
                </h3>
              </div>
              <span className="text-xs text-neutral-400">Reported bottlenecks</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(stats.challengeCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([challenge, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={challenge} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-neutral-700">{challenge}</span>
                        <span className="text-rose-600 font-bold">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(stats.challengeCounts).length === 0 && (
                <p className="text-xs text-neutral-400 py-4 text-center">No challenge data recorded yet.</p>
              )}
            </div>
          </div>

          {/* Service Provider Criteria Importance Ranking (Average 1-5 scale) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/90 shadow-card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="font-montserrat font-bold text-sm sm:text-base text-[#14143A]">
                  Service Provider Criteria Importance (Avg Score out of 5.0)
                </h3>
              </div>
              <span className="text-xs text-neutral-400">1: Not Important &rarr; 5: Extremely Important</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CRITERIA_LIST.map((crit) => {
                const score = stats.criteriaScores[crit] || 0;
                return (
                  <div key={crit} className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-1.5">
                    <span className="text-xs font-semibold text-neutral-700 line-clamp-1" title={crit}>
                      {crit}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-montserrat font-extrabold text-[#14143A]">
                        {score > 0 ? score.toFixed(1) : '—'}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-medium">/ 5.0</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#6E76E0] rounded-full"
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Customer Responses Table Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-card overflow-hidden">
          
          {/* Table Header & Search Filters */}
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-montserrat font-bold text-base sm:text-lg text-[#14143A]">
                Customer Submissions
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Showing {filteredRecords.length} of {records.length} total entries
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, job, city..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-[#6E76E0] focus:ring-1 focus:ring-[#6E76E0]"
                />
              </div>

              {/* Adoption Filter */}
              <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 p-1 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-neutral-400 ml-1.5" />
                <select
                  value={adoptionFilter}
                  onChange={(e) => setAdoptionFilter(e.target.value as 'all' | 'Yes' | 'No')}
                  className="bg-transparent text-xs font-semibold text-neutral-700 pr-2 py-1 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Adoption</option>
                  <option value="Yes">Would Use (Yes)</option>
                  <option value="No">Would Use (No)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Respondent</th>
                  <th className="py-3 px-4">Location & Age</th>
                  <th className="py-3 px-4">Uses Services</th>
                  <th className="py-3 px-4">Required Services</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Would Use ONIT</th>
                  <th className="py-3 px-4">Referral</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRecords.map((r) => (
                  <tr 
                    key={r.id} 
                    className="hover:bg-[#F2F3FC]/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecord(r)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 text-xs sm:text-sm">{r.name}</div>
                      <div className="text-neutral-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3" />
                        {r.occupation}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#6E76E0]" />
                        <span>{r.location || 'Not specified'}</span>
                      </div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        {r.age ? `${r.age} yrs` : 'Age omitted'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        r.currently_uses_services === 'Yes'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.currently_uses_services === 'Sometimes'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {r.currently_uses_services}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(r.required_services || []).slice(0, 3).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px]">
                            {s}
                          </span>
                        ))}
                        {(r.required_services || []).length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500 text-[10px]">
                            +{(r.required_services || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600">
                      {r.service_frequency}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        r.would_use_onit === 'Yes'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.would_use_onit === 'Yes' && <CheckCircle className="w-2.5 h-2.5" />}
                        {r.would_use_onit}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700 font-medium">
                      {r.referral_name}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(r);
                        }}
                        className="inline-flex items-center gap-1 text-[#6E76E0] hover:text-[#14143A] font-bold transition-colors cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRecords.length === 0 && (
              <div className="p-8 text-center text-neutral-400 space-y-2">
                <Users className="w-8 h-8 mx-auto text-neutral-300" />
                <p className="text-sm font-semibold">No survey submissions match your query.</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Response Detail Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#6E76E0] uppercase tracking-wider">
                  Submission ID: {selectedRecord.id.slice(0, 8)}...
                </span>
                <h3 className="font-montserrat text-xl sm:text-2xl font-extrabold text-[#14143A] mt-0.5">
                  {selectedRecord.name}
                </h3>
                <p className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                  <span>{selectedRecord.occupation}</span>
                  <span>&bull;</span>
                  <span>{selectedRecord.location || 'Location omitted'}</span>
                  {selectedRecord.age && <span>({selectedRecord.age} yrs old)</span>}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              
              {/* Requirements & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div>
                  <span className="text-neutral-400 font-semibold block mb-1">Currently Uses Home Services:</span>
                  <strong className="text-[#14143A] font-bold text-sm">{selectedRecord.currently_uses_services}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 font-semibold block mb-1">Required Frequency:</span>
                  <strong className="text-[#14143A] font-bold text-sm">{selectedRecord.service_frequency}</strong>
                </div>
              </div>

              {/* Services Required */}
              <div>
                <span className="text-neutral-400 font-semibold block mb-1.5">Required Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedRecord.required_services || []).map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-[#F2F3FC] text-[#14143A] font-semibold border border-[#6E76E0]/20">
                      {s}
                    </span>
                  ))}
                  {selectedRecord.other_service && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                      Other: {selectedRecord.other_service}
                    </span>
                  )}
                </div>
              </div>

              {/* Discovery Methods */}
              <div>
                <span className="text-neutral-400 font-semibold block mb-1.5">Discovery Channels:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedRecord.provider_discovery_methods || []).map((m) => (
                    <span key={m} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-medium">
                      {m}
                    </span>
                  ))}
                  {selectedRecord.other_discovery_method && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-200">
                      Other: {selectedRecord.other_discovery_method}
                    </span>
                  )}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <span className="text-neutral-400 font-semibold block mb-1.5">Biggest Booking Challenges:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedRecord.booking_challenges || []).map((ch) => (
                    <span key={ch} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-medium border border-rose-200">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Criteria Ratings */}
              <div>
                <span className="text-neutral-400 font-semibold block mb-1.5">Criteria Importance Ratings:</span>
                <div className="rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100">
                  {CRITERIA_LIST.map((crit) => {
                    const rating = selectedRecord.service_provider_criteria?.[crit] || 'Not Rated';
                    return (
                      <div key={crit} className="flex items-center justify-between p-2.5 bg-white text-xs">
                        <span className="font-medium text-neutral-800">{crit}</span>
                        <span className="font-bold text-[#6E76E0]">{rating}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Platform Adoption & Referral */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F2F3FC] border border-[#6E76E0]/20">
                <div>
                  <span className="text-neutral-500 font-semibold block mb-1">Would Use ONIT?</span>
                  <strong className="text-[#14143A] font-extrabold text-base">{selectedRecord.would_use_onit}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 font-semibold block mb-1">Referral / Recommendation:</span>
                  <strong className="text-[#14143A] font-bold text-base">{selectedRecord.referral_name}</strong>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 pt-2 flex items-center justify-between">
                <span>Submitted on: {new Date(selectedRecord.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
