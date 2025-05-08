import React from 'react';
import { Archive, Users, Settings, Search, Bell, QrCode, Plus, Sun, Moon, Upload, X, Download, Eye, Trash2, Filter, ArrowUpDown, FileArchive } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguageStore } from './store/languageStore';
import { translations } from './translations';

// Mock data for archives and notifications
const mockArchives = [
  {
    id: 1,
    title: 'Financial Report 2024',
    type: 'PDF',
    author: 'John Doe',
    date: '2024-03-15',
    size: '2.5 MB',
    status: 'active',
  },
  {
    id: 2,
    title: 'Meeting Minutes',
    type: 'DOC',
    author: 'Jane Smith',
    date: '2024-03-14',
    size: '1.2 MB',
    status: 'archived',
  },
];

const mockNotifications = [
  {
    id: 1,
    title: 'Financial Report 2024',
    author: 'John Doe',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'new_archive',
  },
  {
    id: 2,
    title: 'Meeting Minutes',
    author: 'Jane Smith',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    type: 'new_archive',
  },
];

function App() {
  const [isDark, setIsDark] = React.useState(true);
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [showAddArchive, setShowAddArchive] = React.useState(false);
  const [selectedArchive, setSelectedArchive] = React.useState(null);
  const [filterType, setFilterType] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('date');
  const [sortOrder, setSortOrder] = React.useState('descending');
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [selectedArchives, setSelectedArchives] = React.useState([]);
  const [showExportProgress, setShowExportProgress] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);
  const [newArchive, setNewArchive] = React.useState({
    title: '',
    description: '',
    category: '',
    recipients: '',
    file: null
  });
  const [qrCodeData, setQrCodeData] = React.useState('');
  const [showQrCode, setShowQrCode] = React.useState(false);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');

  const handleView = (archive) => {
    setSelectedArchive(archive);
  };

  const handleDownload = (archive) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = archive.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (archive) => {
    if (window.confirm(t.confirmDelete)) {
      console.log('Deleting archive:', archive);
    }
  };

  const handleExport = async () => {
    if (selectedArchives.length === 0) {
      alert(t.selectArchivesToExport);
      return;
    }

    setShowExportProgress(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress(i);
    }

    // Simulate download of zip file
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'archives.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportProgress(false);
    setSelectedArchives([]);
  };

  const handleArchiveSelection = (archive) => {
    setSelectedArchives(prev => {
      const isSelected = prev.find(a => a.id === archive.id);
      if (isSelected) {
        return prev.filter(a => a.id !== archive.id);
      }
      return [...prev, archive];
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewArchive(prev => ({ ...prev, file }));
  };

  const generateQrCode = (archiveData) => {
    const qrData = `archive:${archiveData.title}-${Date.now()}`;
    setQrCodeData(qrData);
    setShowQrCode(true);
  };

  const handleSubmitArchive = (e) => {
    e.preventDefault();
    
    const archiveData = {
      ...newArchive,
      id: Date.now(),
      date: new Date().toISOString(),
      type: newArchive.file?.type || 'Unknown',
      size: newArchive.file?.size ? `${(newArchive.file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
      author: 'Current User'
    };

    console.log('Submitting new archive:', archiveData);
    generateQrCode(archiveData);
  };

  const renderExportProgress = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full p-6`}>
        <h3 className="text-xl font-semibold mb-4">{t.exportingArchives}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${exportProgress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-center">{exportProgress}%</p>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div 
      className={`absolute right-0 top-full mt-2 w-80 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-lg overflow-hidden z-50`}
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">{t.notifications}</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 border-b ${
              isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'
            } cursor-pointer`}
            onClick={() => {
              const archive = mockArchives.find(a => a.title === notification.title);
              if (archive) {
                setSelectedArchive(archive);
                setShowNotifications(false);
              }
            }}
          >
            <p className="font-medium">{notification.title}</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t.addedBy} {notification.author}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(notification.date).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQrCodeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{t.qrCodeTitle}</h3>
          <button
            onClick={() => {
              setShowQrCode(false);
              setShowAddArchive(false);
              setNewArchive({
                title: '',
                description: '',
                category: '',
                recipients: '',
                file: null
              });
            }}
            className="p-1 rounded-lg hover:bg-opacity-20 hover:bg-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <QRCodeSVG value={qrCodeData} size={200} />
          <p className="mt-4 text-center text-sm text-gray-500">{t.scanToAccess}</p>
        </div>
      </div>
    </div>
  );

  const filteredArchives = mockArchives
    .filter(archive => filterType === 'all' || archive.type.toLowerCase() === filterType.toLowerCase())
    .sort((a, b) => {
      const order = sortOrder === 'ascending' ? 1 : -1;
      if (sortBy === 'date') {
        return order * (new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return order * (a[sortBy].localeCompare(b[sortBy]));
    });

  const renderAddArchiveModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{t.addNewArchive}</h3>
          <button
            onClick={() => setShowAddArchive(false)}
            className="p-1 rounded-lg hover:bg-opacity-20 hover:bg-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmitArchive}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.archiveTitle}</label>
              <input
                type="text"
                value={newArchive.title}
                onChange={(e) => setNewArchive(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full p-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.description}</label>
              <textarea
                value={newArchive.description}
                onChange={(e) => setNewArchive(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full p-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.category}</label>
              <input
                type="text"
                value={newArchive.category}
                onChange={(e) => setNewArchive(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full p-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.recipients}</label>
              <input
                type="text"
                value={newArchive.recipients}
                onChange={(e) => setNewArchive(prev => ({ ...prev, recipients: e.target.value }))}
                className={`w-full p-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="email@example.com, email2@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.archiveFile}</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDark ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="archive-file"
                />
                <label htmlFor="archive-file" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">{t.dragAndDrop}</p>
                  <p className="text-sm text-gray-500">{t.or}</p>
                  <button type="button" className="text-blue-500 hover:text-blue-600">
                    {t.browse}
                  </button>
                </label>
                {newArchive.file && (
                  <p className="mt-2 text-sm text-gray-500">
                    {t.selectedFile}: {newArchive.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddArchive(false)}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
          <h3 className="text-lg font-semibold mb-2">{t.totalArchives}</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
          <h3 className="text-lg font-semibold mb-2">{t.recentUploads}</h3>
          <p className="text-3xl font-bold">56</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
          <h3 className="text-lg font-semibold mb-2">{t.activeUsers}</h3>
          <p className="text-3xl font-bold">89</p>
        </div>
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <h2 className="text-xl font-semibold mb-4">{t.recentActivity}</h2>
        <div className="space-y-4">
          {mockNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.addedBy} {notification.author}
                  </p>
                </div>
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(notification.date).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderArchiveList = () => (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`appearance-none pl-3 pr-8 py-2 rounded-lg ${
                isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
              } border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none`}
            >
              <option value="all">{t.all}</option>
              <option value="pdf">PDF</option>
              <option value="doc">DOC</option>
            </select>
            <Filter className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`appearance-none pl-3 pr-8 py-2 rounded-lg ${
                isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
              } border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none`}
            >
              <option value="date">{t.date}</option>
              <option value="type">{t.type}</option>
              <option value="author">{t.author}</option>
            </select>
            <ArrowUpDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending')}
            className={`px-3 py-2 rounded-lg ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {t[sortOrder]}
          </button>
        </div>
        <button
          onClick={handleExport}
          className={`flex items-center px-4 py-2 rounded-lg ${
            selectedArchives.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : isDark
              ? 'bg-gray-700 text-gray-400'
              : 'bg-gray-200 text-gray-500'
          }`}
          disabled={selectedArchives.length === 0}
        >
          <FileArchive className="h-5 w-5 mr-2" />
          {t.exportSelected}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="w-8 py-3 px-4">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedArchives(filteredArchives);
                    } else {
                      setSelectedArchives([]);
                    }
                  }}
                  checked={selectedArchives.length === filteredArchives.length}
                  className="rounded"
                />
              </th>
              <th className="text-left py-3 px-4">{t.archiveTitle}</th>
              <th className="text-left py-3 px-4">{t.type}</th>
              <th className="text-left py-3 px-4">{t.author}</th>
              <th className="text-left py-3 px-4">{t.date}</th>
              <th className="text-left py-3 px-4">{t.fileSize}</th>
              <th className="text-right py-3 px-4">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredArchives.map((archive) => (
              <tr
                key={archive.id}
                className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-50 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedArchives.some(a => a.id === archive.id)}
                    onChange={() => handleArchiveSelection(archive)}
                    className="rounded"
                  />
                </td>
                <td className="py-4 px-4">{archive.title}</td>
                <td className="py-4 px-4">{archive.type}</td>
                <td className="py-4 px-4">{archive.author}</td>
                <td className="py-4 px-4">{new Date(archive.date).toLocaleDateString()}</td>
                <td className="py-4 px-4">{archive.size}</td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleView(archive)}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-500 hover:bg-opacity-20"
                      title={t.view}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(archive)}
                      className="p-2 rounded-lg text-green-500 hover:bg-green-500 hover:bg-opacity-20"
                      title={t.download}
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(archive)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-500 hover:bg-opacity-20"
                      title={t.delete}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedArchive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{selectedArchive.title}</h3>
              <button
                onClick={() => setSelectedArchive(null)}
                className="p-1 rounded-lg hover:bg-opacity-20 hover:bg-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center`}>
              <p className="text-gray-500">{t.noPreview}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleDownload(selectedArchive)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="h-5 w-5 mr-2" />
                {t.download}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex">
        <div className={`w-64 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="p-6">
            <h1 className="text-xl font-bold">{t.title}</h1>
          </div>
          <nav className="mt-6">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center px-6 py-3 ${
                currentView === 'dashboard' 
                  ? isDark ? 'bg-gray-700' : 'bg-gray-200'
                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Archive className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('archives')}
              className={`w-full flex items-center px-6 py-3 ${
                currentView === 'archives' 
                  ? isDark ? 'bg-gray-700' : 'bg-gray-200'
                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Archive className="h-5 w-5 mr-3" />
              {t.archives}
            </button>
            <button 
              onClick={() => setCurrentView('users')}
              className={`w-full flex items-center px-6 py-3 ${
                currentView === 'users' 
                  ? isDark ? 'bg-gray-700' : 'bg-gray-200'
                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              {t.users}
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center px-6 py-3 ${
                currentView === 'settings' 
                  ? isDark ? 'bg-gray-700' : 'bg-gray-200'
                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              {t.settings}
            </button>
          </nav>
        </div>

        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-2 flex-1 mr-4`}>
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className={`flex-1 outline-none ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={toggleLanguage}
                className={`px-3 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {language.toUpperCase()}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {mockNotifications.length}
                  </span>
                </button>
                {showNotifications && renderNotifications()}
              
              </div>
              <button 
                onClick={() => setShowAddArchive(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t.addArchive}
              </button>
            </div>
          </div>

          {currentView === 'archives' ? renderArchiveList() : renderDashboard()}

          {showAddArchive && renderAddArchiveModal()}
          {showQrCode && renderQrCodeModal()}
          {showExportProgress && renderExportProgress()}
        </div>
      </div>
    </div>
  );
}

export default App;