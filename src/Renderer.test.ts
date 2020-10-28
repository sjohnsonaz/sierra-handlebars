//import Template from './Template';
import Renderer from './Renderer';

describe('HandlebarsView', function () {
    it('should render', function () {
        Renderer.registerHelper('section', function (this: any, name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        });

        let renderer = new Renderer({
            viewRoot: './views/'
        });
    });
});
