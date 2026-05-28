import React, { useState } from 'react';
import { GameSettings, PlayerState } from '../types';
import { updateSettings } from '../lib/gameLogic';
import { encryptSaveData, decryptSaveData, initializeGameData } from '../lib/saveSystem';
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
  
  // 获取当前语言的文本
  const getText = (zhText: string, enText: string) => {
    return player.settings.language === 'zh' ? zhText : enText;
  };
  
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
        alert(getText('存档导入成功！注意：导入的存档不计入排行榜。', 'Save imported successfully! Note: Imported saves are not eligible for leaderboards.'));
      } else {
        alert(getText('存档导入失败：无效的存档数据', 'Import failed: Invalid save data'));
      }
    } catch (error) {
      alert(getText('存档导入失败：', 'Import failed: ') + error);
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
      <h3>{getText('选项', 'Options')}</h3>
      
      <div className="options-section">
        <h4>{getText('语言设置', 'Language Settings')}</h4>
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
        <h4>{getText('游戏设置', 'Game Settings')}</h4>
        <div className="options-row">
          <div className="option-label">{getText('自动掷出', 'Auto Roll')}</div>
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
        <h4>{getText('存档管理', 'Save Management')}</h4>
        <div className="options-row">
          <button className="option-button" onClick={onSaveGame}>
            {getText('保存', 'Save')}
          </button>
          <button className="option-button" onClick={onLoadGame}>
            {getText('读取', 'Load')}
          </button>
        </div>
        
        <div className="export-import-section">
          <h4>{getText('导出存档', 'Export Save')}</h4>
          <textarea 
            className="save-textarea" 
            value={exportValue} 
            readOnly 
            placeholder={getText('点击导出按钮生成加密存档字符串', 'Click Export to generate encrypted save string')}
          />
          <button className="option-button" onClick={handleExport}>
            {getText('导出', 'Export')}
          </button>
          
          <h4>{getText('导入存档', 'Import Save')}</h4>
          <textarea 
            className="save-textarea" 
            value={importValue} 
            onChange={(e) => setImportValue(e.target.value)}
            placeholder={getText('粘贴存档字符串到此处', 'Paste save string here')}
          />
          <div className="warning-text">
            {getText('警告：导入的存档不计入排行榜', 'Warning: Imported saves are not eligible for leaderboards')}
          </div>
          <button className="option-button" onClick={handleImport}>
            {getText('导入', 'Import')}
          </button>
        </div>
      </div>
      
      <div className="options-section">
        <h4>{getText('初始化', 'Initialize')}</h4>
        {showConfirmReset ? (
          <div className="confirm-reset">
            <div className="warning-text">
              {getText('确定要格式化本机全部游戏数据吗？此操作不可撤销。', 'Are you sure you want to format all game data? This cannot be undone.')}
            </div>
            <div className="options-row">
              <button className="option-button danger" onClick={handleInitialize}>
                {getText('确认', 'Confirm')}
              </button>
              <button className="option-button" onClick={handleCancelInitialize}>
                {getText('取消', 'Cancel')}
              </button>
            </div>
          </div>
        ) : (
          <button className="option-button danger" onClick={handleInitialize}>
            {getText('初始化游戏数据', 'Initialize Game Data')}
          </button>
        )}
      </div>
      
      <div className="options-section">
        <h4>{getText('游戏信息', 'Game Information')}</h4>
        <div className="game-info">
          <div>{getText('版本', 'Version')}: 1.0.0</div>
          <div>
            {getText('原作者', 'Original Author')}: <a href="https://github.com/Clownier" target="_blank" rel="noopener noreferrer">Clownier</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsTab;
