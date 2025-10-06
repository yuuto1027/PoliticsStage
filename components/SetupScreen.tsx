import React, { useState, useCallback } from 'react';

interface SetupScreenProps {
  onGameStart: (countryName: string, partyName: string, flagDataUrl: string | null, ideology: string) => void;
  ideologies: string[];
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onGameStart, ideologies }) => {
  const [countryName, setCountryName] = useState('');
  const [partyName, setPartyName] = useState('');
  const [ideology, setIdeology] = useState('中道');
  const [flagPreview, setFlagPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (countryName && partyName) {
      onGameStart(countryName, partyName, flagPreview, ideology);
    }
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setFlagPreview(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-slate-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-300">政治の舞台へ</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-16 bg-slate-700 border-2 border-dashed border-slate-500 flex items-center justify-center">
              {flagPreview ? (
                <img src={flagPreview} alt="国旗プレビュー" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400 text-center">国旗</span>
              )}
            </div>
            <div className="flex-grow">
              <label htmlFor="flag-upload" className="block text-sm font-medium text-slate-300 mb-1">国旗をアップロード</label>
              <input
                id="flag-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>
          <div>
            <label htmlFor="country-name" className="block text-sm font-medium text-slate-300 mb-1">国名</label>
            <input
              id="country-name"
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="party-name" className="block text-sm font-medium text-slate-300 mb-1">政党名</label>
            <input
              id="party-name"
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="ideology" className="block text-sm font-medium text-slate-300 mb-1">政党イデオロギー</label>
            <select
              id="ideology"
              value={ideology}
              onChange={(e) => setIdeology(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ideologies.map(ideo => (
                <option key={ideo} value={ideo}>{ideo}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-500 disabled:cursor-not-allowed"
            disabled={!countryName || !partyName}
          >
            統治を開始する
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
