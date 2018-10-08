import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, middleware, route, Context, view } from 'sierra';
import { wait } from '../scripts/utils/TestUtil';
import SierraHandlebars from '../scripts/SierraHandlebars';

describe('route decorator`', () => {
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
        SierraHandlebars.viewRoot = './views/';
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