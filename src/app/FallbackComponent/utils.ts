type CustomError = {
    message: string;
    onReset: () => void;
    resetMessage: string;
};

export const createErrorHandler = (error: Error, resetErrorBoundary: () => void): CustomError => {
    const failedImportedError = 'Failed to fetch dynamically imported module';

    const normalizedError = {
        message: error.message || 'Что-то пошло не так',
        onReset: () => resetErrorBoundary(),
        resetMessage: 'Попробовать еще раз',
    };

    if (error.message.includes(failedImportedError)) {
        normalizedError.message = 'Потеряно соединение с сервером';
        normalizedError.onReset = () => {
            if (window.navigator.onLine) {
                window.location.reload();
            } else {
                resetErrorBoundary();
            }
        };
    }

    return normalizedError;
};
