import * as fs from 'fs';

import * as Handlebars from 'handlebars';

interface IHelpersHash {
    [index: string]: Handlebars.HelperDelegate;
}

export interface IConfig {
    viewRoot?: string;
    defaultLayout?: string;
    helpers?: IHelpersHash
}

export default class Template<T> {
    fileName?: string;
    delegate?: HandlebarsTemplateDelegate;

    constructor(templateText?: string) {
        if (templateText) {
            this.create(templateText);
        }
    }

    render(data: T, options?: Handlebars.RuntimeOptions) {
        if (!this.delegate) {
            throw 'Template is not initialized';
        }
        let contextValues: {
            [index: string]: any;
            _layout?: string | false;
        } = {};
        let context = Object.assign(contextValues, data);
        let body = this.delegate(context, options);
        return {
            context,
            body
        };
    }

    async load(fileName: string) {
        this.fileName = fileName;
        let templateText = await Template.loadFile(fileName);
        return this.create(templateText);
    }

    create(templateText: string) {
        let delegate = Template.createDelegate(templateText);
        this.delegate = delegate;
        return delegate;
    }

    static async loadFile(fileName: string) {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(fileName, {
                encoding: 'utf8'
            }, (err, data: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    static createDelegate(templateText: string) {
        return Handlebars.compile(templateText);
    }
}