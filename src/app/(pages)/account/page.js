'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Logout from '@/components/Logout';
import Link from 'next/link';
import {
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeOff, HiOutlineExclamationCircle,
  HiOutlineCheckCircle, HiOutlinePencil, HiOutlineX,
} from 'react-icons/hi';

// ── Toast Notification ──────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === 'error';
  return (
    <div className={`fixed top-20 right-4 z-[100] max-w-sm w-full animate-slide-in-right flex items-start gap-3 p-4 rounded-xl shadow-lg border ${
      isError
        ? 'bg-[#ffdad6] border-[#ba1a1a]/20 text-[#93000a]'
        : 'bg-[#d4f5e4] border-[#00694c]/20 text-[#002115]'
    }`} role="alert">
      {isError
        ? <HiOutlineExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
        : <HiOutlineCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />}
      <p className="text-sm leading-snug flex-1">{message}</p>
      <button onClick={onClose} className="shrink-0 hover:opacity-70 transition-opacity" aria-label="Dismiss">
        <HiOutlineX className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Spinner ─────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Reusable input wrapper ──────────────────────────────────────────
function FormField({ id, label, icon: Icon, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#191c1e] mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className={`w-[18px] h-[18px] ${error ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
        </div>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-[#ba1a1a]">{error}</p>}
    </div>
  );
}

const inputBase = (hasError) =>
  `w-full pl-10 pr-4 py-3 text-sm bg-white border rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
    hasError
      ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
      : 'border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30'
  }`;

const inputWithToggle = (hasError) =>
  inputBase(hasError).replace('pr-4', 'pr-11');

// ═══════════════════════════════════════════════════════════════════
// MAIN ACCOUNT PAGE
// ═══════════════════════════════════════════════════════════════════
export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
    }
    fetchUser();
  }, []);

  const refreshUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUser(user);
  };

  const fullName = user?.user_metadata?.full_name || 'Loading...';
  const email = user?.email || '';
  const initial = fullName ? fullName.charAt(0).toUpperCase() : '?';

  const tabs = [
    { key: 'profile', label: 'Edit Profile' },
    { key: 'password', label: 'Change Password' },
    { key: 'comparisons', label: 'Saved Comparisons' },
    { key: 'favorites', label: 'Favorites' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans pb-20 md:pb-8 flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 pt-8 md:pt-12 flex-grow">
        {/* Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 mb-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-2xl font-bold shadow-md mb-4">
            {initial}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface font-headline mb-1">{fullName}</h1>
          <p className="text-on-surface-variant text-sm md:text-base mb-6">{email}</p>
          <Logout
            label="Sign Out"
            className="px-6 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && <EditProfileForm user={user} onSuccess={refreshUser} showToast={showToast} />}
          {activeTab === 'password' && <ChangePasswordForm showToast={showToast} />}
          {activeTab === 'comparisons' && <ComparisonsTab />}
          {activeTab === 'favorites' && <FavoritesTab />}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto p-4 md:px-8 py-6 mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline text-base">SmartBudol</span>
          <span className="opacity-70">© 2024 SmartBudol. Finding the best value for savvy shoppers.</span>
        </div>
        <div className="flex gap-4 opacity-80">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
          <Link href="#" className="hover:text-primary transition-colors">About</Link>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EDIT PROFILE FORM
// ═══════════════════════════════════════════════════════════════════
function EditProfileForm({ user, onSuccess, showToast }) {
  const [name, setName] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '');
      setEmailVal(user.email || '');
    }
  }, [user]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!emailVal.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const supabase = createClient();
    const updates = { data: { full_name: name.trim() } };

    // Only include email in the update payload if it actually changed
    const emailChanged = emailVal.trim().toLowerCase() !== user?.email?.toLowerCase();
    if (emailChanged) updates.email = emailVal.trim();

    const { error } = await supabase.auth.updateUser(updates);
    setLoading(false);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    await onSuccess();
    showToast(
      emailChanged
        ? 'Profile updated! Please check your new email for a confirmation link.'
        : 'Profile updated successfully.'
    );
  };

  const clearErr = (f) => { if (errors[f]) setErrors((p) => ({ ...p, [f]: '' })); };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <HiOutlinePencil className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-on-surface font-headline">Edit Profile</h2>
          <p className="text-sm text-on-surface-variant">Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg">
        <FormField id="edit-name" label="Full name" icon={HiOutlineUser} error={errors.name}>
          <input id="edit-name" type="text" autoComplete="name" placeholder="Juan Dela Cruz"
            value={name} onChange={(e) => { setName(e.target.value); clearErr('name'); }}
            className={inputBase(errors.name)} />
        </FormField>

        <FormField id="edit-email" label="Email address" icon={HiOutlineMail} error={errors.email}>
          <input id="edit-email" type="email" autoComplete="email" placeholder="name@example.com"
            value={emailVal} onChange={(e) => { setEmailVal(e.target.value); clearErr('email'); }}
            className={inputBase(errors.email)} />
        </FormField>

        {emailVal.trim().toLowerCase() !== (user?.email || '').toLowerCase() && (
          <p className="text-xs text-on-surface-variant bg-surface-container-low rounded-lg p-3">
            Changing your email requires verification. A confirmation link will be sent to your new email address.
          </p>
        )}

        <button type="submit" disabled={loading}
          className="py-3 px-8 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2">
          {loading ? <><Spinner /> Saving...</> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CHANGE PASSWORD FORM
// ═══════════════════════════════════════════════════════════════════
function ChangePasswordForm({ showToast }) {
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function getStrength() {
    if (!newPw) return { level: 0, label: '', color: '' };
    let s = 0;
    if (newPw.length >= 8) s++;
    if (/[A-Z]/.test(newPw)) s++;
    if (/[0-9]/.test(newPw)) s++;
    if (/[^A-Za-z0-9]/.test(newPw)) s++;
    if (s <= 1) return { level: 1, label: 'Weak', color: '#ba1a1a' };
    if (s === 2) return { level: 2, label: 'Fair', color: '#b62506' };
    if (s === 3) return { level: 3, label: 'Good', color: '#008560' };
    return { level: 4, label: 'Strong', color: '#00694c' };
  }
  const strength = getStrength();

  function validate() {
    const e = {};
    if (!newPw) e.newPw = 'New password is required';
    else if (newPw.length < 8) e.newPw = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(newPw)) e.newPw = 'Include at least one uppercase letter';
    else if (!/[0-9]/.test(newPw)) e.newPw = 'Include at least one number';
    if (!confirmPw) e.confirmPw = 'Please confirm your new password';
    else if (newPw !== confirmPw) e.confirmPw = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    setNewPw(''); setConfirmPw('');
    showToast('Password changed successfully.');
  };

  const clearErr = (f) => { if (errors[f]) setErrors((p) => ({ ...p, [f]: '' })); };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <HiOutlineLockClosed className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-on-surface font-headline">Change Password</h2>
          <p className="text-sm text-on-surface-variant">Choose a strong, unique password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg">
        {/* New Password */}
        <div>
          <FormField id="new-password" label="New password" icon={HiOutlineLockClosed} error={errors.newPw}>
            <input id="new-password" type={showNew ? 'text' : 'password'} autoComplete="new-password"
              placeholder="Min. 8 characters" value={newPw}
              onChange={(e) => { setNewPw(e.target.value); clearErr('newPw'); }}
              className={inputWithToggle(errors.newPw)} />
            <button type="button" onClick={() => setShowNew(!showNew)} tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7a73] hover:text-[#3d4943] transition-colors"
              aria-label={showNew ? 'Hide password' : 'Show password'}>
              {showNew ? <HiOutlineEyeOff className="w-[18px] h-[18px]" /> : <HiOutlineEye className="w-[18px] h-[18px]" />}
            </button>
          </FormField>
          {newPw && (
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="flex-1 flex gap-1">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: i <= strength.level ? strength.color : '#e0e3e5' }} />
                ))}
              </div>
              <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <FormField id="confirm-password" label="Confirm new password" icon={HiOutlineLockClosed} error={errors.confirmPw}>
          <input id="confirm-password" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
            placeholder="••••••••" value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); clearErr('confirmPw'); }}
            className={inputWithToggle(errors.confirmPw)} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7a73] hover:text-[#3d4943] transition-colors"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}>
            {showConfirm ? <HiOutlineEyeOff className="w-[18px] h-[18px]" /> : <HiOutlineEye className="w-[18px] h-[18px]" />}
          </button>
        </FormField>

        <button type="submit" disabled={loading}
          className="py-3 px-8 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2">
          {loading ? <><Spinner /> Updating...</> : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EXISTING TABS (Comparisons & Favorites) — preserved from original
// ═══════════════════════════════════════════════════════════════════
function ComparisonsTab() {
  return (
    <div className="space-y-4">
      <ComparisonCard date="Saved Oct 24, 2023" title="Sony WH-1000XM5 Wireless Noise Canceling Headphones"
        platform1="Shopee" platform2="Lazada" priceDiff="₱ 1,250" />
      <ComparisonCard date="Saved Oct 15, 2023" title="Apple iPad Air (5th Generation) 64GB Wi-Fi"
        platform1="Lazada" platform2="Shopee" priceDiff="₱ 890" />
    </div>
  );
}

function FavoritesTab() {
  return (
    <div className="space-y-4">
      <FavoritesCard date="Added Nov 2, 2023" title="Nintendo Switch OLED Model" platform="Shopee" price="₱ 14,990" />
      <FavoritesCard date="Added Oct 30, 2023" title="Logitech MX Master 3S Wireless Mouse" platform="Lazada" price="₱ 5,490" />
    </div>
  );
}

function ComparisonCard({ date, title, platform1, platform2, priceDiff }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">{date}</span>
        <button className="text-on-surface-variant hover:text-error transition-colors p-1" aria-label="Delete saved comparison">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      </div>
      <h3 className="font-semibold text-base leading-tight text-on-surface mb-3">{title}</h3>
      <div className="flex gap-2 mb-4">
        <PlatformBadge platform={platform1} />
        <PlatformBadge platform={platform2} />
      </div>
      <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3 mb-4">
        <span className="text-sm text-on-surface-variant">Price Diff.</span>
        <span className="text-sm font-bold text-primary">{priceDiff}</span>
      </div>
      <button className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
        View Comparison
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      </button>
    </div>
  );
}

function FavoritesCard({ date, title, platform, price }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">{date}</span>
        <button className="text-on-surface-variant hover:text-error transition-colors p-1" aria-label="Remove from favorites">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      </div>
      <h3 className="font-semibold text-base leading-tight text-on-surface mb-3">{title}</h3>
      <div className="flex gap-2 mb-4"><PlatformBadge platform={platform} /></div>
      <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3 mb-4">
        <span className="text-sm text-on-surface-variant">Price</span>
        <span className="text-sm font-bold text-primary">{price}</span>
      </div>
      <button className="w-full py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
        View Detail
      </button>
    </div>
  );
}

function PlatformBadge({ platform }) {
  const isShopee = platform.toLowerCase() === 'shopee';
  const isLazada = platform.toLowerCase() === 'lazada';
  let bgClass = 'bg-surface-container-high text-on-surface-variant';
  if (isShopee) bgClass = 'bg-[#EE4D2D] text-white';
  if (isLazada) bgClass = 'bg-[#F57224] text-white';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${bgClass}`}>
      {platform}
    </span>
  );
}
