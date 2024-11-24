import { useState, useEffect } from 'react';
import { Search, Users, Facebook, Link as LinkIcon, BookOpen, Shield } from 'lucide-react';
import { NoticeDisplay } from '../components/NoticeDisplay';
import { AgentTable } from '../components/AgentTable';
import { Agent } from '../types/agent';
import { db } from '../lib/db';
import toast from 'react-hot-toast';

export const HomePage = () => {
  const [masterAgents, setMasterAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMasterAgents = async () => {
      try {
        setIsLoading(true);
        const agents = await db.getAgents('master-agent');
        const randomAgents = agents
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setMasterAgents(randomAgents);
      } catch (error) {
        console.error('Error fetching master agents:', error);
        toast.error('Failed to load master agents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterAgents();
  }, []);

  const handleView = (agent: Agent) => {
    console.log('View agent:', agent);
  };

  const handleEdit = (agent: Agent) => {
    console.log('Edit agent:', agent);
  };

  const handleDelete = (agent: Agent) => {
    console.log('Delete agent:', agent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search agents by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-black/60 backdrop-blur-sm text-white rounded-lg border border-red-500/30 focus:outline-none focus:border-red-500/50 pl-14 placeholder-gray-400"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500/70" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Notice Display */}
        <div className="mb-12">
          <NoticeDisplay />
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Quick Master Agents Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-lg p-6 h-full border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white">Quick Master Agents</h3>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
                </div>
              ) : (
                <AgentTable
                  agents={masterAgents}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>

          {/* Facebook Community Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-lg p-6 h-full border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg">
                  <Facebook className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white">Join Our Community</h3>
              </div>
              <p className="text-gray-300 mb-6">Join our Facebook community to stay updated with the latest news, updates, and announcements.</p>
              <a
                href="https://facebook.com/groups/magicplay247"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-red-600 hover:to-yellow-600 transition-all duration-300"
              >
                <Facebook className="w-5 h-5 mr-2" />
                Join Facebook Group
              </a>
            </div>
          </div>

          {/* Our Links Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-lg p-6 h-full border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg">
                  <LinkIcon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white">Our Links</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'MagicPlay247.com', url: 'https://magicplay247.com' },
                  { name: 'MagicPlay.info', url: 'https://magicplay.info' },
                  { name: 'MagicPlay247.net', url: 'https://magicplay247.net' }
                ].map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-colors group"
                  >
                    <span className="text-white group-hover:text-red-400 transition-colors">{link.name}</span>
                    <LinkIcon className="w-4 h-4 text-red-500 group-hover:text-yellow-500 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Account Rules Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-lg p-6 h-full border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg">
                  <BookOpen className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white">Account Opening Rules</h3>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Minimum deposit of 500 TK required to open an account
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Valid mobile number and personal information required
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Must be 18 years or older to create an account
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  One account per user policy strictly enforced
                </li>
              </ul>
            </div>
          </div>

          {/* Agent Rules Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-lg p-6 h-full border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white">Agent Type Rules</h3>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Master Agents: Minimum balance 50,000 TK required
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Super Agents: Minimum balance 25,000 TK required
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Regular Agents: Minimum balance 10,000 TK required
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  All agents must maintain active status with regular transactions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};