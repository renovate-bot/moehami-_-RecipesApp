"use client";

import { HomeIcon, LogOutIcon, Menu, SettingsIcon, UsersIcon, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

// Define User Type
interface User {
    id: string;
    emailAddresses: { emailAddress: string }[];
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | '';
}

interface ApiResponse {
    data: User[]; // Array of User objects
    totalCount: number; // Number of users
}

// Users Component receives users, loading, and error as typed props
interface UsersProps {
    users: User[]; // Array of User objects
    loading: boolean;
    error: string;
}

const Users = ({ users, loading, error }: UsersProps) => {
    if (loading) return <div>Loading users...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">User Management</h2>
            <p className="text-gray-600 dark:text-gray-300">Here you can manage all your platform's users.</p>
            <div>
                {users.length > 0 ? ( // Check if users exist
                    <table className="mt-8 min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase">Avatar</th>
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase">Email</th>
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-6 py-4"><Image src={user.imageUrl} alt={user.id} width={50} height={50} className="w-[50px] h-[50px] rounded-full object-cover" /></td>
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-6 py-4">{user.emailAddresses[0]?.emailAddress || 'N/A'}</td>
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-6 py-4">{user.firstName} {user.lastName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => (
    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Welcome, Admin!</h2>
        <p className="text-gray-600 dark:text-gray-300">This is your admin dashboard. From here, you can manage users, settings, and other admin functionalities.</p>
    </div>
);

const Settings = () => (
    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Settings</h2>
        <p className="text-gray-600 dark:text-gray-300">Adjust your application settings here.</p>
    </div>
);

const AdminDashboardPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings'>('dashboard');
    const [users, setUsers] = useState<User[]>([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            if (activeTab !== 'users') return; // Only fetch when activeTab is 'users'
            setLoading(true);
            setError('');

            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                
                const data: ApiResponse = await response.json();
                console.log(data);
                setUsers(data.data); // Set users to the array of User objects
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [activeTab]);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // Render the selected content based on the active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <Users users={users} loading={loading} error={error} />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? "w-64" : "w-20"
                } bg-slate-200 dark:bg-gray-800 transition-all duration-300 dark:text-gray-100 flex flex-col min-h-screen`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 dark:text-white bg-slate-300 dark:bg-gray-700">
                    <span className={`text-2xl font-bold ${!isSidebarOpen && "hidden"}`}>
                        Admin
                    </span>
                    <button onClick={toggleSidebar} className="text-slate-600 dark:text-gray-400">
                        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Sidebar Links */}
                <nav className="flex-1 p-4 space-y-4">
                    {['dashboard', 'users', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'dashboard' | 'users' | 'settings')}
                            className={`flex items-center space-x-2 p-2 hover:bg-custom_orange rounded-lg w-full ${
                                activeTab === tab ? 'bg-custom_orange text-white' : ''
                            }`}
                        >
                            {tab === 'dashboard' && <HomeIcon className="w-6 h-6" />}
                            {tab === 'users' && <UsersIcon className="w-6 h-6" />}
                            {tab === 'settings' && <SettingsIcon className="w-6 h-6" />}
                            <span className={`${!isSidebarOpen && "hidden"}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4">
                    <button className="flex items-center space-x-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-100 rounded-lg p-2 w-full">
                        <LogOutIcon className="w-6 h-6" />
                        <span className={`${!isSidebarOpen && "hidden"}`}>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow">
                    <h1 className="text-2xl font-bold dark:text-gray-100">Admin Dashboard</h1>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
                    {renderContent()} {/* Render content based on the active tab */}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
