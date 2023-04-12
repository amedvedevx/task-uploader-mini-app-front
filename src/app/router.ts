import { Page, Router } from '@happysanta/router';

export const VIEW_CREATE = 'view_create';
export const VIEW_UPLOAD = 'view_upload';

export const PANEL_COLLECTION_HOME = 'panel_collection_home';
export const PANEL_CREATE_COLLECTION = 'panel_create_collection';
export const PANEL_ADD_MEMBERS = 'panel_add_members';
export const PANEL_LIST_MEMBERS = 'panel_list_members';
export const PANEL_COLLECTION_ID = 'panel_collection_id';
export const PANEL_UPLOAD_ID = 'panel_upload_id';

export const PAGE_COLLECTION_HOME = '/';
export const PAGE_CREATE_COLLECTION = '/collection';
export const PAGE_ADD_MEMBERS = '/collection/add-members/:collectionId([0-9a-zA-Z-]+)';
export const PAGE_LIST_MEMBERS = '/collection/list-members/:collectionId([0-9a-zA-Z-]+)';
export const PAGE_COLLECTION_ID = '/collectionId/:collectionId([0-9a-zA-Z-]+)';
export const PAGE_UPLOAD_ID = '/upload/:uploadId([0-9a-zA-Z-]+)';

export const POPOUT_FEEDBACK = 'popout_feedback';

const routes = {
    [PAGE_COLLECTION_HOME]: new Page(PANEL_COLLECTION_HOME, VIEW_CREATE),
    [PAGE_CREATE_COLLECTION]: new Page(PANEL_CREATE_COLLECTION, VIEW_CREATE),
    [PAGE_ADD_MEMBERS]: new Page(PANEL_ADD_MEMBERS, VIEW_CREATE),
    [PAGE_LIST_MEMBERS]: new Page(PANEL_LIST_MEMBERS, VIEW_CREATE),
    [PAGE_COLLECTION_ID]: new Page(PANEL_COLLECTION_ID, VIEW_CREATE),
    [PAGE_UPLOAD_ID]: new Page(PANEL_UPLOAD_ID, VIEW_UPLOAD),
};

export const appRouter = new Router(routes);

appRouter.start();
