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

import type { TaskResults } from '@/app/types';
import { getInitials } from '@/lib/utils';
import {
    useLazyDownloadFilesQuery,
    useLazyDownloadFilesOnMobileQuery,
    useLazyDownloadSingleFileQuery,
} from '@/api';
import { BridgeDownload } from '@/api/query/bridge';

import { DownloadButton } from './components/DownloadButton';

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

    const onClickHandler = async ({
        vkUserId,
        url,
        title,
        taskId,
        subTaskId,
        docId,
    }: OnClickArgs) => {
        if (isMobilePlatform) {
            if (url && title) {
                await BridgeDownload({ url, fileName: title });
            } else {
                const resultsForUser = taskResults.find(
                    (taskResult) => taskResult.testee.vkUserId === vkUserId,
                );

                if (resultsForUser) {
                    downloadFilesOnMobile(resultsForUser.subTaskResults);
                }
            }
        } else if (docId && title && taskId && subTaskId) {
            downloadSingleFile({ taskId, title, docId, subTaskId, vkUserId });
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
                    taskId,
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
                                            counter={subTaskResults[0].content.length}
                                            onClickHandler={onClickHandler}
                                        />
                                    )
                                }
                            >
                                {fullName}
                            </SimpleCell>
                        </AccordionSummaryWidth>

                        <ListCustomPadding>
                            {subTaskResults[0].content.map(({ title, docId, url }) => (
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
                                            onClick={() =>
                                                onClickHandler({
                                                    vkUserId,
                                                    url,
                                                    title,
                                                    taskId,
                                                    docId,
                                                    subTaskId: subTaskResults[0].subTaskId,
                                                })
                                            }
                                        >
                                            Скачать
                                        </Button>
                                    }
                                >
                                    {title}
                                </SimpleCell>
                            ))}
                        </ListCustomPadding>
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

const ListCustomPadding = styled(List)`
    padding-left: 16px;
    padding-right: 50px;
`;

type OnClickArgs = {
    vkUserId: number;
    url?: string;
    title?: string;
    taskId?: string;
    subTaskId?: string;
    docId?: number;
};
