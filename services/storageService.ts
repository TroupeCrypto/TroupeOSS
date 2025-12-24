
import { InventoryItem } from '../types';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// --- Types ---
export interface CloudConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// --- State ---
let db: any = null;
let isCloudEnabled = false;

// --- Helpers ---
const STORAGE_KEY = 'vibe_inventory';
const CONFIG_KEY = 'vibe_cloud_config';
const PASSWORD_KEY = 'vibe_admin_password';

// --- Initialization ---
export const initStorage = async () => {
  const savedConfig = localStorage.getItem(CONFIG_KEY);
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      const app = initializeApp(config);
      db = getFirestore(app);
      isCloudEnabled = true;
      console.log("☁️ Connected to Firebase Cloud");
    } catch (e) {
      console.error("Failed to init cloud connection:", e);
      isCloudEnabled = false;
    }
  }
};

export const saveCloudConfig = (config: CloudConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  window.location.reload(); // Reload to init firebase
};

export const clearCloudConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
  window.location.reload();
};

export const getAdminPassword = (): string => {
  return localStorage.getItem(PASSWORD_KEY) || 'admin123';
};

export const setAdminPassword = (password: string) => {
  localStorage.setItem(PASSWORD_KEY, password);
};

// --- CRUD Operations ---

export const saveItem = async (item: InventoryItem): Promise<boolean> => {
  // Check for duplicates in local state to prevent double-dipping logic
  // (In a real DB, we'd use a unique constraint, but this is client-side check)
  const currentItems = await getItems();
  const exists = currentItems.some(i => i.id === item.id || (i.name === item.name && i.category === item.category));
  
  if (exists) {
    console.warn("Duplicate item prevented.");
    return false; 
  }

  if (isCloudEnabled && db) {
    try {
      await addDoc(collection(db, "inventory"), item);
      return true;
    } catch (e) {
      console.error("Cloud save failed", e);
      return false;
    }
  } else {
    // Local Fallback
    const items = getLocalItems();
    items.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  }
};

export const getItems = async (): Promise<InventoryItem[]> => {
  if (isCloudEnabled && db) {
    try {
      const q = query(collection(db, "inventory"), orderBy("dateCreated", "desc"));
      const querySnapshot = await getDocs(q);
      const items: InventoryItem[] = [];
      querySnapshot.forEach((doc: any) => {
        const data = doc.data() as InventoryItem;
        // Ensure ID matches doc ID for deletion purposes in cloud
        items.push({ ...data, id: doc.id }); 
      });
      return items;
    } catch (e) {
      console.error("Cloud fetch failed", e);
      return getLocalItems();
    }
  } else {
    return getLocalItems();
  }
};

export const deleteItem = async (id: string): Promise<boolean> => {
  if (isCloudEnabled && db) {
    try {
      await deleteDoc(doc(db, "inventory", id));
      return true;
    } catch (e) {
      console.error("Cloud delete failed", e);
      return false;
    }
  } else {
    const items = getLocalItems();
    const newItems = items.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    return true;
  }
};

// Internal Local Helper
const getLocalItems = (): InventoryItem[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const isCloudActive = () => isCloudEnabled;
