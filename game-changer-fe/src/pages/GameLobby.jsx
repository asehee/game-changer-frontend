import { useState, useEffect } from 'react';
import { Search, TrendingUp, Award, Sparkles, Filter, ChevronRight, DollarSign, Clock, Vote, ThumbsUp, ThumbsDown, Users } from 'lucide-react';
import GameCard from '../components/GameCard';
import { useTranslation } from '../hooks/useTranslation';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import CrowdFundingApiService from '../services/crowdFundingApi';

const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

const GameLobby = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, walletAddress, getTempBalance } = useUser();
  const [games, setGames] = useState({
    recommended: [],
    top: [],
    new: []
  });
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState(['all']);
  const { t } = useTranslation();

  // Modal states
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fundingAmount, setFundingAmount] = useState('');
  const [voteType, setVoteType] = useState(null); // 'agree' or 'disagree'
  const [crowdfundingProjects, setCrowdfundingProjects] = useState([]);
  const [loadingCrowdfunding, setLoadingCrowdfunding] = useState(false);

  const votingProjects = [
    {
      id: 1,
      title: "Add Dark Mode to Platform",
      description: "Community vote on implementing dark mode theme",
      agree: { count: 120, percentage: 80 },
      disagree: { count: 30, percentage: 20 },
      daysLeft: 5,
      totalVotes: 150
    },
    {
      id: 2,
      title: "New Tournament System",
      description: "Vote on proposed tournament and ranking system",
      agree: { count: 85, percentage: 63 },
      disagree: { count: 50, percentage: 37 },
      daysLeft: 3,
      totalVotes: 135
    }
  ];

  // Fetch crowdfunding projects from API
  const fetchCrowdfundingProjects = async () => {
    setLoadingCrowdfunding(true);
    try {
      console.log('[GameLobby] Fetching crowdfunding projects...');
      const response = await fetch(`${API_URL}/api/crowd-funding`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[GameLobby] Crowdfunding API response:', data);
      
      // API 데이터를 UI에 맞게 변환
      const transformedData = data.map(project => ({
        id: project.id,
        title: project.gameName,
        description: `Funding goal: $${parseFloat(project.goalAmount).toLocaleString()}`,
        goal: parseFloat(project.goalAmount),
        raised: parseFloat(project.currentAmount),
        daysLeft: Math.max(0, Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))),
        image: "/src/assets/game_images/fantasy1.png", // 기본 이미지 사용
        fundingProgress: project.fundingProgress,
        participantCount: project.participantCount,
        voteStatus: project.voteStatus,
        fundingStatus: project.fundingStatus
      }));
      
      setCrowdfundingProjects(transformedData);
    } catch (error) {
      console.error('[GameLobby] Failed to fetch crowdfunding projects:', error);
      // 오류 시 빈 배열로 설정
      setCrowdfundingProjects([]);
    } finally {
      setLoadingCrowdfunding(false);
    }
  };

  // Load crowdfunding projects on component mount
  useEffect(() => {
    fetchCrowdfundingProjects();
  }, []);

  // Handle URL hash scrolling
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#crowdfunding') {
      setTimeout(() => {
        document.getElementById('crowdfunding')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100); // Small delay to ensure elements are rendered
    }
  }, []);

  // Handle ESC key for modals
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showFundingModal) {
          setShowFundingModal(false);
          setFundingAmount('');
          setSelectedProject(null);
        }
        if (showVotingModal) {
          setShowVotingModal(false);
          setVoteType(null);
          setSelectedProject(null);
        }
        if (showSuccessModal) {
          setShowSuccessModal(false);
          setSelectedProject(null);
        }
      }
    };

    if (showFundingModal || showVotingModal || showSuccessModal) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showFundingModal, showVotingModal, showSuccessModal]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching games from API...');
        
        const response = await axios.get('http://localhost:3000/api/games');
        console.log('✅ API Response received:', response.data.length, 'games');
        
        if (response.data && response.data.length > 0) {
          const allGames = response.data;
          
          // 장르 추출 (중복 제거 및 빈 문자열 제외)
          const uniqueGenres = [...new Set(allGames.map(game => game.genre).filter(genre => genre))];
          setGenres(['all', ...uniqueGenres]);
          
          // 게임을 평점과 인기도에 따라 정렬
          const sortedByRating = [...allGames].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          const sortedByPlayers = [...allGames].sort((a, b) => (b.playerCount || 0) - (a.playerCount || 0));
          const sortedByDate = [...allGames].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          // setGames({
          //   recommended: sortedByRating.slice(0, 4),
          //   top: sortedByPlayers.slice(0, 4),
          //   new: sortedByDate.slice(0, 4)
          // });
          
          // console.log('🎮 Games loaded from API successfully');
          // console.log('📚 Available genres:', uniqueGenres);
          //일단 게임이 있어도 목업 보여주기!!
          setMockGames();
        } else {
          console.log('⚠️ No games found from API, using mock data');
          setMockGames();
        }
      } catch (error) {
        console.error('❌ Failed to fetch games from API:', error.message);
        console.log('🔄 Falling back to mock data');
        setMockGames();
      } finally {
        setLoading(false);
      }
    };

    const setMockGames = () => {
      const mockGames = {
        recommended: [
          { id: "3caf36a4-828a-4ef1-8c09-8129ec286940", title: 'Puzzle 2048', description: 'Epic cyberpunk battle royale with stunning graphics and intense gameplay mechanics', playerCount: 15234, totalPlayTime: '125k h', rating: 4.8, price: 0.5, discount: 20, thumbnail: '/src/assets/game_images/puzzle1.png' },
          { id: 1, title: 'Cyber Warriors', description: 'Epic cyberpunk battle royale with stunning graphics and intense gameplay mechanics', playerCount: 15234, totalPlayTime: '125k h', rating: 4.8, price: 0.5, discount: 20, thumbnail: '/src/assets/game_images/shooting1.png' },
          { id: 2, title: 'Space Odyssey', description: 'Explore infinite galaxies in this immersive space simulation adventure', playerCount: 8923, totalPlayTime: '89k h', rating: 4.6, price: 0.8, thumbnail: '/src/assets/game_images/shooting2.png' },
          { id: 3, title: 'Fantasy Quest', description: 'Medieval RPG adventure with magical creatures and epic storylines', playerCount: 12456, totalPlayTime: '156k h', rating: 4.9, price: 0, thumbnail: '/src/assets/game_images/fantasy1.png' },
        ],
        top: [
          { id: 5, title: 'Battle Arena', description: 'Competitive 5v5 MOBA with unique heroes and strategic gameplay', playerCount: 25678, totalPlayTime: '289k h', rating: 4.7, price: 0, thumbnail: '/src/assets/game_images/fantasy2.png' },
          { id: 6, title: 'City Merge', description: 'Mind-bending puzzles that challenge your intellect and creativity', playerCount: 9876, totalPlayTime: '45k h', rating: 4.5, price: 0.2, thumbnail: '/src/assets/game_images/kids1.png' },
          { id: 7, title: 'Mystery Survival', description: 'Survive the apocalypse in this intense shooter with cooperative gameplay', playerCount: 18234, totalPlayTime: '198k h', rating: 4.6, price: 0.4, discount: 15, thumbnail: '/src/assets/game_images/horror1.png' },
          { id: 8, title: 'Puzzle Master', description: 'Create and manage your dream metropolis with advanced city planning', playerCount: 7654, totalPlayTime: '87k h', rating: 4.3, price: 0.6, thumbnail: '/src/assets/game_images/kids2.png' },
        ],
        new: [
          { id: 9, title: 'Neon Nights', description: 'Stylish action game set in neon-lit cyberpunk streets', playerCount: 3456, totalPlayTime: '12k h', rating: 4.4, price: 0.7, discount: 30, thumbnail: '/src/assets/game_images/shooting4.png' },
          { id: 10, title: 'Dragon Explorer', description: 'Dive deep into mysterious underwater worlds and discover ancient secrets', playerCount: 2345, totalPlayTime: '8k h', rating: 4.2, price: 0.5, thumbnail: '/src/assets/game_images/fantasy3.png' },
          { id: 11, title: 'Sky Pirates', description: 'Aerial combat with customizable airships and treasure hunting', playerCount: 4567, totalPlayTime: '15k h', rating: 4.6, price: 0.9, thumbnail: '/src/assets/game_images/fantasy4.png' },
          { id: 12, title: 'Dungeon Crawler', description: 'Procedurally generated dungeons with epic loot and challenging bosses', playerCount: 5678, totalPlayTime: '23k h', rating: 4.5, price: 0.4, thumbnail: '/src/assets/game_images/horror2.png' },
        ]
      };
      setGames(mockGames);
    };

    fetchGames();
  }, []);

  // 장르 번역 매핑
  const genreTranslations = {
    'all': t('allGames'),
    'action': t('action'),
    'adventure': t('adventure'),  
    'strategy': t('strategy'),
    'simulation': t('simulation'),
    'rpg': t('rpg'),
    'puzzle': t('puzzle'),
    'horror': t('horror'),
    'racing': t('racing')
  };

  // Modal handler functions
  const handleFundingClick = (project) => {
    setSelectedProject(project);
    setShowFundingModal(true);
  };

  const handleVotingClick = (project) => {
    setSelectedProject(project);
    setShowVotingModal(true);
  };

  const handleFundingSubmit = async () => {
    if (!fundingAmount || !selectedProject) {
      alert('펀딩 금액을 입력해주세요');
      return;
    }

    if (!user?.id) {
      alert('로그인이 필요합니다');
      return;
    }

    const numAmount = parseFloat(fundingAmount);
    if (numAmount <= 0) {
      alert('유효한 금액을 입력해주세요');
      return;
    }

    try {
      const result = await CrowdFundingApiService.processEscrowTransaction({
        userId: user.id,
        crowdId: selectedProject.id,
        amount: fundingAmount
      });

      if (result.status === 'success') {
        // 펀딩 모달 닫기
        setShowFundingModal(false);
        // 성공 모달 표시
        setShowSuccessModal(true);
        // 상태 초기화
        setFundingAmount('');
        
        // 크라우드펀딩 목록 새로고침
        fetchCrowdfundingProjects();
        getTempBalance(walletAddress);
      }
    } catch (error) {
      console.error('펀딩 실패:', error);
      alert(error.message || '펀딩 처리 중 오류가 발생했습니다');
    }
  };

  const handleVotingSubmit = () => {
    if (voteType && selectedProject) {
      alert(`Voted ${voteType} for ${selectedProject.title}`);
      setShowVotingModal(false);
      setVoteType(null);
      setSelectedProject(null);
    }
  };

  // 게임 필터링 함수
  const filterGamesByGenre = (gamesList) => {
    if (selectedCategory === 'all') {
      return gamesList;
    }
    return gamesList.filter(game => 
      game.genre && game.genre.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  // 검색어로 필터링하는 함수
  const filterGamesBySearch = (gamesList) => {
    if (!searchTerm.trim()) {
      return gamesList;
    }
    return gamesList.filter(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 최종 필터링된 게임들
  const getFilteredGames = (gamesList) => {
    let filtered = filterGamesByGenre(gamesList);
    filtered = filterGamesBySearch(filtered);
    return filtered;
  };

  return (
    <div className="min-h-screen relative">
      {/* Glassmorphism Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/bg.png')`,
        }}
      />
      <div className="bg-black/30 fixed inset-0" />
      
      {/* Main Content */}
      <div className="relative z-10">
          <div className="relative mb-16 bg-black/10 border border-white/10 rounded-3xl overflow-hidden p-16 shadow-2xl mx-6 mt-6 backdrop-blur-xl
            after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/70 after:to-transparent after:z-0">
          <div className="absolute top-0 left-0 w-full h-full -z-10">
            <div className="absolute -top-1/4 -left-1/4 w-[700px] h-[600px] bg-[#0D18E7] rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-[#6A0DAD] rounded-full mix-blend-lighten filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00A1A1] rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
              {t('welcomeTitle')}
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('welcomeDescription')}
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <div className="relative max-w-2xl mx-auto w-full">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl focus:outline-none focus:ring-4 focus:ring-white/30 placeholder-white/50 shadow-xl font-medium text-white hover:bg-white/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

      <div className="mb-12 px-6 py-8">
        <div className="flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide py-2">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedCategory(genre)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 whitespace-nowrap shadow-lg backdrop-blur-xl ${
                selectedCategory === genre
                  ? 'bg-white/30 text-white border border-white/40 shadow-white/20 hover:shadow-white/30 scale-105'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20 shadow-black/20 hover:shadow-xl hover:scale-105 hover:text-white'
              }`}
            >
              {genreTranslations[genre] || genre.charAt(0).toUpperCase() + genre.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-20 px-6 pb-20">
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">{t('featuredRecommended')}</h2>
            </div>
            <button className="text-white/80 hover:text-white flex items-center gap-2 font-medium text-lg hover:scale-105 transition-all duration-200">
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {games.recommended.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">{t('topRatedGames')}</h2>
            </div>
            <button className="text-white/80 hover:text-white flex items-center gap-2 font-medium text-lg hover:scale-105 transition-all duration-200">
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {games.top.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Crowdfunding Section */}
        <section id="crowdfunding" className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">{t('crowdfundingSection')}</h2>
            </div>
            <button className="text-white/80 hover:text-white flex items-center gap-2 font-medium text-lg hover:scale-105 transition-all duration-200">
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {loadingCrowdfunding ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
                <p className="text-white/60">{t('loading')}...</p>
              </div>
            </div>
          ) : crowdfundingProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">{t('noCrowdfundingProjects') || 'No crowdfunding projects available'}</p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {crowdfundingProjects.map(project => (
                <div key={project.id} className="flex-none w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 group">
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{project.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm">{project.description}</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-white/80 text-sm mb-2">
                      <span>{t('progress')}</span>
                      <span>{Math.round((project.raised / project.goal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(project.raised / project.goal) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-white">${project.raised.toLocaleString()}</p>
                        <p className="text-white/60 text-sm">{t('goal')}: ${project.goal.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-white/80">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{project.daysLeft} {t('daysLeft')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFundingClick(project)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
                  >
{t('fund')}
                  </button>
                </div>
              </div>
              ))}
            </div>
          )}
        </section>

        {/* Voting Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">{t('votingSection')}</h2>
            </div>
            <button className="text-white/80 hover:text-white flex items-center gap-2 font-medium text-lg hover:scale-105 transition-all duration-200">
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {votingProjects.map(project => (
              <div key={project.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{project.description}</p>
                  <div className="flex items-center gap-1 text-white/60 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{project.daysLeft} {t('daysLeft')}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">{t('agree')}</span>
                    </div>
                    <span className="text-green-400 font-bold">{project?.agree?.count || 0} {t('votes')} ({project?.agree?.percentage || 0}%)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-400" />
                      <span className="text-white font-medium">{t('disagree')}</span>
                    </div>
                    <span className="text-red-400 font-bold">{project?.disagree?.count || 0} {t('votes')} ({project?.disagree?.percentage || 0}%)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleVotingClick(project)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
{t('vote')}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>

      {/* Funding Modal */}
      {showFundingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('fundingProject')}</h3>
            {selectedProject && (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">{selectedProject.title}</h4>
                  <div className="text-white/60 text-sm space-y-1">
                    <p>{t('goal')}: ${selectedProject.goal.toLocaleString()}</p>
                    <p>{t('current')}: ${selectedProject.raised.toLocaleString()}</p>
                    <p>{t('remainingPeriod')}: {selectedProject.daysLeft} {t('daysLeft')}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">{t('fundingAmount')}</label>
                  <input
                    type="number"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    placeholder={t('enterAmount')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowFundingModal(false)}
                    className="flex-1 px-4 sm:px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
                  >
{t('cancel')}
                  </button>
                  <button
                    onClick={handleFundingSubmit}
                    disabled={!fundingAmount}
                    className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('confirm')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Voting Modal */}
      {showVotingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('votingFor')}</h3>
            {selectedProject && (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">{selectedProject.title}</h4>
                  <p className="text-white/60 text-sm mb-4">{selectedProject.description}</p>
                  <p className="text-white/60 text-sm">{t('remainingPeriod')}: {selectedProject.daysLeft} {t('daysLeft')}</p>
                </div>
                <div className="mb-6 space-y-3">
                  <button
                    onClick={() => setVoteType('agree')}
                    className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      voteType === 'agree'
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span className="font-medium">{t('agree')}</span>
                    <span className="ml-auto text-sm">
                      {selectedProject?.agree?.count || 0} {t('votes')} ({selectedProject?.agree?.percentage || 0}%)
                    </span>
                  </button>
                  <button
                    onClick={() => setVoteType('disagree')}
                    className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      voteType === 'disagree'
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span className="font-medium">{t('disagree')}</span>
                    <span className="ml-auto text-sm">
                      {selectedProject?.disagree?.count || 0} {t('votes')} ({selectedProject?.disagree?.percentage || 0}%)
                    </span>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowVotingModal(false)}
                    className="flex-1 px-4 sm:px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
                  >
{t('cancel')}
                  </button>
                  <button
                    onClick={handleVotingSubmit}
                    disabled={!voteType}
                    className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('confirm')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('fundingCompleted')}</h3>
            <p className="text-white/80 mb-6">{t('fundingSuccess')}</p>
            {selectedProject && (
              <div className="bg-white/10 rounded-2xl p-4 mb-6">
                <p className="text-white/60 text-sm mb-1">{t('project')}</p>
                <p className="text-white font-semibold">{selectedProject.title}</p>
              </div>
            )}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedProject(null);
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200"
            >
              {t('thankYou')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLobby;