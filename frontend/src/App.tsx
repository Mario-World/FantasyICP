import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Contests from "./pages/Contests";
import Tournaments from "./pages/Tournaments";
import MyTeams from "./pages/MyTeams";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Sidebar } from './components/common/Sidebar';
import "@nfid/identitykit/react/styles.css"
import { IdentityKitProvider } from "@nfid/identitykit/react"

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <IdentityKitProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={Dashboard} />}
                />
                <Route
                  path="/contests"
                  element={<ProtectedRoute element={Contests} />}
                />
                <Route
                  path="/tournaments"
                  element={<ProtectedRoute element={Tournaments} />}
                />
                <Route
                  path="/my-teams"
                  element={<ProtectedRoute element={MyTeams} />}
                />
                <Route
                  path="/rewards"
                  element={<ProtectedRoute element={Rewards} />}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute element={Profile} />}
                />
                <Route
                  path="*"
                  element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />}
                />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </IdentityKitProvider>
  );
}

export default App;
