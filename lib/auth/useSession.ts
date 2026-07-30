"use client";

import { useCallback, useEffect, useState } from "react";
import { accountById, authenticate, type Account } from "./accounts";

/*
 * Client-side demo session.
 *
 * The build is a static export, so there is nowhere to keep a real session.
 * This stores an account id in localStorage. It is a convenience for moving
 * around the prototype, not a security boundary: anyone can set the key by
 * hand. Real auth belongs on a server with an httpOnly cookie.
 */

const STORAGE_KEY = "medcompass.demo.session";

export type SessionState =
  | { status: "loading"; account: null }
  | { status: "signed-out"; account: null }
  | { status: "signed-in"; account: Account };

export function useSession() {
  const [state, setState] = useState<SessionState>({ status: "loading", account: null });

  // Read after mount. Touching localStorage during render would desync the
  // server-rendered HTML from the first client paint.
  useEffect(() => {
    try {
      const id = window.localStorage.getItem(STORAGE_KEY);
      const account = id ? accountById(id) : null;
      setState(account ? { status: "signed-in", account } : { status: "signed-out", account: null });
    } catch {
      // Private browsing can throw on localStorage access.
      setState({ status: "signed-out", account: null });
    }
  }, []);

  const signIn = useCallback((email: string, password: string): { ok: boolean; error?: string } => {
    const account = authenticate(email, password);
    if (!account) {
      return { ok: false, error: "We do not recognise that email and password together." };
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, account.id);
    } catch {
      // Session simply will not persist across reloads. Not fatal.
    }
    setState({ status: "signed-in", account });
    return { ok: true };
  }, []);

  /** Signs in directly from the demo account list, skipping the form. */
  const signInAs = useCallback((account: Account) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, account.id);
    } catch {
      /* no-op */
    }
    setState({ status: "signed-in", account });
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* no-op */
    }
    setState({ status: "signed-out", account: null });
  }, []);

  return { ...state, signIn, signInAs, signOut };
}
