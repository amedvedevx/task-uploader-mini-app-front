import { Page, Router } from '@happysanta/router';

export const VIEW_CREATE = 'view_create';
export const VIEW_CHAT_SETTINGS = 'view_chat_settings';

export const PANEL_COLLECTION_HOME = 'panel_collection_home';
export const PANEL_CREATE_COLLECTION = 'panel_create_collection';
export const PANEL_COLLECTION_ID = 'panel_collection_id';
export const PANEL_COLLECTION_LIST = 'panel_collection_list';

export const PAGE_COLLECTION_HOME = '/';
export const PAGE_CREATE_COLLECTION = '/collection';
export const PAGE_COLLECTION_ID = '/create/:collectionId([0-9]+)';
export const PAGE_COLLECTION_LIST = '/collection/list';

export const POPOUT_FEEDBACK = 'popout_feedback';

const routes = {
    [PAGE_COLLECTION_HOME]: new Page(PANEL_COLLECTION_HOME, VIEW_CREATE),
    [PAGE_CREATE_COLLECTION]: new Page(PANEL_CREATE_COLLECTION, VIEW_CREATE),
    [PAGE_COLLECTION_ID]: new Page(PANEL_COLLECTION_ID, VIEW_CREATE),
    [PAGE_COLLECTION_LIST]: new Page(PANEL_COLLECTION_LIST, VIEW_CREATE),
};

export const appRouter = new Router(routes);

appRouter.start();
