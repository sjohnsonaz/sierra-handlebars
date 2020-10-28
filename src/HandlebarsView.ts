import * as Handlebars from 'handlebars';

import { Context } from 'sierra';
import { IConfig } from './Template';
import Renderer, { IHelpersHash } from './Renderer';

export default class HandlebarsView {
    static handlebars: typeof Handlebars;
    static renderer: Renderer;

    static init(config: IConfig = {}) {
        this.handlebars = Handlebars;
        this.renderer = new Renderer(config);
    }

    static async handle(context: Context, data: any, templateName?: string) {
        return HandlebarsView.renderer.render({ context, data }, templateName || '');
    }

    static setCacheTemplates(cacheTemplates: boolean) {
        this.renderer.cacheTemplates = cacheTemplates;
        if (!cacheTemplates) {
            this.clearCache();
        }
    }

    static getCacheTemplates() {
        return this.renderer.cacheTemplates;
    }

    static clearCache() {
        this.renderer.clearCache();
    }

    static registerHelpers(helpers: IHelpersHash) {
        Renderer.registerHelpers(helpers);
    }

    static registerHelper(name: string, helper: Handlebars.HelperDelegate) {
        Renderer.registerHelper(name, helper);
    }
}