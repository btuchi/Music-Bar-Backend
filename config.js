const config = {
    port: 3000,
    secretKey: "123456abcdef",
    server_url: "http://localhost:3000/",
    expiresIn: 24 * 3600 * 24,
    database:{
        port: 3306,
        host:"localhost",
        name:"bar_db",
        username:"root",
        password:"cctt18858112252"
    },
    userAuthTable: {
        "SUPERADMIN": 64,
        "ADMIN": 32,
        "USER": 16,
    },
    aliyun:{
        accessKeyId:"",
        accessKeySecret:"",
        oss:{
            region:"oss-cn-hangzhou",
            bucket:"",
            internal:false,
            defaultTimeout: 60000,
            defaultMaxSize: 10
        }
    }

}

module.exports = config