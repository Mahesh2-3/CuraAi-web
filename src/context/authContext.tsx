import { listenToAuthChanges, signOutUser } from "../lib/auth";
import { db } from "../lib/firebaseConfig";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { storage } from "../lib/storage";

interface AuthContextType {
    user: User | null;
    profile: any | null;
    settings: any | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    refreshSettings: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    settings: null,
    refreshProfile: async () => { },
    refreshSettings: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any | null>(null)

    /* =========================
       FETCH PROFILE FROM FIRESTORE
    ========================= */
    const fetchSettings = async (u: User | null) => {
        if (!u) {
            setSettings(null);
            await storage.remove("user_settings");
            return;
        }

        // 1️⃣ Load cached settings first (FAST)
        const cached = await storage.get("user_settings");
        if (cached) {
            setSettings(cached);
        }

        try {
            // 2️⃣ Fetch fresh settings
            const snap = await getDoc(
                doc(db, "users", u.uid, "settings", "preferences")
            );

            if (snap.exists()) {
                const data = snap.data();
                setSettings(data);

                // 3️⃣ Update cache
                await storage.set("user_settings", data);
            }
        } catch (err) {
            console.error("Settings fetch error:", err);
        }
    };


    const fetchProfile = async (u: User | null) => {
        if (!u) {
            setProfile(null);
            return;
        }

        try {
            const snap = await getDoc(doc(db, "users", u.uid));
            if (snap.exists()) {
                setProfile(snap.data());
            } else {
                setProfile(null); // edge case: function not run yet
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            setProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (!user) return;
        await fetchProfile(user);
    };
    const refreshSettings = async () => {
        if (!user) return;
        await fetchSettings(user);
    };


    const logout = async () => {
        setLoading(true);
        await signOutUser();
        setUser(null);
        setProfile(null);
        setSettings(null)
        await storage.remove("user_settings")
        setLoading(false);
    };

    useEffect(() => {
        const unsubscribe = listenToAuthChanges(async (u: User | null) => {
            setUser(u);
            await fetchProfile(u);
            await fetchSettings(u);

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, profile, loading, refreshProfile, settings, refreshSettings, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
