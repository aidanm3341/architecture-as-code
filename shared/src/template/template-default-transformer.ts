import {CalmTemplateTransformer} from './types';
import {CalmCoreSchema} from '../types/core-types';
import {Architecture, CalmCore} from '../model/core';

export default class TemplateDefaultTransformer implements CalmTemplateTransformer {

    getTransformedModel(calmJson: string) {
        const calmSchema: CalmCoreSchema = JSON.parse(calmJson);
        const architecture: Architecture = CalmCore.fromJson(calmSchema);
        return {
            'document': architecture
        };

    }

    registerTemplateHelpers(): Record<string, (...args: unknown[]) => unknown> {
        return {
            eq: (...args: unknown[]) => {
                const [a, b] = args;
                return a === b;
            },
            lookup: (...args: unknown[]) => {
                const [obj, key] = args;
                if (typeof obj === 'object' && obj !== null && typeof key === 'string') {
                    return (obj as Record<string, unknown>)[key];
                }
                return undefined;
            },
            json: (...args: unknown[]) => {
                const [obj] = args;
                return JSON.stringify(obj, null, 2);
            },
            instanceOf: (...args: unknown[]) => {
                const [value, className] = args;
                if (typeof className !== 'string') return false;
                return value?.constructor?.name === className;
            },
            kebabToTitleCase: (...args: unknown[]) => {
                const [str] = args;
                if (typeof str !== 'string') return '';
                return str
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            },
            kebabCase: (...args: unknown[]) => {
                const [str] = args;
                if (typeof str !== 'string') return '';
                return str
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric characters with hyphens
                    .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
            },
            isObject: (...args: unknown[]) => {
                const [value] = args;
                return typeof value === 'object' && value !== null && !Array.isArray(value);
            },
            isArray: (...args: unknown[]) => {
                const [value] = args;
                return Array.isArray(value);
            },
            join: (...args: unknown[]) => {
                const [arr, separator = ', '] = args;
                if (!Array.isArray(arr)) return '';
                if (typeof separator !== 'string') return arr.join(', ');
                return arr.join(separator);
            },
        };
    }

}