import * as request from 'supertest';
import Sierra, { Controller, route, Context, view } from 'sierra';

import SierraHandlebars from './SierraHandlebars';

describe('route decorator', () => {
    let application: Sierra;
    SierraHandlebars.init({
        viewRoot: './views/'
    });

    beforeEach(async () => {
        application = new Sierra();
        application.view(SierraHandlebars.handle);
    });

    it('should generate get routes', async () => {
        class TestController extends Controller {
            @route('get')
            async get(context: Context, value: any) {
                return view({ value: true });
            }
        }
        application.addController(new TestController());
        application.init();

        await request(application.createServer())
            .get('/test')
            .expect(200);
    });
});
