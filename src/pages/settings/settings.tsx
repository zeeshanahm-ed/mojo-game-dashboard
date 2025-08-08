import { useEffect, useState } from 'react';
import { Radio, Checkbox } from 'antd';
import Container from 'components/core-ui/container/container';
import { useHeaderProps } from 'components/core/use-header-props';
import HeaderSection from './components/Header';
import NumericStepper from 'components/core-ui/numaric-stepper/NumericStepper';

interface GameSettings {
  freeGamesEnabled: boolean;
  languages: {
    english: boolean;
    arabic: boolean;
    both: boolean;
  };
}

function Settings() {
  const { setTitle } = useHeaderProps();

  // Game settings state
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    freeGamesEnabled: true,
    languages: {
      english: false,
      arabic: true,
      both: false,
    },
  });

  useEffect(() => {
    setTitle('Settings & Controls');
  }, []);

  // Handle game settings changes
  const handleFreeGamesChange = (value: boolean) => {
    setGameSettings(prev => ({
      ...prev,
      freeGamesEnabled: value
    }));
  };
  const handleLanguageChange = (language: keyof GameSettings['languages']) => {
    setGameSettings(prev => ({
      ...prev,
      languages: {
        english: language === 'english',
        arabic: language === 'arabic',
        both: language === 'both',
      }
    }));
  };

  const handleTimeChange = (seconds: number) => {
    console.log("Updated Time:", seconds);
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <Container>
      <section className='mt-6 font-primary'>

        {/* Free Games Section */}
        <HeaderSection
          title="Free games"
          subtitle="Enable or disable games globally"
        >
          <Radio.Group
            value={gameSettings.freeGamesEnabled}
            onChange={(e) => handleFreeGamesChange(e.target.value)}
            className="flex gap-6"
          >
            <Radio value={true} className="text-xl">Enable</Radio>
            <Radio value={false} className="text-xl">Disable</Radio>
          </Radio.Group>
        </HeaderSection>

        {/* Set Rules for Games Section */}
        <HeaderSection
          title="Set Rules for games"
          subtitle="Enable or disable games globally"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xl">Set time per question</label>
              {/* <TimerSetter initialTime={900} onTimeChange={handleTimeChange} /> */}
              <NumericStepper
                initialValue={900}
                step={1}
                onChange={(value) => handleTimeChange(value)}
                formatter={formatTime}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xl">Max players</label>
              <NumericStepper
                initialValue={2}
                min={1}
                max={10}
                step={1}
                onChange={(value) => console.log("Players:", value)}
                formatter={(v) => `${v} Players`}
              />
            </div>
          </div>
        </HeaderSection>

        {/* Manage Language Section */}
        <HeaderSection
          title="Manage language"
          subtitle="Enable or disable language translation access for users"
        >
          <div className="flex gap-8">
            <Checkbox
              checked={gameSettings.languages.english}
              onChange={() => handleLanguageChange('english')}
              className="text-xl"
            >
              English
            </Checkbox>

            <Checkbox
              checked={gameSettings.languages.arabic}
              onChange={() => handleLanguageChange('arabic')}
              className="text-xl"
            >
              Arabic
            </Checkbox>

            <Checkbox
              checked={gameSettings.languages.both}
              onChange={() => handleLanguageChange('both')}
              className="text-xl"
            >
              Both
            </Checkbox>
          </div>
        </HeaderSection>
      </section>
    </Container>
  );
}

export default Settings;

