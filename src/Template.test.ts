import { expect } from 'chai';

import Handlebars from 'handlebars';

import Template from './Template';;

describe('Template', function () {
    it('should render templates', function () {
        let templateText = "1, {{value}}, 3";
        let template = new Template(templateText);

        let result = template.render({ value: 2 });

        expect(result.body).to.equal('1, 2, 3');
    });

    it('should load template files', async function () {
        let template = new Template();
        await template.load('./views/test/simple.handlebars');
        expect(template.delegate).to.not.be.undefined;
    });

    Handlebars.registerHelper('section', function (this: any, name, options) {
        if (!this._sections) {
            this._sections = {};
        }
        this._sections[name] = options.fn(this);
        return null;
    });

    it('should render layout files', function () {
        let templateText = "2{{#section 'sectionData'}}1{{/section}}{{value}}";
        let template = new Template(templateText);

        let layoutText = "{{{_sections.sectionData}}}{{{body}}}";
        let layout = new Template(layoutText);

        let data = { value: 3 };

        let context = Object.assign({}, data);
        let result = template.render(context);

        let fullResult = layout.render(
            Object.assign(
                { body: result.body, },
                result.context,
                context
            ));

        expect(fullResult.body).to.equal('123');
    });
});