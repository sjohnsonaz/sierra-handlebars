import Sierra from 'sierra';

let sierra = new Sierra();

(async () => {
    try {
        let port = 3000;
        await sierra.init();
        await sierra.listen(port);
        console.log('Listening to port:', port);
    }
    catch (e) {
        console.error(e);
    }
})();