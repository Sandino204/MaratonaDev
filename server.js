//configurando Servidor
const express = require("express")
const server = express()

//Configurando o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do form
server.use(express.urlencoded({ extended: true }))

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres', 
    password: '*******', 
    host: 'localhost', 
    port: 5432, 
    database: 'doe'
})
 
//configurando temolate engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server, 
    noCache: true,
})


//configurando a apresentação da pagina
server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados")

        const donors = result.rows

        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res){
    //pegar dados do formulario 
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "" ){
        return res.send("Todos os campos sao obrigatorios.")
    }

    //coloco valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ('$1, $2, $3')`

    const values = [name, email, blood]
    
    db.query(query, values, function(err, result){
        // if(err) return res.send("erro no banco de dados")

        return res.redirect("/")
    })
})

//ligaar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor")
})

