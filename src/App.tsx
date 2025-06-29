import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Posts from './components/Posts';
import Categories from './components/Categories';
import ContentPages from './components/ContentPages';
import Products from './components/Products';
import Orders from './components/Orders';
import Reviews from './components/Reviews';
import Coupons from './components/Coupons';
import Users from './components/Users';
import Settings from './components/Settings';
import Profile from './components/Profile';
import MediaLibrary from './components/MediaLibrary';
import Gallery from './components/Gallery';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'posts':
        return <Posts />;
      case 'categories':
        return <Categories />;
      case 'content':
        return <ContentPages />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'reviews':
        return <Reviews />;
      case 'coupons':
        return <Coupons />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'media':
        return <MediaLibrary />;
      case 'galleries':
        return <Gallery />;
      case 'menus':
        return <div className="text-center py-12"><h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu Builder - Coming Soon</h2></div>;
      case 'forms':
        return <div className="text-center py-12"><h2 className="text-xl font-semibold text-gray-900 dark:text-white">Form Builder - Coming Soon</h2></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveTab()}
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;