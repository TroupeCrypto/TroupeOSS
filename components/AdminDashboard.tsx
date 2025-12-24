
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { IconLock, IconShield, IconSparkles, IconTrash, IconClose, IconWarehouse, IconSave, IconSettings, IconKey } from './Icons';
import { saveCloudConfig, clearCloudConfig, isCloudActive, setAdminPassword as updateAdminPassword, getAdminPassword } from '../services/storageService';

interface AdminDashboardProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  onClose: () => void;
  refreshData: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ inventory, setInventory, onClose, refreshData }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'inventory' | 'config' | 'security'>('inventory');

  // Config State
  const [firebaseConfigStr, setFirebaseConfigStr] = useState('');
  
  // Password State
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = getAdminPassword();
    if (password === currentPass) { 
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Access Credentials');
    }
  };

  const handleConnectCloud = () => {
    try {
      const config = JSON.parse(firebaseConfigStr);
      saveCloudConfig(config);
      alert("Configuration saved. System rebooting to connect...");
    } catch (e) {
      alert("Invalid JSON configuration. Please copy the object directly from Firebase Console.");
    }
  };

  const handleDisconnect = () => {
    if(window.confirm("Disconnect from Cloud Database?")) {
      clearCloudConfig();
    }
  };

  const handleUpdatePassword = () => {
    if (newPassword.length < 4) {
      alert("Password too weak.");
      return;
    }
    updateAdminPassword(newPassword);
    alert("Admin credentials updated.");
    setNewPassword('');
  };

  const handleDelete = (id: string) => {
    // Note: Actual deletion logic passed from parent or handled via service in parent
    // For this specific component structure, we'll let the parent handle the update via the prop method if linked, 
    // but since we are using a service now, we should really call the service. 
    // However, to keep props consistent, we'll emit an event or let parent handle re-fetch.
    // The App.tsx handles the actual service call, we just optimistically update here for UI speed.
    if (window.confirm("Permanently delete this asset?")) {
        // Optimistic update
        setInventory(prev => prev.filter(item => item.id !== id));
        // Trigger parent sync
        setTimeout(refreshData, 100); 
    }
  };

  const calculateTotalValue = () => {
    return inventory.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 animate-fade-in p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <IconClose className="w-6 h-6" />
        </button>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconLock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Backend Access</h2>
          <p className="text-gray-400 mb-6 text-sm">Restricted Area. Authorized personnel only.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none text-center tracking-widest"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/20"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col animate-fade-in overflow-hidden">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
            <div className="bg-red-500/10 p-2 rounded-lg text-red-400">
                <IconShield className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white">System Backend</h1>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isCloudActive() ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></span>
                    {isCloudActive() ? 'Cloud Connection Active' : 'Local Storage Mode'}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Asset Value</p>
                <p className="text-xl font-mono text-green-400">${calculateTotalValue()}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                <IconClose className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 hidden md:flex flex-col gap-2">
            <button 
                onClick={() => setActiveView('inventory')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'inventory' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
            >
                <IconWarehouse className="w-5 h-5" />
                Inventory
            </button>
            <button 
                onClick={() => setActiveView('config')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'config' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
            >
                <IconSettings className="w-5 h-5" />
                Cloud Config
            </button>
            <button 
                onClick={() => setActiveView('security')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'security' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
            >
                <IconKey className="w-5 h-5" />
                Security
            </button>
        </div>

        {/* Main View */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {activeView === 'inventory' && (
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <IconWarehouse className="w-5 h-5 text-gray-400" />
                            Global Inventory ({inventory.length})
                        </h2>
                        <button onClick={refreshData} className="text-xs bg-gray-700 px-3 py-1 rounded text-white hover:bg-gray-600">Sync</button>
                    </div>

                    {inventory.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
                            <p className="text-gray-500">Warehouse is empty. Generate assets and save them to populate.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-900/50 text-gray-400 uppercase font-semibold">
                                        <tr>
                                            <th className="p-4">Asset ID</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Name / Preview</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4 text-right">Value</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {inventory.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="p-4 font-mono text-gray-500 text-xs">{item.id.slice(-8)}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                        item.type === 'image' ? 'bg-purple-500/20 text-purple-400' :
                                                        item.type === 'code' ? 'bg-blue-500/20 text-blue-400' :
                                                        item.type === 'employee' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-gray-700 text-gray-300'
                                                    }`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {item.type === 'image' && (
                                                            <img src={item.content} className="w-10 h-10 rounded object-cover bg-black" alt="thumb" />
                                                        )}
                                                        <span className="font-medium text-white truncate max-w-[200px]">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-400 text-xs">
                                                    {new Date(item.dateCreated).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right font-mono text-green-400">
                                                    ${item.price.toFixed(2)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                        title="Delete from Database"
                                                    >
                                                        <IconTrash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeView === 'config' && (
                 <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-6">Cloud Infrastructure</h2>
                    
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-bold text-white mb-4">Connection Status</h3>
                        {isCloudActive() ? (
                            <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <IconSparkles className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-green-400 font-bold">Connected to Firebase</p>
                                    <p className="text-xs text-gray-400">Real-time persistence enabled.</p>
                                </div>
                                <button 
                                    onClick={handleDisconnect}
                                    className="ml-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <IconWarehouse className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-yellow-400 font-bold">Running on Local Storage</p>
                                    <p className="text-xs text-gray-400">Data persists on this device only.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Firebase Configuration JSON</label>
                        <textarea 
                            value={firebaseConfigStr}
                            onChange={(e) => setFirebaseConfigStr(e.target.value)}
                            placeholder='{ "apiKey": "...", "authDomain": "..." }'
                            className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-xs text-white focus:border-primary focus:outline-none"
                        />
                        <p className="text-xs text-gray-500">
                            Create a project at <a href="https://console.firebase.google.com" target="_blank" className="text-primary hover:underline">console.firebase.google.com</a>, add a Web App, and paste the config object here.
                        </p>
                        <button 
                            onClick={handleConnectCloud}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20"
                        >
                            Connect & Reboot
                        </button>
                    </div>
                 </div>
            )}

            {activeView === 'security' && (
                <div className="max-w-xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Change Admin Password</label>
                        <input 
                            type="text" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Secure Password"
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none mb-4"
                        />
                        <button 
                            onClick={handleUpdatePassword}
                            disabled={!newPassword}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                        >
                            Update Credentials
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
