import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, route, Context, view } from 'sierra';
import SierraHandlebars from './SierraHandlebars';

describe('route decorator', () => {
    let port = 3005;
    let application: Sierra;
    SierraHandlebars.init({
        viewRoot: './views/'
    });

    before(async () => {
        class TestController extends Controller {
            @route('get')
            async get(context: Context, value: any) {
                return view({ value: true });
            }
        }

        application = new Sierra();
        application.addController(new TestController());
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