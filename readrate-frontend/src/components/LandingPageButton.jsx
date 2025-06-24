import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Button = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register');
  };

  useEffect(() => {
    const setButtonColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const root = document.documentElement;
      root.style.setProperty('--btn-color', isDark ? '#facc15' : '#C74F00'); // kuning vs oren
      root.style.setProperty('--btn-hover-text', isDark ? '#1A202C' : '#fff9ed');
      root.style.setProperty('--btn-shadow', isDark ? 'rgba(250, 204, 21, 0.4)' : 'rgba(194, 65, 12, 0.4)');
    };

    setButtonColor();

    // Opsional: update otomatis saat mode diubah
    const observer = new MutationObserver(setButtonColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <StyledWrapper>
      <button className="button" onClick={handleClick}>
        Start Reading
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    position: relative;
    padding: 10px 24px;
    font-size: 18px;
    color: var(--btn-color);
    border: 2px solid var(--btn-color);
    border-radius: 34px;
    background-color: transparent;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
    overflow: hidden;
  }

  .button::before {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 50px;
    height: 50px;
    border-radius: inherit;
    scale: 0;
    z-index: -1;
    background-color: var(--btn-color);
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .button:hover::before {
    scale: 4;
  }

  .button:hover {
    color: var(--btn-hover-text);
    scale: 1.1;
    box-shadow: 0 0px 20px var(--btn-shadow);
  }

  .button:active {
    scale: 1;
  }
`;

export default Button;
