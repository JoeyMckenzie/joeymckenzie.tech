import { useEffect, useState } from 'react';

const STORAGE_KEY = 'darkModeEnabled';
const DARK_MODE = 'dark';
const LIGHT_MODE = 'light';

export function useDarkMode(darkModeState = false) {
  const [darkModeEnabled, setDarkModeEnabled] = useState(darkModeState);
  const [htmlClassList, setHtmlClassList] = useState<DOMTokenList | undefined>(
    undefined
  );

  /**
   * On load, apply the current theme if found in local storage
   */
  useEffect(() => {
    const existingPreference = localStorage.getItem(STORAGE_KEY);
    const htmlTag = document.getElementsByTagName('html');
    const classList = htmlTag[0].classList;

    if (existingPreference === DARK_MODE) {
      classList.add(DARK_MODE);
      localStorage.setItem(STORAGE_KEY, DARK_MODE);
      setDarkModeEnabled(true);
    } else {
      classList.remove(DARK_MODE);
      localStorage.setItem(STORAGE_KEY, LIGHT_MODE);
      setDarkModeEnabled(false);
    }

    setHtmlClassList(classList);
  }, []);

  /**
   * On toggle, update the local storage preference
   */
  useEffect(() => {
    if (darkModeEnabled) {
      htmlClassList?.add(DARK_MODE);
      localStorage.setItem(STORAGE_KEY, DARK_MODE);
    } else {
      htmlClassList?.remove(DARK_MODE);
      localStorage.setItem(STORAGE_KEY, LIGHT_MODE);
    }
  }, [darkModeEnabled, htmlClassList]);

  return {
    enabled: darkModeEnabled === true,
    toggleDarkMode: () => setDarkModeEnabled(!darkModeEnabled),
  };
}
