# Account Page Logic Documentation

This document outlines the functions and logic required to make the SmartBudol Account page fully functional. The front-end has been refactored to match the "Latest Wireframe" design; this document bridges the gap between the static UI and the dynamic requirements for future implementation.

## 1. User Data Management
The account page requires fetching the current authenticated user's details from Supabase.

### **Required Logic:**
- **Fetch Session/User:** Use `@supabase/ssr` to retrieve the current user on component mount.
- **Data Points:**
  - `user.email`: To display the user's email address.
  - `user.user_metadata.full_name`: To display the user's full name.
- **Loading State:** Implement a loading state (e.g., a skeleton loader or spinner) while the user data is being fetched to prevent layout shifts or displaying empty values.

### **Implementation Pattern (React Client Component):**
```javascript
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Inside component:
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
      setUser(user);
    }
    setLoading(false);
  }
  fetchUser();
}, []);
```

---

## 2. Authentication & Sign Out
The Sign Out functionality must securely terminate the user's session and redirect them.

### **Required Logic:**
- **Sign Out Action:** Call `supabase.auth.signOut()`.
- **Cache Invalidation:** Ensure the browser does not cache the protected account page. This is handled by `middleware.js` setting `Cache-Control: no-store`, but the client must also forcefully redirect to prevent back-button issues.
- **Redirection:** Redirect to the `/login` or `/` (landing) page after a successful sign-out.

### **Implementation Pattern:**
The existing `Logout.jsx` component already handles this perfectly. It is imported and utilized in the Account page:
```javascript
import Logout from '@/components/Logout';

// Inside component:
<Logout 
  label="Sign Out" 
  className="px-4 py-1.5 border border-outline-variant/40 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors text-on-surface"
/>
```

---

## 3. Tab Navigation (State Management)
The user can toggle between "Saved Comparisons" and "Favorites".

### **Required Logic:**
- **State Variable:** Maintain the currently active tab using React state (`activeTab`).
- **Conditional Rendering:** Render different card lists based on the `activeTab` value.

### **Implementation Pattern:**
```javascript
const [activeTab, setActiveTab] = useState('comparisons'); // 'comparisons' | 'favorites'

// Tab Buttons
<button onClick={() => setActiveTab('comparisons')} className={activeTab === 'comparisons' ? 'active-styles' : 'inactive-styles'}>...</button>
<button onClick={() => setActiveTab('favorites')} className={activeTab === 'favorites' ? 'active-styles' : 'inactive-styles'}>...</button>

// Content Rendering
{activeTab === 'comparisons' && <ComparisonsList />}
{activeTab === 'favorites' && <FavoritesList />}
```

---

## 4. Saved Comparisons (Future Backend Integration)
Currently static, this section will need to fetch and manage saved comparison sessions.

### **Required Logic:**
- **Database Schema:** Requires a `comparisons` table in Supabase linking `user_id` to comparison data (e.g., product IDs, timestamps).
- **Fetch Data:** Query the `comparisons` table where `user_id` matches the current user.
- **Delete Action:** Implement a function to delete a saved comparison row from the database and optimistically update the UI.
- **View Action:** The "View Comparison" button must route the user back to the `/compare` page, passing the specific comparison ID or product parameters (e.g., `/compare?id=123` or `/compare?p1=xyz&p2=abc`).

---

## 5. Favorites (Future Backend Integration)
Currently static, this section manages individual favorited products.

### **Required Logic:**
- **Database Schema:** Requires a `favorites` table linking `user_id` to a specific `product_id`.
- **Fetch Data:** Query the `favorites` table to retrieve the list of saved products for the user.
- **Remove Action:** The trash icon must trigger a delete query to remove the item from the `favorites` table and update the local state.
- **View Action:** The "View Detail" button should route the user to the specific product detail page (e.g., `/products/[id]`).
