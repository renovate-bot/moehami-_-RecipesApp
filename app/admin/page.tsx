"use client";

import { RecipeType } from '@/types/types';
import { CookingPotIcon, HomeIcon, LogOutIcon, Menu, SettingsIcon, UsersIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
    data: User[]; 
    totalCount: number; 
}

// Users Component receives users, loading, and error as typed props
interface UsersProps {
    users: User[]; 
    loading: boolean;
    error: string;
}

// Users Component receives recipes, loading, and error as typed props
interface RecipesProps {
    recipes: RecipeType[]; 
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
            <div className="overflow-x-auto"> {/* Make the table container responsive */}
                {users.length > 0 ? (
                    <table className="my-8 min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
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
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4">
                                        <Image src={user.imageUrl} alt={user.id} width={50} height={50} className="w-[50px] h-[50px] rounded-full object-cover" />
                                    </td>
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4">{user.emailAddresses[0]?.emailAddress || 'N/A'}</td>
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4">{user.firstName} {user.lastName}</td>
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

const Recipes = ({ recipes, loading, error }: RecipesProps) => {
    const router = useRouter();

    if (loading) return <div>Loading recipes...</div>;
    if (error) return <div>{error}</div>;

    const handleEdit = (id: string) => {
        console.log(`Edit recipe with ID: ${id}`);
    };

    const handleDelete = (id: string) => {
        console.log(`Delete recipe with ID: ${id}`);
    };

    const handleCreate = () => {
        router.push('/recipe/add');
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Manage Recipes</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Here you can manage your recipes.</p>
            <button
                onClick={handleCreate}
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
                Create Recipe
            </button>
            <div className="overflow-x-auto"> {/* Make the table container responsive */}
                {recipes.length > 0 ? (
                    <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase">Title</th>
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase">Category</th>
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe) => (
                                <tr key={recipe.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4">{recipe.title}</td>
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4">{recipe.category.name}</td>
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4">
                                        <button
                                            onClick={() => handleEdit(recipe.id)}
                                            className="text-yellow-500 hover:text-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(recipe.id)}
                                            className="ml-4 text-red-500 hover:text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
        </div>
    );
};

const Settings = () => (
    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Settings</h2>
        <p className="text-gray-600 dark:text-gray-300">Adjust your application settings here.</p>
    </div>
);

const AdminDashboardPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings' | 'recipes'>('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [recipes, setRecipes] = useState<RecipeType[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            if (activeTab === 'users') {
                setLoading(true);
                setError('');

                try {
                    const response = await fetch('/api/users');
                    if (!response.ok) throw new Error('Failed to fetch users');
                    
                    const data: ApiResponse = await response.json();
                    console.log(data);
                    setUsers(data.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                    setError('Failed to load users');
                } finally {
                    setLoading(false);
                }
            }

            if(activeTab === 'recipes') {
                setLoading(true);
                setError('');

                try {
                    const response = await fetch('/api/recipe');
                    if (!response.ok) throw new Error('Failed to fetch recipes');
                    
                    const data: RecipeType[] = await response.json();
                    setRecipes(data);
                } catch (error) {
                    console.error('Error fetching recipes:', error);
                    setError('Failed to load users');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUsers();
    }, [activeTab]);

    useEffect(() => {
        // Adjust the sidebar based on screen width
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false); // Close sidebar on small screens
            } else {
                setIsSidebarOpen(true); // Open sidebar on larger screens
            }
        };

        // Set initial sidebar state based on current screen size
        handleResize();
        // Attach resize event listener
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup listener
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <Users users={users} loading={loading} error={error} />;
            case 'settings':
                return <Settings />;
            case 'recipes':
                return <Recipes recipes={recipes} loading={loading} error={error} />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <div
                className={`${
                    isSidebarOpen ? "w-64" : "w-20"
                } bg-slate-200 dark:bg-gray-800 transition-all duration-300 dark:text-gray-100 md:flex flex-col min-h-screen`}
            >
                <div className="flex items-center justify-between p-4 dark:text-white bg-slate-300 dark:bg-gray-700">
                    <span className={`text-2xl font-bold ${!isSidebarOpen && "hidden"}`}>
                        Admin
                    </span>
                    <button onClick={toggleSidebar} className="text-slate-600 dark:text-gray-400">
                        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-4">
                    {['dashboard', 'users', 'settings', 'recipes'].map(tab => (
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
                            {tab === 'recipes' && <CookingPotIcon className="w-6 h-6" />}
                            <span className={`${!isSidebarOpen && "hidden"}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4">
                    <button className="flex items-center space-x-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-100 rounded-lg p-2 w-full">
                        <LogOutIcon className="w-6 h-6" />
                        <span className={`${!isSidebarOpen && "hidden"}`}>Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow">
                    <h1 className="text-2xl font-bold dark:text-gray-100">Admin Dashboard</h1>
                </header>

                <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
