import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import useThemeStore from './store/useThemeStore';
import AppRoutes from './router/AppRoutes';
import './locales/i18n';

const App = () => {
  const { darkMode, direction, language } = useThemeStore();
  const { i18n } = useTranslation();

  // Sync language with i18next
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction, i18n]);

  return (
    <ConfigProvider
      direction={direction}
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily: 'Inter, Noto Kufi Arabic, sans-serif',
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
};

export default App;
