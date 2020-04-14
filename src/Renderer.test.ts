import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Template from './Template'; import Renderer from './Renderer';
;

describe('HandlebarsView', function () {
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