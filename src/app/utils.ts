/* eslint-disable no-console */
import type { FC, ComponentType, LazyExoticComponent } from 'react';
import { lazy } from 'react';

export const lazyWithRetries = <T extends ComponentType<unknown>>(
    importer: () => Promise<{ default: FC<unknown> }>,
    moduleName: string,
): LazyExoticComponent<T> => {
    const retryImport = async () => {
        try {
            return await importer();
        } catch (error: unknown) {
            for (let i = 0; i < 1000 * 60 * 60; i++) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (error instanceof Error) {
                    const url = new URL(
                        error.message
                            .replace('Failed to fetch dynamically imported module: ', '')
                            .trim(),
                    );

                    url.searchParams.set('t', `${+new Date()}`);

                    try {
                        // eslint-disable-next-line no-await-in-loop,@typescript-eslint/no-unsafe-return
                        return await import(url.href).then((module) => ({
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                            default: module[moduleName],
                        }));
                    } catch (e) {
                        console.log('retrying import');
                    }
                }
            }

            throw error;
        }
    };

    return lazy(retryImport);
};
