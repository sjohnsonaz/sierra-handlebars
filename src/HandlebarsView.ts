import * as fs from 'fs';
import * as path from 'path';

import Handlebars from 'handlebars';

import { Context } from 'sierra';

interface IHelpersHash {
    [index: string]: Handlebars.HelperDelegate;
}

export interface IConfig {
    viewRoot?: string;
    defaultLayout?: string;
    helpers?: IHelpersHash
}

export default class HandlebarsView {
    static handlebars: typeof Handlebars;
    static viewRoot: string = ''
    static defaultLayout: string;

    static init(config: IConfig = {}) {
        this.handlebars = Handlebars;
        this.viewRoot = config.viewRoot || '';
        this.defaultLayout = config.defaultLayout || '';
        if (config.helpers) {
            this.registerHelpers(config.helpers);
        }
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

    static async handle(_context: Context, data: any, template?: string) {
        let compiledTemplate = await HandlebarsView.getTemplate(template);
        return compiledTemplate(data);
    }

    static createTemplate(templateText: string) {
        return Handlebars.compile(templateText);
    }

    static async getTemplate(template?: string) {
        let templateFile = path.join(HandlebarsView.viewRoot, template || '') + '.handlebars';
        var templateText = await new Promise<string>((resolve, reject) => {
            fs.readFile(templateFile, {
                encoding: 'utf8'
            }, (err, data: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        return this.createTemplate(templateText);
    }
}