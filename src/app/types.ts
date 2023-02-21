import type { Pages } from '@/app/router';

export interface TabbarSwitchProps {
    activeStory: string;
    setActiveStory: (story: Pages) => void;
}
