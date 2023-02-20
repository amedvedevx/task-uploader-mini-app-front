import { Page, Router } from '@happysanta/router';

export const VIEW_HOME = 'view_home';
export const VIEW_CHAT_SETTINGS = 'view_chat_settings';

export const PANEL_HOME = 'panel_home';
export const PANEL_CHAT_SETTINGS = 'panel_chat_settings';

export const PANEL_BANS_ID = 'panel_bans_id';

export const PAGE_HOME = '/';
export const PAGE_CHAT_SETTINGS = '/chatSettings/:chatId([0-9]+)';
export const PAGE_BANS_ID = '/chatSettings/:chatId([0-9]+)/bans/:userId([0-9]+)';

export const POPOUT_FEEDBACK = 'popout_feedback';

const routes = {
    [PAGE_HOME]: new Page(PANEL_HOME, VIEW_HOME),
    [PAGE_CHAT_SETTINGS]: new Page(PANEL_CHAT_SETTINGS, VIEW_CHAT_SETTINGS),
    [PAGE_BANS_ID]: new Page(PANEL_BANS_ID, VIEW_CHAT_SETTINGS),
};

export const appRouter = new Router(routes);

appRouter.start();
