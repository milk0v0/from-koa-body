const Koa = require('koa');
const app = new Koa();
const KoaRouter = require('koa-router');
const KoaBody = require('koa-body');
const router = new KoaRouter();
const fs = require('fs');

router.get('/', ctx => {
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = fs.readFileSync('./static/index.html');
});

app.use(KoaBody());

router.post('/post', ctx => {
    console.log(ctx.request.body);
    ctx.redirect('/');
});

app.use(router.routes());

app.listen(8080);