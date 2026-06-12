import React, { useState, useCallback } from 'react';
import { GameSettings, PlayerState } from '../types';
import { VERSION } from '../version';
import { updateSettings } from '../lib/gameLogic';
import { encryptSaveData, decryptSaveData, initializeGameData } from '../lib/saveSystem';
import { t } from '../locales';
import '../styles/OptionsTab.css';

interface OptionsTabProps {
  player: PlayerState;
  onUpdatePlayer: (newState: PlayerState) => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
}

const OptionsTab: React.FC<OptionsTabProps> = ({
  player,
  onUpdatePlayer,
  onSaveGame,
  onLoadGame
}) => {
  const [importValue, setImportValue] = useState('');
  const [exportValue, setExportValue] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const lang = player.settings.language;
  const _t = useCallback((key: string) => t(key, lang), [lang]);
  
  // 切换语言
  const handleLanguageChange = (language: 'zh' | 'en') => {
    const newSettings: Partial<GameSettings> = { language };
    onUpdatePlayer(updateSettings(player, newSettings));
  };
  
  // 切换自动掷出
  const handleAutoRollChange = (autoRoll: boolean) => {
    const newSettings: Partial<GameSettings> = { autoRoll };
    onUpdatePlayer(updateSettings(player, newSettings));
  };
  
  // 导出存档
  const handleExport = () => {
    const encryptedData = encryptSaveData(player);
    setExportValue(encryptedData);
  };
  
  // 导入存档
  const handleImport = () => {
    if (!importValue) return;
    
    try {
      const decryptedData = decryptSaveData(importValue);
      if (decryptedData) {
        onUpdatePlayer(decryptedData);
        onSaveGame();
        setImportValue('');
        alert(_t('save.import-success'));
      } else {
        alert(_t('save.import-failed'));
      }
    } catch (error) {
      alert(_t('save.import-error') + error);
    }
  };
  
  // 初始化游戏数据
  const handleInitialize = () => {
    if (showConfirmReset) {
      initializeGameData();
      window.location.reload();
    } else {
      setShowConfirmReset(true);
    }
  };
  
  // 取消初始化
  const handleCancelInitialize = () => {
    setShowConfirmReset(false);
  };
  
  return (
    <div className="options-content">
      <h3>{_t('options.title')}</h3>
      
      <div className="options-section">
        <h4>{_t('options.language')}</h4>
        <div className="options-row">
          <button 
            className={`language-button ${player.settings.language === 'zh' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('zh')}
          >
            中文
          </button>
          <button 
            className={`language-button ${player.settings.language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
        </div>
      </div>
      
      <div className="options-section">
        <h4>{_t('options.game-settings')}</h4>
        <div className="options-row">
          <div className="option-label">{_t('options.auto-roll')}</div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="autoRollToggle" 
              checked={player.settings.autoRoll}
              onChange={(e) => handleAutoRollChange(e.target.checked)}
            />
            <label htmlFor="autoRollToggle"></label>
          </div>
        </div>
      </div>
      
      <div className="options-section">
        <h4>{_t('options.save-management')}</h4>
        <div className="options-row">
          <button className="option-button" onClick={onSaveGame}>
            {_t('options.save')}
          </button>
          <button className="option-button" onClick={onLoadGame}>
            {_t('options.load')}
          </button>
        </div>
        
        <div className="export-import-section">
          <h4>{_t('options.export-save')}</h4>
          <textarea 
            className="save-textarea" 
            value={exportValue} 
            readOnly 
            placeholder={_t('options.export-placeholder')}
          />
          <button className="option-button" onClick={handleExport}>
            {_t('options.export')}
          </button>
          
          <h4>{_t('options.import-save')}</h4>
          <textarea 
            className="save-textarea" 
            value={importValue} 
            onChange={(e) => setImportValue(e.target.value)}
            placeholder={_t('options.import-placeholder')}
          />
          <div className="warning-text">
            {_t('options.import-warning')}
          </div>
          <button className="option-button" onClick={handleImport}>
            {_t('options.import')}
          </button>
        </div>
      </div>
      
      <div className="options-section">
        <h4>{_t('options.initialize')}</h4>
        {showConfirmReset ? (
          <div className="confirm-reset">
            <div className="warning-text">
              {_t('options.initialize-confirm')}
            </div>
            <div className="options-row">
              <button className="option-button danger" onClick={handleInitialize}>
                {_t('options.confirm')}
              </button>
              <button className="option-button" onClick={handleCancelInitialize}>
                {_t('options.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <button className="option-button danger" onClick={handleInitialize}>
            {_t('options.initialize-data')}
          </button>
        )}
      </div>
      
      <div className="options-section">
        <h4>{_t('options.game-info')}</h4>
        <div className="game-info">
          <div>{_t('options.version')}: {VERSION}</div>
          <div>
            {_t('options.author')}: <a href="https://github.com/Clownier" target="_blank" rel="noopener noreferrer">Clownier</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsTab;
