/// <reference types="cypress" />
import type React__default from 'react';
import type { MountOptions } from 'cypress/react';

declare namespace Cypress {
    interface Chainable {
        mount<E extends Node = HTMLElement>(
            jsx: React__default.ReactNode,
            options?: MountOptions,
            rerenderKey?: string,
        ): Chainable;
        getByAutomationId<E extends Node = HTMLElement>(id: string): Chainable;
        getByAutomationIdPrefix<E extends Node = HTMLElement>(id: string): Chainable;
    }
}
