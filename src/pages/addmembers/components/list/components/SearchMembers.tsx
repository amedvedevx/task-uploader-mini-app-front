import type { FC } from 'react';
import { Group, List } from '@vkontakte/vkui';

import type { GetTesteesResponse } from '@/app/types';
import type { UseMembersSelectionResult } from '@/pages/hooks';
import { Profiles } from '@/pages/addmembers/components/list/components/Profiles';

import { Members } from './Members';

interface SearchMembersProps {
    selection?: UseMembersSelectionResult;
    collection?: GetTesteesResponse;
}

export const SearchMembers: FC<SearchMembersProps> = ({ collection, selection }) => (
    <>
        {collection && collection?.profiles.length > 0 && (
            <Group
                mode='plain'
                padding='s'
            >
                <List data-automation-id='addMembers-page-membersList'>
                    {collection?.items &&
                        collection?.items?.map((chat) => (
                            <Members
                                key={chat.peer.id}
                                chat={chat}
                                selection={selection}
                            />
                        ))}

                    {collection?.profiles &&
                        collection.profiles?.map((member) => (
                            <Profiles
                                key={member.id}
                                member={member}
                                selection={selection}
                            />
                        ))}
                </List>
            </Group>
        )}
    </>
);
