import {useState} from 'react';

/**
 * Custom hook to handle menu page hover effects and text display
 * @param {Object} infoTexts - Object containing text display for each menu item
 * @returns {Object} - Functions and state for menu hover functionality
 */
export const useMenuPage = (infoTexts) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHoverIn = (key) => {
    if (Object.keys(infoTexts).includes(key)) {
      setText(infoTexts[key]);
    } else {
      console.log("Unrecognized key for info_text");
    }
  };

  const handleHoverOut = () => {
    setText("");
  };

  return {
    text,
    loading,
    setLoading,
    handleHoverIn,
    handleHoverOut
  };
};
