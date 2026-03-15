import express from 'express'

const host = '0.0.0.0'
const porta = 4000

const app = express()

let fornecedores = []

const usuarioSistema = { usuario: 'admin', senha: '1234' }
let logado = false

app.use(express.urlencoded({ extended: true }))

function navbar() {
    return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">Sistema</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="/fornecedor">Cadastrar Fornecedor</a></li>
                    <li class="nav-item"><a class="nav-link" href="/listaFornecedores">Fornecedores</a></li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
                    <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>`
}

function head(titulo) {
    return `
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>${titulo}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
    ${navbar()}`
}

function scripts() {
    return `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>`
}

app.get('/', (req, res) => {
    res.send(`
        ${head('Home')}
        <div class="container mt-5">
            <h1>Bem-vindo</h1>
            <p>Utilize o menu para acessar as funcionalidades do sistema.</p>
        </div>
        ${scripts()}
    `)
})

app.get('/fornecedor', (req, res) => {
    res.send(`
        ${head('Cadastro de Fornecedor')}
        <div class="container mt-5">
            ${formFornecedor({}, {})}
        </div>
        ${scripts()}
    `)
})

function formFornecedor(dados, erros) {
    return `
    <form method="POST" action="/fornecedor" class="border p-4">

        <h3 class="mb-4">Cadastro de Fornecedor</h3>

        <div class="mb-3">
            <label>CNPJ</label>
            <input type="text" class="form-control" name="cnpj" value="${dados.cnpj || ''}">
            ${erros.cnpj ? `<div class="alert alert-danger mt-1">${erros.cnpj}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>Razão Social</label>
            <input type="text" class="form-control" name="razaoSocial" value="${dados.razaoSocial || ''}">
            ${erros.razaoSocial ? `<div class="alert alert-danger mt-1">${erros.razaoSocial}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>Nome Fantasia</label>
            <input type="text" class="form-control" name="nomeFantasia" value="${dados.nomeFantasia || ''}">
            ${erros.nomeFantasia ? `<div class="alert alert-danger mt-1">${erros.nomeFantasia}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>Endereço</label>
            <input type="text" class="form-control" name="endereco" value="${dados.endereco || ''}">
            ${erros.endereco ? `<div class="alert alert-danger mt-1">${erros.endereco}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>Cidade</label>
            <input type="text" class="form-control" name="cidade" value="${dados.cidade || ''}">
            ${erros.cidade ? `<div class="alert alert-danger mt-1">${erros.cidade}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>UF</label>
            <input type="text" class="form-control" name="uf" maxlength="2" value="${dados.uf || ''}">
            ${erros.uf ? `<div class="alert alert-danger mt-1">${erros.uf}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>CEP</label>
            <input type="text" class="form-control" name="cep" value="${dados.cep || ''}">
            ${erros.cep ? `<div class="alert alert-danger mt-1">${erros.cep}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>E-mail</label>
            <input type="text" class="form-control" name="email" value="${dados.email || ''}">
            ${erros.email ? `<div class="alert alert-danger mt-1">${erros.email}</div>` : ''}
        </div>

        <div class="mb-3">
            <label>Telefone</label>
            <input type="text" class="form-control" name="telefone" value="${dados.telefone || ''}">
            ${erros.telefone ? `<div class="alert alert-danger mt-1">${erros.telefone}</div>` : ''}
        </div>

        <button class="btn btn-primary">Cadastrar</button>

    </form>`
}

app.post('/fornecedor', (req, res) => {

    const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body

    const erros = {}

    if (!cnpj) erros.cnpj = 'Informe o CNPJ'
    if (!razaoSocial) erros.razaoSocial = 'Informe a Razão Social'
    if (!nomeFantasia) erros.nomeFantasia = 'Informe o Nome Fantasia'
    if (!endereco) erros.endereco = 'Informe o Endereço'
    if (!cidade) erros.cidade = 'Informe a Cidade'
    if (!uf) erros.uf = 'Informe a UF'
    if (!cep) erros.cep = 'Informe o CEP'
    if (!email) erros.email = 'Informe o E-mail'
    if (!telefone) erros.telefone = 'Informe o Telefone'

    if (Object.keys(erros).length > 0) {

        res.send(`
            ${head('Cadastro de Fornecedor')}
            <div class="container mt-5">
                ${formFornecedor(req.body, erros)}
            </div>
            ${scripts()}
        `)

    } else {

        fornecedores.push({ cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone })
        res.redirect('/listaFornecedores')

    }

})

app.get('/listaFornecedores', (req, res) => {

    let linhas = ''

    fornecedores.forEach((f, i) => {
        linhas += `
        <tr>
            <td>${i + 1}</td>
            <td>${f.cnpj}</td>
            <td>${f.razaoSocial}</td>
            <td>${f.nomeFantasia}</td>
            <td>${f.endereco}</td>
            <td>${f.cidade}</td>
            <td>${f.uf}</td>
            <td>${f.cep}</td>
            <td>${f.email}</td>
            <td>${f.telefone}</td>
        </tr>`
    })

    res.send(`
        ${head('Fornecedores')}
        <div class="container mt-5">

            <h3>Fornecedores cadastrados</h3>

            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>CNPJ</th>
                        <th>Razão Social</th>
                        <th>Nome Fantasia</th>
                        <th>Endereço</th>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>CEP</th>
                        <th>Email</th>
                        <th>Telefone</th>
                    </tr>
                </thead>

                <tbody>
                    ${linhas}
                </tbody>

            </table>

            <a href="/fornecedor" class="btn btn-primary">Novo fornecedor</a>

        </div>
        ${scripts()}
    `)

})

app.get('/login', (req, res) => {

    res.send(`
        ${head('Login')}
        <div class="container mt-5" style="max-width:400px">

            <h3>Login</h3>

            <form method="POST" action="/login" class="border p-4">

                <div class="mb-3">
                    <label>Usuário</label>
                    <input type="text" class="form-control" name="usuario">
                </div>

                <div class="mb-3">
                    <label>Senha</label>
                    <input type="password" class="form-control" name="senha">
                </div>

                <button class="btn btn-primary w-100">Entrar</button>

            </form>

        </div>
        ${scripts()}
    `)

})

app.post('/login', (req, res) => {

    const { usuario, senha } = req.body

    if (usuario === usuarioSistema.usuario && senha === usuarioSistema.senha) {

        logado = true

        res.send(`
            ${head('Login')}
            <div class="container mt-5">
                <div class="alert alert-success">Login realizado com sucesso.</div>
                <a href="/" class="btn btn-primary">Ir para o início</a>
            </div>
            ${scripts()}
        `)

    } else {

        res.send(`
            ${head('Login')}
            <div class="container mt-5" style="max-width:400px">

                <h3>Login</h3>

                <div class="alert alert-danger">Usuário ou senha inválidos</div>

                <form method="POST" action="/login" class="border p-4">

                    <div class="mb-3">
                        <label>Usuário</label>
                        <input type="text" class="form-control" name="usuario">
                    </div>

                    <div class="mb-3">
                        <label>Senha</label>
                        <input type="password" class="form-control" name="senha">
                    </div>

                    <button class="btn btn-primary w-100">Entrar</button>

                </form>

            </div>
            ${scripts()}
        `)

    }

})

app.get('/logout', (req, res) => {

    logado = false

    res.send(`
        ${head('Logout')}
        <div class="container mt-5">
            <div class="alert alert-info">Você saiu do sistema.</div>
            <a href="/" class="btn btn-primary">Voltar</a>
        </div>
        ${scripts()}
    `)

})

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`)
})