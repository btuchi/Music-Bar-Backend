
// // importing library
const koa = require("koa2");
const app = new koa();

app.use(async(ctx)=>{
    console.log("ctx", ctx.request.quert)
});

app.listen(3000);


// const { helloWorld, helloWorld2, a } = require("./util");

// helloWorld();
// a();
// helloWorld2();




// var fs = require("fs");

// // async, 先执行后面的程序, 读取数据完之后再执行
// var data = fs.readFile('input.txt',(err,data)=>{
//     console.log("callback")

// });

// console.log(data);
// console.log("end program");


// async -> sync
