"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logout from "@/components/Logout";
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineX,
} from "react-icons/hi";
import { EditProfileForm } from "@/components/EditProfileForm";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { ComparisonsTab } from "@/components/ComparisonsTab";
import { FavoritesTab } from "@/components/FavoritesTab";

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

     
      
    </div>
  );
}
