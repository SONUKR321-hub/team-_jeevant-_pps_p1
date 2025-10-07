import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app_title: 'Kerala Migrant Health',
      register_migrant: 'Register Migrant',
      given_name: 'Given name',
      family_name: 'Family name',
      local_script_name: 'Name (local script)',
      dob: 'Date of birth',
      sex: 'Sex',
      phone: 'Phone',
      language: 'Language',
      origin_state: 'Origin state',
      origin_district: 'Origin district',
      occupation: 'Occupation',
      employer: 'Employer',
      residence_address: 'Residence address',
      latitude: 'Latitude',
      longitude: 'Longitude',
      submit: 'Submit',
      success_registered: 'Registered successfully',
    }
  },
  ml: {
    translation: {
      app_title: 'കേരള പ്രവാസി ആരോഗ്യ സംവിധാനം',
      register_migrant: 'പ്രവാസിയെ രജിസ്റ്റർ ചെയ്യുക',
      given_name: 'പേര്',
      family_name: 'വീട്ടുപേര്',
      local_script_name: 'പേര് (പ്രാദേശിക ലിപി)',
      dob: 'ജനന തീയതി',
      sex: 'ലിംഗം',
      phone: 'ഫോൺ',
      language: 'ഭാഷ',
      origin_state: 'ജന്മസംസ്ഥാനം',
      origin_district: 'ജില്ല',
      occupation: 'തൊഴിൽ',
      employer: 'തൊഴിൽദാതാവ്',
      residence_address: 'താമസ വിലാസം',
      latitude: 'അക്ഷാംശം',
      longitude: 'രേഖാംശം',
      submit: 'സമർപ്പിക്കുക',
      success_registered: 'വിജയകരമായി രജിസ്റ്റർ ചെയ്തു',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
