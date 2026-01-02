# OAuth Configuration Guide

## Current Status
❌ OAuth providers (Google, Apple) are **NOT ENABLED** in the backend.

## Error You Were Seeing
```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

This error occurs when trying to use OAuth providers that aren't configured in your Lovable Cloud backend.

## What Was Fixed
1. **Removed OAuth methods** from `useAuth.tsx` context to prevent accidental calls
2. **Updated UI** to clearly indicate OAuth is not configured
3. **Added documentation** for future OAuth setup

## How to Enable OAuth (When Ready)

### For Google OAuth:
1. Open your Backend settings (Cloud tab)
2. Navigate to **Authentication → Providers**
3. Enable **Google** provider
4. Configure OAuth credentials:
   - Client ID
   - Client Secret
   - Authorized redirect URLs
5. Uncomment the OAuth methods in `src/hooks/useAuth.tsx`
6. Update the `AuthContextType` interface to include OAuth methods
7. Enable the OAuth buttons in `src/pages/Auth.tsx`

### For Apple OAuth:
Same process as Google, but select **Apple** provider instead.

## Code to Re-enable (After Backend Configuration)

### In `src/hooks/useAuth.tsx`:
```typescript
// Add to AuthContextType interface:
interface AuthContextType {
  // ... existing properties
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
}

// Add methods in AuthProvider:
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    }
  });
  return { error };
};

const signInWithApple = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/`,
    }
  });
  return { error };
};

// Add to context value:
return (
  <AuthContext.Provider value={{
    // ... existing values
    signInWithGoogle,
    signInWithApple,
  }}>
    {children}
  </AuthContext.Provider>
);
```

### In `src/pages/Auth.tsx`:
```typescript
// Import OAuth methods:
const { user, signIn, signUp, signInWithGoogle, signInWithApple } = useAuth();

// Update button handlers:
<Button onClick={() => signInWithGoogle()}>Continue with Google</Button>
<Button onClick={() => signInWithApple()}>Continue with Apple</Button>
```

## Prevention for Future
- OAuth methods are now commented out with clear instructions
- UI clearly indicates when OAuth is not configured
- Error handling is in place with user-friendly messages
- This documentation provides a clear path to enable OAuth when ready

## Current Authentication
✅ **Email/Password authentication** is fully functional and working.
Users can sign up and log in using email and password without any issues.
