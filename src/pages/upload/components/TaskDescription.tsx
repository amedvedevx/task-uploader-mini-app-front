import { Icon20FolderOutline, Icon20Info } from '@vkontakte/icons';
import { Div, MiniInfoCell } from '@vkontakte/vkui';
import type { FC } from 'react';
import styled from 'styled-components';

import { SkeletonDescription } from './SkeletonDescription';

interface TaskDescriptionProps {
    taskName?: string;
    description?: string;
}

export const TaskDescription: FC<TaskDescriptionProps> = ({ taskName, description }) => (
    <DescriptionWrapper>
        {taskName || description ? (
            <>
                <MiniInfoCell
                    before={<Icon20Info />}
                    textWrap='full'
                    mode='base'
                >
                    {taskName}
                </MiniInfoCell>

                {description && (
                    <MiniInfoCell
                        before={<Icon20FolderOutline />}
                        textWrap='full'
                        mode='base'
                    >
                        {description}
                    </MiniInfoCell>
                )}
            </>
        ) : (
            <SkeletonDescription />
        )}
    </DescriptionWrapper>
);

const DescriptionWrapper = styled(Div)`
    padding: 12px 5px 0px 5px;
`;
