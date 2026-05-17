"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlinePencil,
} from "react-icons/hi";
import { Spinner } from "./Spinner";
import { FormField, inputBase, inputWithToggle } from "./FormField";

// EDIT PROFILE FORM
export function EditProfileForm({ user, onSuccess, showToast }) {
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
