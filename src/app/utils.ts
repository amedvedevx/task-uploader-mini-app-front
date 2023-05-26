import { lazy } from 'react';

export const lazyWithRetries: typeof lazy = (importer) => {
    const retryImport = async () => {
        try {
            return await importer();
        } catch (error: unknown) {
            for (let i = 0; i < 60; i++) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise((resolve) => setTimeout(resolve, 1000 * i));

                if (error instanceof Error) {
                    const url = new URL(
                        error.message
                            .replace('Failed to fetch dynamically imported module: ', '')
                            .trim(),
                    );

                    url.searchParams.set('t', `${+new Date()}`);

                    try {
                        // eslint-disable-next-line no-await-in-loop,@typescript-eslint/no-unsafe-return
                        return await import(url.href);
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
