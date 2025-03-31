import React from 'react';
import {useTranslation} from 'react-i18next';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="ua">ua</option>
      <option value="en">en</option>
    </select>
  );
};
