import type { FC } from 'react';
import { Avatar, calcInitialsAvatarColor, Cell } from '@vkontakte/vkui';
import styled from 'styled-components';

import { avatarStub } from '@/pages/addmembers/components';
import { inclinationWord } from '@/lib';
import type { ChatType } from '@/app/types';
import type { UseMembersSelectionResult } from '@/pages/hooks';
import { useGetUserIdQuery } from '@/api';

interface MembersProps {
    chat: ChatType;
    selection?: UseMembersSelectionResult;
}

export const Members: FC<MembersProps> = (props) => {
    const { chat, selection } = props;
    const { data: userId } = useGetUserIdQuery();

    const chatMembersCountWithoutBotsAndUser =
        chat?.chat_settings?.active_ids?.filter((item) => item > 0 && item !== userId) || [];

    return (
        <Wrapper
            key={chat.peer.id}
            mode='selectable'
            checked={Boolean(selection?.isChatActive(chat))}
            before={
                <Avatar
                    size={40}
                    src={
                        !chat.chat_settings.photo ? avatarStub : chat.chat_settings.photo.photo_100
                    }
                    alt='icon'
                    gradientColor={calcInitialsAvatarColor(chat.peer.id)}
                />
            }
            subtitle={`${chatMembersCountWithoutBotsAndUser.length}  ${inclinationWord(
                chat.chat_settings.members_count,
                ['участник', 'участника', 'участников'],
            )}`}
            onChange={(e) => {
                selection?.handleSelectChat(e, chat);
            }}
            onClick={(e) => {
                selection?.handleSelectChat(e, chat);
            }}
        >
            {chat.chat_settings.title}
        </Wrapper>
    );
};

export const Wrapper = styled(Cell)`
    margin-bottom: 16px;
`;
