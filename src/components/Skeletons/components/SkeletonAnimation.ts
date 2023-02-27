import styled from 'styled-components';

export const SkeletonAnimation = styled.div`
    background: linear-gradient(90deg, #BBB7F8 0%, #E4E5F7 97.08%);

    animation: wave 2s infinite ease-out;

    @media all and {
        min-width: 600px;
    }
     {
        background-size: 800px;

        @keyframes wave {
            0% {
                background-position: -400px 0;
            }
            100% {
                background-position: 400px 0;
            }
        }
    }

    @media all and {
        min-width: 1024px;
    }
     {
        background-size: 3000px;

        @keyframes wave {
            0% {
                background-position: -1500px 0;
            }
            100% {
                background-position: 1500px 0;
            }
        }
    }
`;
