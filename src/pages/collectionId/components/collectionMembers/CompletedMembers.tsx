import type { FC } from 'react';
import { useState } from 'react';
import {
    Accordion,
    Avatar,
    List,
    Platform,
    SimpleCell,
    calcInitialsAvatarColor,
    usePlatform,
} from '@vkontakte/vkui';
import styled from 'styled-components';
import { AccordionSummary } from '@vkontakte/vkui/dist/components/Accordion/AccordionSummary';

import type { TaskDetailResultContent, TaskResults } from '@/app/types';
import { getInitials, isForbiddenFile } from '@/lib/utils';
import {
    useLazyDownloadFilesQuery,
    useLazyDownloadFilesOnMobileQuery,
    useLazyDownloadSingleFileQuery,
} from '@/api';
import { BridgeDownload } from '@/api/query/bridge';
import { Popout } from '@/components';
import { HorizontalFileCell } from '@/components/HorizontalFileCell';
import { HorizontalScroll } from '@/components/HorizontalScroll';

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

    const [popout, setPopout] = useState<JSX.Element | null>(null);

    const platform = usePlatform();
    const isIOSPlatform = platform === Platform.IOS;

    const onClickHandler = async ({ vkUserId, url, title, taskId, docId }: OnClickArgs) => {
        if (isMobilePlatform) {
            if (url && title) {
                await BridgeDownload({ url, fileName: title });
            } else {
                const resultsForUser = taskResults.find(
                    (taskResult) => taskResult.testee.vkUserId === vkUserId,
                );

                if (resultsForUser) {
                    downloadFilesOnMobile(resultsForUser);
                }
            }
        } else if (docId && title && taskId) {
            downloadSingleFile({ taskId, title, docId, vkUserId });
        } else {
            downloadFiles({ taskId: collectionId, vkUserId });
        }
    };

    const handleDownloadFile = (args: OnClickArgs, files?: TaskDetailResultContent[]) => {
        if (isForbiddenFile(String(args.title))) {
            const popoutForbiddenFile = (
                <Popout
                    text='Этот файл может быть потенциально опасным, вы уверены что хотите скачать его?'
                    header='Предупреждение'
                    action={() => {
                        onClickHandler({ ...args });
                    }}
                    actionText='Скачать'
                    setPopout={setPopout}
                />
            );

            setPopout(popoutForbiddenFile);
        } else if (files && files?.some((el) => isForbiddenFile(el.title))) {
            const popoutForbiddenFiles = (
                <Popout
                    text='Этот архив может содержать потенциально опасные файлы, вы уверены что хотите скачать его?'
                    header='Предупреждение'
                    action={() => {
                        onClickHandler({ ...args });
                    }}
                    actionText='Скачать'
                    setPopout={setPopout}
                />
            );

            setPopout(popoutForbiddenFiles);
        } else {
            onClickHandler({ ...args });
        }
    };

    return (
        <>
            <List data-automation-id='collectionId-page-membersList'>
                {taskResults.map(
                    ({
                        testee: { vkUserId, firstName, lastName, fullName, photo },
                        content,
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
                                                counter={content.length}
                                                files={content}
                                                handleDownloadFile={handleDownloadFile}
                                            />
                                        )
                                    }
                                >
                                    {fullName}
                                </SimpleCell>
                            </AccordionSummaryWidth>

                            <HorizontalScroll>
                                {content.map(({ title, docId, url }) => (
                                    <HorizontalFileCell
                                        key={docId}
                                        title={title}
                                        type='download'
                                        onClick={() =>
                                            handleDownloadFile({
                                                vkUserId,
                                                url,
                                                title,
                                                taskId,
                                                docId,
                                            })
                                        }
                                    />
                                ))}
                            </HorizontalScroll>
                        </Accordion>
                    ),
                )}
            </List>

            {popout}
        </>
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
    taskId?: string;
    docId?: number;
};
