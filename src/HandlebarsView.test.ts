import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, middleware, route, Context, view } from 'sierra';
import { wait } from './utils/TestUtil';
import SierraHandlebars from './SierraHandlebars';

describe('HandlebarsView', function () {
    SierraHandlebars.init({
        viewRoot: './views/'
    });

    SierraHandlebars.registerHelper('section', function (this: any, name, options) {
        if (!this._sections) {
            this._sections = {};
        }
        this._sections[name] = options.fn(this);
        return null;
    });

    it('should load template files', async function () {
        let template = await SierraHandlebars.getTemplate('test/simple');
        expect(template).to.not.be.undefined;
    });

    it('should render templates', function () {
        let templateText = "1, {{data}}, 3";
        let template = SierraHandlebars.createTemplate(templateText);

        let result = template({ data: 2 });

        expect(result).to.equal('1, 2, 3');
    });

    it('should render layout files', function () {
        let templateText = "2{{#section 'sectionData'}}1{{/section}}{{value}}";
        let template = SierraHandlebars.createTemplate(templateText);

        let layoutText = "{{{_sections.sectionData}}}{{{body}}}";
        let layout = SierraHandlebars.createTemplate(layoutText);

        let data = { value: 3 };

        let context = Object.assign({}, data);
        let body = template(context);

        let fullResult = layout(Object.assign({ body }, context));

        expect(fullResult).to.equal('123');
    });
});

describe('route decorator', () => {
    let port = 3005;
    let application: Sierra;

    before(async () => {
        class TestController extends Controller {
            @route('get')
            async get(context: Context, value: any) {
                return view({ value: true });
            }
        }

        application = new Sierra();
        application.addController(new TestController());
        SierraHandlebars.init({
            viewRoot: './views/'
        });
        application.view(SierraHandlebars.handle);
        application.init();
        await application.listen(port);
    });

    it('should generate get routes', async () => {
        let res = await chai.request('localhost:' + port)
            .get('/test');
        expect(res).to.have.status(200);
    });

    after(async () => {
        await application.close();
    });
});