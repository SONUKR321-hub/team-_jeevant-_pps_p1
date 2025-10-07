import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationForm } from './RegistrationForm';

export function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState('en');

  const onLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLang(value);
    i18n.changeLanguage(value);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{t('app_title')}</h1>
        <select value={lang} onChange={onLangChange}>
          <option value="en">English</option>
          <option value="ml">Malayalam</option>
        </select>
      </header>
      <main>
        <RegistrationForm />
      </main>
    </div>
  );
}
