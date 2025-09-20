import { useState, useEffect } from 'react';
import { DollarSign, Vote, CheckCircle, XCircle, TrendingUp, Users, Calendar, Settings } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import CrowdFundingApiService from '../services/crowdFundingApi';

const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

const AdminDashboard = () => {
  const { t } = useTranslation();

  const [fundingProjects, setFundingProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockProjects = [
    {
      id: 'mock-1',
      name: 'VR 어드벤처 게임',
      goal: 5000000,
      raised: 3250000,
      participants: 125,
      startDate: '2024-08-15',
      status: 'in_progress',
      finished: false,
      voteStatus: 'passed',
      voteApprovalRate: 87,
      endDate: '2024-12-31T23:59:59.000Z',
      fundingProgress: 65
    },
    {
      id: 'mock-2', 
      name: '블록체인 RPG',
      goal: 8000000,
      raised: 8500000,
      participants: 200,
      startDate: '2024-07-01',
      status: 'goal_reached',
      finished: false,
      voteStatus: 'passed',
      voteApprovalRate: 92,
      endDate: '2024-11-30T23:59:59.000Z',
      fundingProgress: 106.25
    }
  ];

  // Fetch crowdfunding projects from API and mix with mock data
  const fetchCrowdfundingProjects = async () => {
    setLoading(true);
    try {
      console.log('[AdminDashboard] Fetching crowdfunding projects...');
      const response = await fetch(`${API_URL}/api/crowd-funding`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[AdminDashboard] Crowdfunding API response:', data);
      
      // API 데이터를 관리자 페이지 UI에 맞게 변환
      const transformedApiData = data.map(project => ({
        id: project.id,
        name: project.gameName,
        goal: parseFloat(project.goalAmount),
        raised: parseFloat(project.currentAmount),
        participants: project.participantCount || 0,
        startDate: project.createdAt ? project.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        status: parseFloat(project.currentAmount) >= parseFloat(project.goalAmount) ? "goal_reached" : "in_progress",
        finished: project.fundingStatus === 'completed' || false,
        voteStatus: project.voteStatus || "in_progress",
        voteApprovalRate: project.approvalRate || 0,
        endDate: project.endDate,
        fundingProgress: project.fundingProgress
      }));
      
      // API 데이터와 목업 데이터 결합
      const combinedData = [...transformedApiData, ...mockProjects];
      setFundingProjects(combinedData);
    } catch (error) {
      console.error('[AdminDashboard] Failed to fetch crowdfunding projects:', error);
      // 오류 시 목업 데이터만 사용
      setFundingProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  // Load crowdfunding projects on component mount
  useEffect(() => {
    fetchCrowdfundingProjects();
  }, []);


  const handleFinishFunding = async (crowdId, projectName) => {
    if (window.confirm(t('finishConfirm'))) {
      try {
        const result = await CrowdFundingApiService.batchFinish(crowdId);
        
        if (result.status === 'success') {
          setFundingProjects(prev =>
            prev.map(project =>
              project.id === crowdId
                ? { ...project, finished: true, status: 'finished' }
                : project
            )
          );
          alert(t('projectFinished'));
          // 목록 새로고침
          fetchCrowdfundingProjects();
        }
      } catch (error) {
        console.error('Finish funding failed:', error);
        alert(error.message || '프로젝트 완료 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCancelFunding = async (crowdId, projectName) => {
    if (window.confirm(`정말로 "${projectName}" 프로젝트를 취소하시겠습니까?`)) {
      try {
        const result = await CrowdFundingApiService.batchCancel(crowdId);
        
        if (result.status === 'success') {
          setFundingProjects(prev =>
            prev.map(project =>
              project.id === crowdId
                ? { ...project, status: 'cancelled', finished: true }
                : project
            )
          );
          alert('프로젝트가 취소되었습니다.');
          // 목록 새로고침
          fetchCrowdfundingProjects();
        }
      } catch (error) {
        console.error('Cancel funding failed:', error);
        alert(error.message || '프로젝트 취소 처리 중 오류가 발생했습니다.');
      }
    }
  };


  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/bg.png')`,
        }}
      />
      <div className="bg-black/30 fixed inset-0" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t('adminDashboard')}</h1>
        </div>

        {/* Funding Management Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">{t('fundingManagement')}</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
                <p className="text-white/60">{t('loading')}...</p>
              </div>
            </div>
          ) : fundingProjects.length === 0 ? (
            <div className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl">
              <p className="text-white/60 text-lg">No crowdfunding projects available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full backdrop-blur-xl bg-white/10 rounded-3xl overflow-hidden">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-bold">{t('gameName')}</th>
                  <th className="px-6 py-4 text-left text-white font-bold">{t('fundingProgress')}</th>
                  <th className="px-6 py-4 text-left text-white font-bold">{t('participants')}</th>
                  <th className="px-6 py-4 text-left text-white font-bold">{t('votingStatus')}</th>
                  <th className="px-6 py-4 text-left text-white font-bold">{t('fundingStatus')}</th>
                  <th className="px-6 py-4 text-center text-white font-bold">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {fundingProjects.map(project => {
                  const achievementRate = Math.min((project.raised / project.goal) * 100, 100);
                  return (
                  <tr key={project.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{project.name}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/80">${project.raised.toLocaleString()}</span>
                          <span className="text-white/60">/ ${project.goal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                achievementRate >= 100 ? 'bg-green-500' :
                                achievementRate >= 66 ? 'bg-blue-500' :
                                achievementRate >= 33 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${achievementRate}%` }}
                            />
                          </div>
                          <span className="text-white font-medium text-sm">{achievementRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{project.participants}</td>
                    <td className="px-6 py-4">
                      {project.voteStatus === 'passed' ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">{t('voteSuccess')}</span>
                          <span className="text-green-400/60 text-sm">({project.voteApprovalRate}%)</span>
                        </div>
                      ) : project.voteStatus === 'failed' ? (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="text-red-400 font-medium">{t('voteFailed')}</span>
                          <span className="text-red-400/60 text-sm">({project.voteApprovalRate}%)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Vote className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">{t('votingInProgress')}</span>
                          <span className="text-yellow-400/60 text-sm">({project.voteApprovalRate}%)</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {project.raised >= project.goal ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">{t('goalReached')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">{t('goalNotReached')}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {project.finished ? (
                        <span className={`text-sm font-medium ${
                          project.status === 'cancelled' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {project.status === 'cancelled' ? 'Cancelled' : 'Finished'}
                        </span>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleFinishFunding(project.id, project.name)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                          >
                            Finish
                          </button>
                          <button
                            onClick={() => handleCancelFunding(project.id, project.name)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;