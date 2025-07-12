import { useState } from 'react';
import { 
  HiOutlineDocumentReport,
  HiOutlineCalendar,
  HiOutlineFilter,
  HiOutlinePrinter,
  HiOutlineShare,
  HiOutlineChartBar,
  HiOutlineTable,
  HiOutlineDocument,
  HiOutlineEye,
  HiChevronDown,
  HiOutlineAdjustments
} from 'react-icons/hi';

interface ReportConfig {
  title: string;
  dateRange: string;
  reportType: string;
  format: string;
  includeCharts: boolean;
  includeTables: boolean;
  includeDetails: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export default function Report() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: 'Aylık Performans Raporu',
    dateRange: 'last30days',
    reportType: 'comprehensive',
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
    includeDetails: false
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const dateRangeOptions: FilterOption[] = [
    { id: 'today', label: 'Bugün', value: 'today' },
    { id: 'last7days', label: 'Son 7 Gün', value: 'last7days' },
    { id: 'last30days', label: 'Son 30 Gün', value: 'last30days' },
    { id: 'last3months', label: 'Son 3 Ay', value: 'last3months' },
    { id: 'custom', label: 'Özel Tarih', value: 'custom' }
  ];

  const reportTypeOptions: FilterOption[] = [
    { id: 'summary', label: 'Özet Rapor', value: 'summary' },
    { id: 'detailed', label: 'Detaylı Rapor', value: 'detailed' },
    { id: 'comprehensive', label: 'Kapsamlı Rapor', value: 'comprehensive' },
    { id: 'financial', label: 'Finansal Rapor', value: 'financial' }
  ];

  const formatOptions: FilterOption[] = [
    { id: 'pdf', label: 'PDF', value: 'pdf' },
    { id: 'excel', label: 'Excel', value: 'excel' },
    { id: 'word', label: 'Word', value: 'word' },
    { id: 'html', label: 'HTML', value: 'html' }
  ];

  const handleInputChange = (field: keyof ReportConfig, value: string | boolean) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulated progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsGenerating(false);
            setProgress(0);
            alert('Rapor başarıyla oluşturuldu!');
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl p-8 border border-gray-800/50 backdrop-blur-sm max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-2xl shadow-xl border border-gray-600/30 p-8 mb-8 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center mb-6 relative z-10">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4 animate-pulse">
              <HiOutlineDocumentReport className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text ">
                Rapor Oluşturma
              </h1>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed relative z-10">
            İhtiyacınıza uygun raporu oluşturmak için aşağıdaki ayarları yapılandırın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Panel - Ayarlar */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl shadow-xl border border-gray-600/30 p-8 backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
              <h2 className="text-xl font-bold text-white mb-8 flex items-center">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg mr-3 animate-pulse">
                  <HiOutlineAdjustments className="w-5 h-5 text-white" />
                </div>
                Rapor Ayarları
              </h2>

              <div className="space-y-8">
                {/* Rapor Başlığı */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                    Rapor Başlığı
                  </label>
                  <input
                    type="text"
                    value={reportConfig.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-700/50"
                    placeholder="Rapor başlığını girin"
                  />
                </div>

                {/* Tarih Aralığı */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                    <HiOutlineCalendar className="w-4 h-4 inline mr-2" />
                    Tarih Aralığı
                  </label>
                  <div className="relative">
                    <select
                      value={reportConfig.dateRange}
                      onChange={(e) => handleInputChange('dateRange', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none backdrop-blur-sm transition-all duration-300 hover:bg-gray-700/50"
                    >
                      {dateRangeOptions.map(option => (
                        <option key={option.id} value={option.value} className="bg-gray-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:text-white transition-colors duration-200" />
                  </div>
                </div>

                {/* Rapor Türü */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                    <HiOutlineFilter className="w-4 h-4 inline mr-2" />
                    Rapor Türü
                  </label>
                  <div className="relative">
                    <select
                      value={reportConfig.reportType}
                      onChange={(e) => handleInputChange('reportType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none backdrop-blur-sm transition-all duration-300 hover:bg-gray-700/50"
                    >
                      {reportTypeOptions.map(option => (
                        <option key={option.id} value={option.value} className="bg-gray-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:text-white transition-colors duration-200" />
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-4">
                    Çıktı Formatı
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {formatOptions.map(option => (
                      <label key={option.id} className="group cursor-pointer">
                        <div className={`flex items-center p-4 border-2 rounded-xl transition-all duration-300 ${
                          reportConfig.format === option.value 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-600/50 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/30'
                        }`}>
                          <input
                            type="radio"
                            name="format"
                            value={option.value}
                            checked={reportConfig.format === option.value}
                            onChange={(e) => handleInputChange('format', e.target.value)}
                            className="sr-only"
                          />
                          <span className={`text-sm font-medium transition-colors duration-300 ${
                            reportConfig.format === option.value ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* İçerik Seçenekleri */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-4">
                    Raporda Bulunacak İçerikler
                  </label>
                  <div className="space-y-4">
                    {[
                      { key: 'includeCharts', icon: HiOutlineChartBar, label: 'Grafikler ve Çizelgeler' },
                      { key: 'includeTables', icon: HiOutlineTable, label: 'Veri Tabloları' },
                      { key: 'includeDetails', icon: HiOutlineDocument, label: 'Detaylı Açıklamalar' }
                    ].map(({ key, icon: Icon, label }) => (
                      <label key={key} className="group cursor-pointer">
                        <div className={`flex items-center p-4 border-2 rounded-xl transition-all duration-300 ${
                          reportConfig[key as keyof ReportConfig] 
                            ? 'border-green-500 bg-green-500/10' 
                            : 'border-gray-600/50 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/30'
                        }`}>
                          <input
                            type="checkbox"
                            checked={reportConfig[key as keyof ReportConfig] as boolean}
                            onChange={(e) => handleInputChange(key as keyof ReportConfig, e.target.checked)}
                            className="sr-only"
                          />
                          <Icon className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                            reportConfig[key as keyof ReportConfig] ? 'text-green-400' : 'text-gray-400 group-hover:text-white'
                          }`} />
                          <span className={`text-sm font-medium transition-colors duration-300 ${
                            reportConfig[key as keyof ReportConfig] ? 'text-green-400' : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Panel - Önizleme ve İşlemler */}
          <div className="lg:col-span-1 space-y-6">
            {/* Önizleme */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl shadow-xl border border-gray-600/30 p-6 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3 animate-pulse">
                  <HiOutlineEye className="w-5 h-5 text-white" />
                </div>
                Önizleme
              </h3>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-gray-600/30">
                <h4 className="font-bold text-white text-lg mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                  {reportConfig.title}
                </h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p><span className="text-gray-400">Tarih:</span> {dateRangeOptions.find(opt => opt.value === reportConfig.dateRange)?.label}</p>
                  <p><span className="text-gray-400">Tür:</span> {reportTypeOptions.find(opt => opt.value === reportConfig.reportType)?.label}</p>
                  <p><span className="text-gray-400">Format:</span> {reportConfig.format.toUpperCase()}</p>
                </div>
              </div>

              <div className="text-sm text-gray-300">
                <p className="mb-3 font-semibold text-white">İçerik:</p>
                <ul className="space-y-2">
                  {reportConfig.includeCharts && <li className="flex items-center text-green-400"><span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>Grafikler</li>}
                  {reportConfig.includeTables && <li className="flex items-center text-blue-400"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>Tablolar</li>}
                  {reportConfig.includeDetails && <li className="flex items-center text-purple-400"><span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>Detaylar</li>}
                </ul>
              </div>
            </div>

            {/* İşlem Butonları */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl shadow-xl border border-gray-600/30 p-6 backdrop-blur-sm">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-bold mb-4 transition-all duration-300 transform hover:scale-105 ${
                  isGenerating 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl'
                }`}
              >
                <HiOutlineDocumentReport className="w-6 h-6 mr-3" />
                {isGenerating ? 'Oluşturuluyor...' : 'Rapor Oluştur'}
              </button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mb-4">
                  <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">{Math.round(progress)}% tamamlandı</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 text-sm font-medium transform hover:scale-105">
                  <HiOutlinePrinter className="w-4 h-4 mr-2" />
                  Yazdır
                </button>
                
                <button className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 text-sm font-medium transform hover:scale-105">
                  <HiOutlineShare className="w-4 h-4 mr-2" />
                  Paylaş
                </button>
              </div>
            </div>

            {/* Bilgi Kutusu */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 border border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg animate-pulse">
                    <HiOutlineDocumentReport className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-bold text-white mb-2">Rapor Hakkında</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Oluşturulan rapor seçtiğiniz kriterlere göre otomatik olarak hazırlanacaktır. 
                    Rapor oluşturma süreci birkaç dakika sürebilir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}