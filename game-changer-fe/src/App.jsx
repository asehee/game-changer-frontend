import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout';
import GameLobby from './pages/GameLobby';
import GamePlay from './pages/GamePlay';
import MyPage from './pages/MyPage';
import DeveloperDashboard from './pages/DeveloperDashboard';
import TokenFaucet from './pages/TokenFaucet';
import EarnFees from './pages/EarnFees';

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<GameLobby />} />
              <Route path="game/:gameId" element={<GamePlay />} />
              <Route path="mypage" element={<MyPage />} />
              <Route path="developer" element={<DeveloperDashboard />} />
              <Route path="tokenfaucet" element={<TokenFaucet />} />
              <Route path="earnfees" element={<EarnFees />} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;