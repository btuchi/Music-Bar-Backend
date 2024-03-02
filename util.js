function helloWorld(){
    console.log("helloWorld")

}

function helloWorld2(){
    console.log("helloWorld2")
}
const a = function(){
    console.log("a")
}

// exporting functions for external use
module.exports = {

    // external function name: the actual function name
    helloWorld: helloWorld,
    helloWorld2: helloWorld2,
    a
}