import type { FC } from 'react';
import { ButtonGroup, Spacing, Separator } from '@vkontakte/vkui';

import type { TabType } from '@/pages';

import { DownloadAllFiles } from './components/DownloadAllFiles';
import { AddTestees, CopyUploadLink, RemindAll } from './components';

interface HeaderButtonsProps {
    isTaskClosed: boolean;
    collectionId: string;
    setSnackbarText: (arg: string) => void;
    selectedTab: TabType;
    taskUnlimitedUsers: boolean;
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
    isTaskClosed,
    collectionId,
    setSnackbarText,
    selectedTab,
    taskUnlimitedUsers,
}) => (
    <>
        <ButtonGroup
            stretched
            mode='vertical'
            gap='s'
        >
            {taskUnlimitedUsers ? (
                <>
                    {!isTaskClosed && (
                        <CopyUploadLink
                            isTaskClosed={isTaskClosed}
                            setSnackbarText={setSnackbarText}
                            collectionId={collectionId}
                        />
                    )}

                    <DownloadAllFiles collectionId={collectionId} />
                </>
            ) : (
                <>
                    {selectedTab === 'completed' ? (
                        <DownloadAllFiles collectionId={collectionId} />
                    ) : (
                        <>
                            <AddTestees />

                            <CopyUploadLink
                                isTaskClosed={isTaskClosed}
                                setSnackbarText={setSnackbarText}
                                collectionId={collectionId}
                            />

                            <RemindAll />
                        </>
                    )}
                </>
            )}
        </ButtonGroup>

        <Spacing size={36}>
            <Separator />
        </Spacing>
    </>
);
