import * as fs from 'fs';
import * as path from 'path';

import * as Handlebars from 'handlebars';

import { Context } from 'sierra';
import Template from './Template';

export interface IHelpersHash {
    [index: string]: Handlebars.HelperDelegate;
}

export interface IConfig {
    viewRoot?: string;
    defaultLayout?: string;
    cacheTemplates?: boolean;
    helpers?: IHelpersHash
}

export default class Renderer {
    viewRoot?: string;
    defaultLayout?: string;
    cacheTemplates?: boolean;
    cache: {
        [templateName: string]: Template<any>;
    } = {};

    constructor(config?: IConfig) {
        if (config) {
            this.viewRoot = config.viewRoot;
            this.defaultLayout = config.defaultLayout;
            this.cacheTemplates = config.cacheTemplates;
            if (config.helpers) {
                Renderer.registerHelpers(config.helpers);
            }
        }
    }

    async render<T>(
        data: T,
        templateName: string,
        layoutName?: string,
        options?: Handlebars.RuntimeOptions
    ) {
        let template = await this.getTemplate<T>(templateName);
        let result = template.render(data, options);
        if (result.context._layout === false) {
            return result.body;
        }
        layoutName = layoutName || result.context._layout || this.defaultLayout;
        if (layoutName) {
            let layout = await this.getTemplate<T>(layoutName);
            result = layout.render(
                Object.assign({ body: result.body },
                    result.context,
                    options
                ));
        }
        return result.body;
    }

    async getTemplate<T>(templateName: string) {
        if (this.cacheTemplates) {
            let cachedTemplate: Template<T> = this.cache[templateName];
            if (!cachedTemplate) {
                cachedTemplate = await this.loadTemplate<T>(templateName);
                this.cache[templateName] = cachedTemplate;
            }
            return cachedTemplate;
        } else {
            return this.loadTemplate<T>(templateName);
        }
    }

    loadTemplate<T>(templateName: string) {
        let fileName = this.getFileName(templateName);
        return Renderer.loadTemplate<T>(fileName);
    }

    clearCache() {
        this.cache = {};
    }

    private getFileName(templateName: string) {
        return path.join(this.viewRoot || '', templateName) + '.handlebars';
    }

    static async loadTemplate<T>(fileName: string) {
        let template = new Template<T>();
        await template.load(fileName);
        return template;
    }

    static createTemplate<T>(templateText: string) {
        return new Template<T>(templateText);
    }

    static registerHelpers(helpers: IHelpersHash) {
        Object.keys(helpers).forEach(key => {
            let helper = helpers[key];
            this.registerHelper(key, helper)
        });
    }

    static registerHelper(name: string, helper: Handlebars.HelperDelegate) {
        Handlebars.registerHelper(name, helper);
    }
}