'use client';
import { useEffect, useState } from 'react';

export default function AgentPage() {
  const [data, setData] = useState([]);
  const [providers, setProviders] = useState([]);
  const [models, setModels] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Fetch and populate data
  useEffect(() => {
    fetch('/stt.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json.stt);
        setProviders(json.stt.map((p) => ({ name: p.name, value: p.value })));

        // Retrieve from localStorage
        const savedProvider = localStorage.getItem('provider');
        const savedModel = localStorage.getItem('model');
        const savedLanguage = localStorage.getItem('language');

        if (savedProvider) {
          setSelectedProvider(savedProvider);
          const providerObj = json.stt.find((p) => p.value === savedProvider);
          if (providerObj) {
            const modelOptions = providerObj.models.map((m) => ({
              name: m.name,
              value: m.value,
            }));
            setModels(modelOptions);

            if (savedModel) {
              setSelectedModel(savedModel);
              const modelObj = providerObj.models.find(
                (m) => m.value === savedModel
              );
              if (modelObj) {
                setLanguages(modelObj.languages);
                if (savedLanguage) {
                  setSelectedLanguage(savedLanguage);
                }
              }
            }
          }
        }
      });
  }, []);

  const handleProviderChange = (e) => {
    const value = e.target.value;
    setSelectedProvider(value);
    localStorage.setItem('provider', value);

    const provider = data.find((p) => p.value === value);
    if (provider) {
      const modelOptions = provider.models.map((m) => ({
        name: m.name,
        value: m.value,
      }));
      setModels(modelOptions);
      setSelectedModel('');
      setLanguages([]);
      setSelectedLanguage('');
    }
  };

  const handleModelChange = (e) => {
    const value = e.target.value;
    setSelectedModel(value);
    localStorage.setItem('model', value);

    const provider = data.find((p) => p.value === selectedProvider);
    if (provider) {
      const model = provider.models.find((m) => m.value === value);
      if (model) {
        setLanguages(model.languages);
        setSelectedLanguage('');
      }
    }
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setSelectedLanguage(value);
    localStorage.setItem('language', value);
  };

  // Save Configuration Function 
  const handleSave = async () => {
    try {
      const response = await fetch('/api/save-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('✅ Configuration saved!');
      } else {
        alert('❌ Failed to save configuration: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Agent Configuration</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-[var(--foreground)]">Select Provider</label>
          <select
            className="w-full p-2 border rounded bg-[var(--card-background)] text-[var(--foreground)] border-[var(--card-border)]"
            value={selectedProvider}
            onChange={handleProviderChange}
          >
            <option value="">Select Provider</option>
            {providers.map((p) => (
              <option key={p.value} value={p.value} className="bg-[var(--card-background)]">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {models.length > 0 && (
          <div>
            <label className="block mb-1 text-[var(--foreground)]">Select Model</label>
            <select
              className="w-full p-2 border rounded bg-[var(--card-background)] text-[var(--foreground)] border-[var(--card-border)]"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m.value} value={m.value} className="bg-[var(--card-background)]">
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <label className="block mb-1 text-[var(--foreground)]">Select Language</label>
            <select
              className="w-full p-2 border rounded bg-[var(--card-background)] text-[var(--foreground)] border-[var(--card-border)]"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="">Select Language</option>
              {languages.map((language) => (
                <option key={language.value} value={language.value} className="bg-[var(--card-background)]">
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={handleSave}
        >
          Save Configuration
        </button>
         {selectedProvider && selectedModel && selectedLanguage && (
          <div className="mt-6 p-4 border rounded shadow bg-[var(--card-background)] border-[var(--card-border)]">
            <h2 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Summary</h2>

            <div className="text-sm text-[var(--foreground)]">
              <p>
                <strong>Provider:</strong> {providers.find(p => p.value === selectedProvider)?.name} ({selectedProvider})
              </p>
              <p>
                <strong>Model:</strong> {models.find(m => m.value === selectedModel)?.name} ({selectedModel})
              </p>
              <p>
                <strong>Language:</strong> {languages.find(l => l.value === selectedLanguage)?.name} ({selectedLanguage})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
