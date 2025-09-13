import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import GameLobby from './pages/GameLobby';
import GamePlay from './pages/GamePlay';
import MyPage from './pages/MyPage';
import DeveloperDashboard from './pages/DeveloperDashboard';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<GameLobby />} />
            <Route path="game/:gameId" element={<GamePlay />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="developer" element={<DeveloperDashboard />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;