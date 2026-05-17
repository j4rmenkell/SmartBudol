"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logout from "@/components/Logout";
import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlinePencil,
  HiOutlineX,
} from "react-icons/hi";
import { useToast } from "@/components/ui/toast";

// Toast Notification
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === "error";
  return (
    <div
      className={`fixed top-20 right-4 z-[100] max-w-sm w-full animate-slide-in-right flex items-start gap-3 p-4 rounded-xl shadow-lg border ${
        isError
          ? "bg-[#ffdad6] border-[#ba1a1a]/20 text-[#93000a]"
          : "bg-[#d4f5e4] border-[#00694c]/20 text-[#002115]"
      }`}
      role="alert"
    >
      {isError ? (
        <HiOutlineExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
      ) : (
        <HiOutlineCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
      )}
      <p className="text-sm leading-snug flex-1">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <HiOutlineX className="w-4 h-4" />
      </button>
    </div>
  );
}

// Spinner
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// Reusable input wrapper
function FormField({ id, label, icon: Icon, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#191c1e] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon
            className={`w-[18px] h-[18px] ${error ? "text-[#ba1a1a]" : "text-[#6d7a73]"}`}
          />
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
      ? "border-[#ba1a1a] focus:ring-[#ba1a1a]/20"
      : "border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30"
  }`;

const inputWithToggle = (hasError) =>
  inputBase(hasError).replace("pr-4", "pr-11");

// MAIN ACCOUNT PAGE
export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const searchParams = useSearchParams();

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUser(user);
    }
    fetchUser();
  }, []);

  // Show success toast when returning from email change confirmation link
  useEffect(() => {
    if (searchParams.get("email_updated") === "true") {
      showToast("Your email address has been updated successfully!");
      // Clean the URL without triggering a navigation
      window.history.replaceState({}, "", "/account");
    }
  }, [searchParams]);

  const refreshUser = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUser(user);
  };

  const fullName = user?.user_metadata?.full_name || "Loading...";
  const email = user?.email || "";
  const initial = fullName ? fullName.charAt(0).toUpperCase() : "?";

  const tabs = [
    { key: "profile", label: "Edit Profile" },
    { key: "password", label: "Change Password" },
    { key: "comparisons", label: "Saved Comparisons" },
    { key: "favorites", label: "Favorites" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans pb-20 md:pb-8 flex flex-col">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 pt-8 md:pt-12 flex-grow">
        {/* Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 mb-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-2xl font-bold shadow-md mb-4">
            {initial}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface font-headline mb-1">
            {fullName}
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mb-6">
            {email}
          </p>
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
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "profile" && (
            <EditProfileForm
              user={user}
              onSuccess={refreshUser}
              showToast={showToast}
            />
          )}
          {activeTab === "password" && (
            <ChangePasswordForm showToast={showToast} />
          )}
          {activeTab === "comparisons" && <ComparisonsTab />}
          {activeTab === "favorites" && <FavoritesTab />}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto p-4 md:px-8 py-6 mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline text-base">
            SmartBudol
          </span>
          <span className="opacity-70">
            © 2026 SmartBudol. Finding the best value for savvy shoppers.
          </span>
        </div>
      </footer>
    </div>
  );
}

// EDIT PROFILE FORM
function EditProfileForm({ user, onSuccess, showToast }) {
  const [name, setName] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || "");
      setEmailVal(user.email || "");
    }
  }, [user]);

  const emailChanged =
    emailVal.trim().toLowerCase() !== (user?.email || "").toLowerCase();
  const nameChanged = name.trim() !== (user?.user_metadata?.full_name || "");

  function validateName() {
    const e = {};
    if (!name.trim()) e.name = "Full name is required";
    else if (name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    setErrors((p) => ({ ...p, ...e }));
    return !e.name;
  }

  function validateEmail() {
    const e = {};
    if (!emailVal.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
      e.email = "Enter a valid email address";
    if (emailChanged && !currentPassword)
      e.password = "Enter your current password to confirm";
    setErrors((p) => ({ ...p, ...e }));
    return !e.email && !e.password;
  }

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!validateName()) return;
    setSavingName(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });
    setSavingName(false);

    if (error) {
      showToast(error.message, "error");
      return;
    }

    await onSuccess();
    showToast("Name updated successfully.");
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setSavingEmail(true);

    try {
      // ── Step 1: Server-side password verification + rate limiting ──
      const res = await fetch("/api/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: emailVal.trim(), currentPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSavingEmail(false);
        if (res.status === 403) {
          setErrors((p) => ({ ...p, password: data.error }));
        } else if (res.status === 429) {
          showToast(data.error, "error");
        } else {
          showToast(data.error || "Something went wrong.", "error");
        }
        return;
      }

      // ── Step 2: Client-side updateUser (PKCE cookies set in browser) ──
      // This MUST happen in the browser so the code_verifier cookie is
      // stored and available when the user clicks the confirmation link.
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser(
        { email: emailVal.trim() },
        {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=email_change&next=/account`,
        },
      );

      setSavingEmail(false);

      if (updateError) {
        showToast(updateError.message, "error");
        return;
      }

      setCurrentPassword("");
      showToast("A confirmation link has been sent to your new email.");
    } catch {
      setSavingEmail(false);
      showToast("Network error. Please try again.", "error");
    }
  };

  const clearErr = (f) => {
    if (errors[f]) setErrors((p) => ({ ...p, [f]: "" }));
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <HiOutlinePencil className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-on-surface font-headline">
            Edit Profile
          </h2>
          <p className="text-sm text-on-surface-variant">
            Update your personal information
          </p>
        </div>
      </div>

      {/* ── Name Update Section ── */}
      <form
        onSubmit={handleSaveName}
        noValidate
        className="space-y-5 max-w-lg mb-8"
      >
        <FormField
          id="edit-name"
          label="Full name"
          icon={HiOutlineUser}
          error={errors.name}
        >
          <input
            id="edit-name"
            type="text"
            autoComplete="name"
            placeholder="Juan Dela Cruz"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearErr("name");
            }}
            className={inputBase(errors.name)}
          />
        </FormField>

        {nameChanged && (
          <button
            type="submit"
            disabled={savingName}
            className="py-3 px-8 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {savingName ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save Name"
            )}
          </button>
        )}
      </form>

      {/* ── Divider ── */}
      <div className="border-t border-outline-variant/30 pt-8 max-w-lg">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <HiOutlineMail className="w-4 h-4 text-primary" />
          Email Address
        </h3>

        <form onSubmit={handleChangeEmail} noValidate className="space-y-4">
          <FormField
            id="edit-email"
            label="Email address"
            icon={HiOutlineMail}
            error={errors.email}
          >
            <input
              id="edit-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={emailVal}
              onChange={(e) => {
                setEmailVal(e.target.value);
                clearErr("email");
              }}
              className={inputBase(errors.email)}
            />
          </FormField>

          {/* ── Password confirmation (appears when email changes) ── */}
          {emailChanged && (
            <div
              className="space-y-4"
              style={{ animation: "fadeInDown 0.3s ease-out" }}
            >
              <p className="text-xs text-on-surface-variant bg-surface-container-low rounded-lg p-3 flex items-start gap-2">
                <HiOutlineExclamationCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Changing your email requires password confirmation. A
                  verification link will be sent to your new email address.
                </span>
              </p>

              <FormField
                id="confirm-current-password"
                label="Current password"
                icon={HiOutlineLockClosed}
                error={errors.password}
              >
                <input
                  id="confirm-current-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    clearErr("password");
                  }}
                  className={inputWithToggle(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7a73] hover:text-[#3d4943] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <HiOutlineEye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </FormField>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingEmail}
                  className="py-3 px-8 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {savingEmail ? (
                    <>
                      <Spinner /> Verifying...
                    </>
                  ) : (
                    "Confirm Email Change"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailVal(user?.email || "");
                    setCurrentPassword("");
                    setErrors({});
                  }}
                  className="py-3 px-6 rounded-lg text-sm font-medium border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// CHANGE PASSWORD FORM
function ChangePasswordForm({ showToast }) {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function getStrength() {
    if (!newPw) return { level: 0, label: "", color: "" };
    let s = 0;
    if (newPw.length >= 8) s++;
    if (/[A-Z]/.test(newPw)) s++;
    if (/[0-9]/.test(newPw)) s++;
    if (/[^A-Za-z0-9]/.test(newPw)) s++;
    if (s <= 1) return { level: 1, label: "Weak", color: "#ba1a1a" };
    if (s === 2) return { level: 2, label: "Fair", color: "#b62506" };
    if (s === 3) return { level: 3, label: "Good", color: "#008560" };
    return { level: 4, label: "Strong", color: "#00694c" };
  }
  const strength = getStrength();

  function validate() {
    const e = {};
    if (!newPw) e.newPw = "New password is required";
    else if (newPw.length < 8)
      e.newPw = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(newPw))
      e.newPw = "Include at least one uppercase letter";
    else if (!/[0-9]/.test(newPw)) e.newPw = "Include at least one number";
    if (!confirmPw) e.confirmPw = "Please confirm your new password";
    else if (newPw !== confirmPw) e.confirmPw = "Passwords do not match";
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
      showToast(error.message, "error");
      return;
    }

    setNewPw("");
    setConfirmPw("");
    showToast("Password changed successfully.");
  };

  const clearErr = (f) => {
    if (errors[f]) setErrors((p) => ({ ...p, [f]: "" }));
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <HiOutlineLockClosed className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-on-surface font-headline">
            Change Password
          </h2>
          <p className="text-sm text-on-surface-variant">
            Choose a strong, unique password
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg">
        {/* New Password */}
        <div>
          <FormField
            id="new-password"
            label="New password"
            icon={HiOutlineLockClosed}
            error={errors.newPw}
          >
            <input
              id="new-password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value);
                clearErr("newPw");
              }}
              className={inputWithToggle(errors.newPw)}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7a73] hover:text-[#3d4943] transition-colors"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? (
                <HiOutlineEyeOff className="w-[18px] h-[18px]" />
              ) : (
                <HiOutlineEye className="w-[18px] h-[18px]" />
              )}
            </button>
          </FormField>
          {newPw && (
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        i <= strength.level ? strength.color : "#e0e3e5",
                    }}
                  />
                ))}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <FormField
          id="confirm-password"
          label="Confirm new password"
          icon={HiOutlineLockClosed}
          error={errors.confirmPw}
        >
          <input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPw}
            onChange={(e) => {
              setConfirmPw(e.target.value);
              clearErr("confirmPw");
            }}
            className={inputWithToggle(errors.confirmPw)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7a73] hover:text-[#3d4943] transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <HiOutlineEyeOff className="w-[18px] h-[18px]" />
            ) : (
              <HiOutlineEye className="w-[18px] h-[18px]" />
            )}
          </button>
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="py-3 px-8 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Spinner /> Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}

// EXISTING TABS (Comparisons & Favorites)
function ComparisonsTab() {
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comparisonToDelete, setComparisonToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function getComparison() {
      setIsLoading(true);
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("You must be logged in to view saved comparisons.");
        }

        const { data: savedComp, error: fetchError } = await supabase
          .from("saved_comparisons")
          .select(
            `id, 
              comparison_id, 
              title, 
              created_at,
              comparison_items (
                products (
                  id,
                  name,
                  price,
                  image_url,
                  vendor,
                  platform
                )
              )
            `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const formattedComparisons = (savedComp || []).map((comp) => ({
          id: comp.id,
          comparison_id: comp.comparison_id,
          title: comp.title,
          created_at: comp.created_at,
          products: comp.comparison_items
            .map((item) => item.products)
            .filter(Boolean),
        }));

        setSavedComparisons(formattedComparisons);
      } catch (error) {
        console.error("Mahiwagang error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    getComparison();
  }, []);

  // Opens the delete confirmation modal
  const openDeleteModal = (comparison) => {
    setComparisonToDelete(comparison);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Logic (called from modal confirmation)
  const handleConfirmDelete = async () => {
    if (!comparisonToDelete) return;
    setIsDeleting(true);

    const dbId = comparisonToDelete.id;
    const previousComparisons = [...savedComparisons];
    setSavedComparisons((prev) => prev.filter((comp) => comp.id !== dbId));

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("saved_comparisons")
        .delete()
        .eq("id", dbId);

      if (error) throw error;

      showToast("Comparison deleted", "success");
    } catch (error) {
      console.error("Error deleting comparison: ", error);
      setSavedComparisons(previousComparisons);
      showToast("Failed to delete. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setComparisonToDelete(null);
    }
  };

  // Show a loading state while fetching
  // Will change to skeleton (pag sinipag)
  if (isLoading) {
    return (
      <div className="text-sm text-on-surface-variant">
        Loading comparisons...
      </div>
    );
  }

  // Map the fetched comparisons into the ComparisonCard
  return (
    <div className="space-y-4">
      {savedComparisons.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          No saved comparisons found.
        </p>
      ) : (
        savedComparisons.map((comp) => (
          <ComparisonCard
            key={comp.id}
            id={comp.id}
            comparisonId={comp.comparison_id}
            date={new Date(comp.created_at).toLocaleDateString()}
            title={comp.title}
            products={comp.products}
            onDelete={() => openDeleteModal(comp)}
          />
        ))
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
              Delete Comparison
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-on-surface">
                &ldquo;{comparisonToDelete?.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setComparisonToDelete(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#ba1a1a] to-[#d32f2f] hover:shadow-[0_4px_16px_rgba(186,26,26,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonCard({ onDelete, comparisonId, date, title, products }) {
  const productIdsString = products.map((p) => p.id).join(",");
  const hrefUrl = `/compare?comparisonId=${comparisonId}&ids=${productIdsString}`;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">
          {date}
        </span>

        <button
          onClick={onDelete}
          className="text-on-surface-variant hover:text-error transition-colors p-1"
          aria-label="Delete saved comparison"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <h3 className="font-semibold text-base leading-tight text-on-surface mb-3">
        {title}
      </h3>

      {/* Mapped Products List */}
      <div className="flex flex-col gap-3 bg-surface-container-low rounded-lg p-3 mb-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center border-b border-outline-variant/10 last:border-0 pb-2 last:pb-0"
          >
            <div className="flex flex-col gap-1.5 pr-4">
              <span
                className="text-sm font-medium text-on-surface line-clamp-1"
                title={product.name}
              >
                {product.name}
              </span>
              {/* Inserted the PlatformBadge right under the product name */}
              <div className="flex items-center">
                <PlatformBadge platform={product.platform} />
              </div>
            </div>
            <span className="text-sm font-bold text-primary whitespace-nowrap">
              ₱{product.price}
            </span>
          </div>
        ))}
      </div>

      <Link
        href={hrefUrl}
        className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors flex items-center justify-center gap-2 mt-4"
      >
        View Comparison
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  );
}

export function FavoritesTab() {
  const [savedFavorites, setSavedFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function getFavorites() {
      setIsLoading(true);
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("You must be logged in to view favorites.");
        }

        // Left join favorites with products based on the schema
        const { data: favs, error: fetchError } = await supabase
          .from("favorites")
          .select(
            `id, 
             created_at,
             products (
               id,
               name,
               price,
               image_url,
               platform,
               url
             )
            `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const formattedFavorites = (favs || []).map((fav) => ({
          id: fav.id,
          created_at: fav.created_at,
          // Since product_id is a single reference to products table
          product: Array.isArray(fav.products) ? fav.products[0] : fav.products,
        }));

        setSavedFavorites(formattedFavorites);
      } catch (error) {
        console.error("Mahiwagang error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    getFavorites();
  }, []);

  // Opens the delete confirmation modal
  const openDeleteModal = (favorite) => {
    setFavoriteToDelete(favorite);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Logic (called from modal confirmation)
  const handleConfirmDelete = async () => {
    if (!favoriteToDelete) return;
    setIsDeleting(true);

    const dbId = favoriteToDelete.id;
    const previousFavorites = [...savedFavorites];
    // Optimistic UI update
    setSavedFavorites((prev) => prev.filter((fav) => fav.id !== dbId));

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", dbId);

      if (error) throw error;

      showToast("Removed from favorites", "success");
    } catch (error) {
      console.error("Error removing favorite: ", error);
      // Revert if error occurs
      setSavedFavorites(previousFavorites);
      showToast("Failed to remove. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setFavoriteToDelete(null);
    }
  };

  // Show a loading state while fetching
  if (isLoading) {
    return (
      <div className="text-sm text-on-surface-variant">
        Loading favorites...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedFavorites.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          No favorites saved yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedFavorites.map((fav) => (
            <FavoritesCard
              key={fav.id}
              date={`Added ${new Date(fav.created_at).toLocaleDateString()}`}
              product={fav.product}
              onDelete={() => openDeleteModal(fav)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
              Remove Favorite
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-on-surface">
                &ldquo;{favoriteToDelete?.product?.name}&rdquo;
              </span>{" "}
              from your favorites?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setFavoriteToDelete(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#ba1a1a] to-[#d32f2f] hover:shadow-[0_4px_16px_rgba(186,26,26,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FavoritesCard({ date, product, onDelete }) {
  if (!product) return null; // Fallback in case product data is missing

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">
          {date}
        </span>
        <button
          onClick={onDelete}
          className="text-on-surface-variant hover:text-error transition-colors p-1"
          aria-label="Remove from favorites"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <h3
        className="font-semibold text-base leading-tight text-on-surface mb-3 line-clamp-2"
        title={product.name}
      >
        {product.name}
      </h3>

      <div className="flex gap-2 mb-4">
        <PlatformBadge platform={product.platform} />
      </div>

      <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3 mb-4">
        <span className="text-sm text-on-surface-variant">Price</span>
        <span className="text-sm font-bold text-primary">₱{product.price}</span>
      </div>

      {/* Assuming you want to link out to the external product URL since it's in the schema */}
      <Link
        href={`/products/${product.id}`}
        className="w-full py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
      >
        View Detail
      </Link>
    </div>
  );
}

function PlatformBadge({ platform }) {
  const isShopee = platform.toLowerCase() === "shopee";
  const isLazada = platform.toLowerCase() === "lazada";
  let bgClass = "bg-surface-container-high text-on-surface-variant";
  if (isShopee) bgClass = "bg-[#EE4D2D] text-white";
  if (isLazada) bgClass = "bg-[#F57224] text-white";
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${bgClass}`}
    >
      {platform}
    </span>
  );
}
