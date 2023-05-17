import type { FC } from 'react';
import {
    Accordion,
    Avatar,
    Button,
    List,
    Platform,
    SimpleCell,
    calcInitialsAvatarColor,
    usePlatform,
} from '@vkontakte/vkui';
import styled from 'styled-components';
import { AccordionSummary } from '@vkontakte/vkui/dist/components/Accordion/AccordionSummary';

import type { DownloadFilesProps, TaskResults } from '@/app/types';
import { getInitials } from '@/lib/utils';
import {
    useLazyDownloadFilesQuery,
    useLazyDownloadFilesOnMobileQuery,
    useLazyDownloadSingleFileQuery,
} from '@/api';
import { BridgeDownload } from '@/api/query/bridge';

interface CompletedMembersProps {
    taskResults: TaskResults[];
    collectionId: string;
    isMobilePlatform: boolean;
}

const avatarStub = 'https://vk.com/images/camera_100.png';

export const CompletedMembers: FC<CompletedMembersProps> = ({
    taskResults,
    collectionId,
    isMobilePlatform,
}) => {
    const [downloadFiles, { isLoading: isDownloading, originalArgs }] = useLazyDownloadFilesQuery();
    const [downloadFilesOnMobile] = useLazyDownloadFilesOnMobileQuery();
    const [downloadSingleFile] = useLazyDownloadSingleFileQuery();

    const platform = usePlatform();
    const isIOSPlatform = platform === Platform.IOS;

    const onClickHandler = ({ vkUserId, url, title }: OnClickArgs) => {
        if (isMobilePlatform) {
            if (url && title) {
                BridgeDownload({ url, fileName: title });
            } else {
                const resultsForUser = taskResults.find(
                    (taskResult) => taskResult.testee.vkUserId === vkUserId,
                );

                if (resultsForUser) {
                    downloadFilesOnMobile(resultsForUser.subTaskResults);
                }
            }
        } else if (url && title) {
            downloadSingleFile({ url, title });
        } else {
            downloadFiles({ taskId: collectionId, vkUserId });
        }
    };

    return (
        <List data-automation-id='collectionId-page-membersList'>
            {taskResults.map(
                ({
                    testee: { vkUserId, firstName, lastName, fullName, photo },
                    subTaskResults,
                }) => (
                    <Accordion key={vkUserId}>
                        <AccordionSummaryWidth>
                            <SimpleCell
                                key={vkUserId}
                                disabled
                                before={
                                    <Avatar
                                        size={40}
                                        src={photo === avatarStub ? '#' : photo}
                                        alt='icon'
                                        gradientColor={calcInitialsAvatarColor(vkUserId)}
                                        initials={getInitials(`${firstName} ${lastName}`)}
                                    />
                                }
                                after={
                                    !isIOSPlatform && (
                                        <DownloadButton
                                            originalArgs={originalArgs}
                                            vkUserId={vkUserId}
                                            isDownloading={isDownloading}
                                            fullName={fullName}
                                            onClickHandler={onClickHandler}
                                        />
                                    )
                                }
                            >
                                {fullName}
                            </SimpleCell>
                        </AccordionSummaryWidth>

                        <List>
                            {subTaskResults[0].content.map(({ title, size, uploadDate, url }) => (
                                <SimpleCell
                                    key={title}
                                    after={
                                        <Button
                                            appearance='accent'
                                            size='s'
                                            mode='secondary'
                                            disabled={
                                                originalArgs?.vkUserId === vkUserId && isDownloading
                                            }
                                            loading={
                                                originalArgs?.vkUserId === vkUserId && isDownloading
                                            }
                                            onClick={() => onClickHandler({ vkUserId, url, title })}
                                        >
                                            Скачать
                                        </Button>
                                    }
                                >
                                    {title}
                                </SimpleCell>
                            ))}
                        </List>
                    </Accordion>
                ),
            )}
        </List>
    );
};

const AccordionSummaryWidth = styled(AccordionSummary)`
    .vkuiSimpleCell__children {
        width: 100%;
    }
`;

type OnClickArgs = {
    vkUserId: number;
    url?: string;
    title?: string;
};

interface DownloadButtonProps {
    originalArgs: DownloadFilesProps | undefined;
    vkUserId: number;
    isDownloading: boolean;
    onClickHandler: (arg: { vkUserId: number; fullName: string }) => void;
    fullName: string;
}

const DownloadButton: FC<DownloadButtonProps> = ({
    originalArgs,
    vkUserId,
    isDownloading,
    onClickHandler,
    fullName,
}) => (
    <Button
        appearance='accent'
        size='s'
        mode='secondary'
        disabled={originalArgs?.vkUserId === vkUserId && isDownloading}
        loading={originalArgs?.vkUserId === vkUserId && isDownloading}
        onClick={() => onClickHandler({ vkUserId, fullName })}
    >
        Скачать
    </Button>
);
