import { useState } from 'react';
import { DollarSign, Vote, CheckCircle, XCircle, TrendingUp, Users, Calendar, Settings } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const AdminDashboard = () => {
  const { t } = useTranslation();

  // Mock data for funding projects
  const [fundingProjects, setFundingProjects] = useState([
    {
      id: 1,
      name: "Virtual Reality RPG Adventure",
      goal: 100000,
      raised: 100000,
      participants: 234,
      startDate: "2024-01-01",
      status: "goal_reached",
      finished: false,
      voteStatus: "passed",
      voteApprovalRate: 85
    },
    {
      id: 2,
      name: "Blockchain Strategy Game",
      goal: 50000,
      raised: 32000,
      participants: 156,
      startDate: "2024-01-05",
      status: "in_progress",
      finished: false,
      voteStatus: "in_progress",
      voteApprovalRate: 62
    },
    {
      id: 3,
      name: "Space Exploration MMO",
      goal: 75000,
      raised: 80000,
      participants: 312,
      startDate: "2023-12-20",
      status: "goal_reached",
      finished: true,
      voteStatus: "passed",
      voteApprovalRate: 91
    }
  ]);


  const handleFinishFunding = (projectId, projectName) => {
    if (window.confirm(t('finishConfirm'))) {
      setFundingProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? { ...project, finished: true }
            : project
        )
      );
      alert(t('projectFinished'));
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
                        <span className="text-gray-400 text-sm">Finished</span>
                      ) : project.raised >= project.goal && project.voteStatus === 'passed' ? (
                        <button
                          onClick={() => handleFinishFunding(project.id, project.name)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                        >
                          Finish
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-600/50 text-gray-400 px-4 py-2 rounded-xl font-medium cursor-not-allowed"
                        >
                          Finish
                        </button>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;