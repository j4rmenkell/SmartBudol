'use client';

/**
 * Logout Component
 * ================
 *
 * A reusable logout button that signs the user out of their Supabase session
 * and redirects them to the landing page.
 *
 * USAGE:
 *   import Logout from '@/components/Logout';
 *
 *   // Default usage — renders as a styled button
 *   <Logout />
 *
 *   // With a custom CSS class to override default styles
 *   <Logout className="my-custom-class" />
 *
 *   // With custom button text
 *   <Logout label="Sign Out" />
 *
 * PROPS:
 *   - className (string, optional): Additional CSS classes to apply to the button.
 *       Overrides the default styling when provided.
 *   - label (string, optional): Custom text for the button. Defaults to "Log Out".
 *
 * NOTES:
 *   - This component uses the Supabase browser client (@supabase/ssr).
 *   - On successful sign-out, the user is redirected to "/" (the landing page).
 *   - If sign-out fails, the error is logged to the console.
 *   - The component is marked 'use client' because it uses browser-side APIs
 *     (event handlers, window.location).
 *
 * DEPENDENCIES:
 *   - @supabase/ssr (createBrowserClient)
 *   - Environment variables:
 *       NEXT_PUBLIC_SUPABASE_URL
 *       NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase browser client instance.
 * This is safe to call on the client side — it uses the public anon key.
 */
function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Logout
 *
 * Renders a button that, when clicked, signs the user out and redirects to "/".
 *
 * @param {object} props
 * @param {string} [props.className] - Optional CSS classes for custom styling.
 * @param {string} [props.label]     - Optional button text (default: "Log Out").
 */
export default function Logout({ className, label = 'Log Out' }) {
  /**
   * handleLogout
   *
   * 1. Calls supabase.auth.signOut() to clear the session cookies.
   * 2. Redirects to the landing page using window.location (hard navigation)
   *    to ensure all client-side state is fully reset.
   */
  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      // Log the error for debugging — consider replacing with a toast
      // notification in production for better UX.
      console.error('Logout failed:', error.message);
      return;
    }

    // Replace the current history entry so the back button can't return
    // to the protected page the user was on. Then do a hard redirect
    // to fully destroy all client-side state (React tree, caches, etc.).
    window.history.replaceState(null, '', '/');
    window.location.replace('/');
  };

  // Default button styles — can be fully overridden via the className prop.
  const defaultStyles =
    'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-800 transition-colors cursor-pointer';

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className || defaultStyles}
    >
      {label}
    </button>
  );
}
