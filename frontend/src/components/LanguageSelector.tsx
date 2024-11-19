import { Menu, Button } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' }
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // Optionnel : sauvegarder la préférence de langue
    localStorage.setItem('preferred-language', langCode);
  };

  return (
    <Menu position="bottom-end" shadow="md">
      <Menu.Target>
        <Button 
          variant="subtle" 
          color="gray"
          leftSection={<IconLanguage size={20} />}
          className="hover-lift"
        >
          {currentLanguage.name}
        </Button>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          backgroundColor: '#25262B',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {languages.map((lang) => (
          <Menu.Item
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            style={{
              backgroundColor: lang.code === currentLanguage.code ? '#2C2E33' : undefined,
            }}
          >
            {lang.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}