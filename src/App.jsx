import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingView from './views/LandingView';
import LoginView from './views/LoginView';
import SignUpView from './views/SignUpView';
import DashboardView from './views/DashboardView';
import ScreeningView from './views/ScreeningView';
import ResultView from './views/ResultView';
import HistoryView from './views/HistoryView';

function AppContent() {
  const { currentPage } = useApp();

  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return <LandingView />;
      case 'login':
        return <LoginView />;
      case 'signup':
        return <SignUpView />;
      case 'dashboard':
        return <DashboardView />;
      case 'screening':
        return <ScreeningView />;
      case 'result':
        return <ResultView />;
      case 'history':
        return <HistoryView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
      <Navbar />
      <main className="flex-1 w-full pt-20">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
