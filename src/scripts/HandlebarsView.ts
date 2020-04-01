import * as fs from 'fs';
import * as path from 'path';

import Handlebars from 'handlebars';

import { Context } from 'sierra';

interface IHelpersHash {
    [index: string]: Handlebars.HelperDelegate;
}

export default class HandlebarsView {
    static handlebars: typeof Handlebars;
    static viewRoot: string = ''
    static defaultLayout: string;

    static init(config: {
        viewRoot?: string;
        defaultLayout?: string;
        helpers?: IHelpersHash
    } = {}) {
        this.viewRoot = config.viewRoot || '';
        this.defaultLayout = config.defaultLayout || '';
        if (typeof config.helpers === 'object') {
            Object.keys(config.helpers).forEach(key => Handlebars.registerHelper(key, (config.helpers as IHelpersHash)[key]));
        }
    }

    static async handle(context: Context, data: any, template?: string) {
        let templateFile = path.join(HandlebarsView.viewRoot, template || '') + '.handlebars';
        var templateText = await new Promise((resolve, reject) => {
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
        var compiledTemplate = Handlebars.compile(templateText);
        return compiledTemplate(data);
    }
}