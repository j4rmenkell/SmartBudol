"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { Spinner } from "./Spinner";
import { FormField, inputWithToggle } from "./FormField";

// CHANGE PASSWORD FORM
export function ChangePasswordForm({ showToast }) {
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
