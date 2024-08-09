// const Usuario = require('../models/Usuario');
// const Sinal = require('../models/Sinal');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const authConfig = require('../config/auth.json');
// const yup = require('yup');
// const { Op } = require("sequelize"); 
// const fs = require('fs'); // manipular arquivos

// function generateToke(parms = {}) {
//     return jwt.sign(parms, authConfig.secret, {
//         //definir o tempo em segundos da expiração do token
//         expiresIn: 78300,
//     })
// }
// async function deletarImgAntiga(imgAntiga, tipoImg) {

//     if(imgAntiga == ''){
//         return false;
//     }else{
//         imgOld = 'src/public/upload/' + tipoImg + "/" + imgAntiga;

//     fs.access(imgOld, (err) => {
//         if (!err) {
//             //este comando deleta o arquivo da pasta
//             fs.unlink(imgOld, () => { });
//             return true


//         } else {
//             console.log(err)
//             return false;
//         }
//     });
//     }
    
    
   

// }

// module.exports = {
//     //Método para autenticar usuários
//     async login(req, res) {
//         try {
//             // Recebe as informações do corpo da requisição
//             const { senha, email, logado } = req.body;
    
//             // Busca o usuário pelo email fornecido
//             const usuario = await Usuario.findOne({ where: { email } });
    
//             // Verifica se o usuário foi encontrado
//             if (!usuario) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Email ou senha incorreto'
//                 });
//             }
    
//             // Verifica se a senha foi fornecida
//             if (!senha) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Senha não fornecida'
//                 });
//             }
    
//             // Compara a senha fornecida com a senha armazenada no banco de dados
//             const isMatch = bcrypt.compareSync(senha, usuario.senha);
//             console.log(isMatch)
//             if (!isMatch) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Email ou senha incorreto'
//                 });
//             }
    
//             // Atualiza o status do usuário para "logado"
//             await Usuario.update({ logado }, { where: { id: usuario.id } });
    
//             // Remove a senha do objeto usuário antes de enviar a resposta
//             usuario.senha = undefined;
    
//             // Gera um token para o usuário
//             const token = generateToke({ id: usuario.id });
    
//             // Retorna a resposta de sucesso com o token e informações do usuário
//             return res.status(200).send({
//                 status: 1,
//                 message: "Usuário logado com sucesso!",
//                 usuario,
//                 token
//             });
//         } catch (err) {
//             // Retorna uma resposta de erro em caso de exceção
//             return res.status(400).json({ error: err });
//         }
//     },    
    
    
//     //Método para buscar tudo do banco de dados
//     async index(req, res) {
//         try {
//             //implementando a paginação
//             //recebendo do parâmentro qual a página
//             const {paginacao = 1} = req.params;
//             //estabelecendo o limite de registro
//             const limite = 2;
//             var ultimaPagina = 1;
           
//             //consultando a quantidade de registros no banco de dados
//             const qtdRegistros = await Usuario.count();
//             //Caso não tiver nenhum registro retornar null
//             if(qtdRegistros === null){
//                 return res.status(400).json({ error: err })
//             } else{
//                 ultimaPagina = Math.ceil(qtdRegistros /limite);
//             }

//             //A função findAll no sequelize tras todas as informações para um array
//             const usuarios = await Usuario.findAll({ offset: Number((paginacao * limite) - limite), limit: limite});

//             //validação se não tiver nenhum dado
//             if (usuarios == "" || usuarios == null) {
//                 return res.status(200).send({ message: "Nenhum usuário encontrado" })
//             }
//             return res.status(200).send({ usuarios, qtdRegistros, ultimaPagina });

//         } catch (err) {
//             return res.status(400).json({ error: err })
//         }

//     },
//     async indexUsuarioParametros(req, res) {
//         /*
//             este método faz a busca através da selecão vinda do front-end por tipos diferentes
//             parâmetros:
//             1 - busca pela id do usuário
//             2 - busca pelo nome do usuário
//             3 - busca pelo CPF do usuário
//             4 - busca pelo email do usuário
//             5 - busca pelo perfil do usuário (Administrador, usuário padrão)
//             6 - busca pelo status do usuário (ATIVO ou INATIVO)
//             7 - busca da polissemia por palavra
            
//         */

//         const { id_tipo, valor } = req.params;
        
//         if (id_tipo == 1) {
//             //const usuario = await Usuario.findByPk(valor);
//             const usuario = await Usuario.findAll({
//                 where: {
//                     id: valor
//                 }
//             });
//             if (usuario == "") {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Usuário não encontrado!'
//                 });
//             } else {
//                 return res.status(200).send({
//                     status: 1,
//                     message: 'Busca pela ID!',
//                     usuario
//                 });
//             }

//         } else if (id_tipo == 2){
//             const usuario = await Usuario.findAll({
//                 where: {
//                     nome: valor
//                 }
//             });
//             if (usuario == "") {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Usuário não encontrado!'
//                 });
//             } else {
//                 return res.status(200).send({
//                     status: 1,
//                     message: 'Busca pelo Nome!',
//                     usuario
//                 });
//             }
//         }else if (id_tipo == 3){
//             const usuario = await Usuario.findAll({
//                 where: {
//                     cpf: valor
//                 }
//             });
//             if (usuario == "") {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Usuário não encontrado!'
//                 });
//             } else {
//                 return res.status(200).send({
//                     status: 1,
//                     message: 'Busca pelo CPF!',
//                     usuario
//                 });
//             }
//         }else if (id_tipo == 4){
//             const usuario = await Usuario.findAll({
//                 where: {
//                     email: valor
//                 }
//             });
//             if (usuario == "") {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Usuário não encontrado!'
//                 });
//             } else {
//                 return res.status(200).send({
//                     status: 1,
//                     message: 'Busca pelo E-mail!',
//                     usuario
//                 });
//             }
//         }else if (id_tipo == 5){
//             const usuario = await Usuario.findAll({
//                 where: {
//                     perfil: valor
//                 }
//             });
//             if (usuario == "") {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Usuário não encontrado!'
//                 });
//             } else {
//                 return res.status(200).send({
//                     status: 1,
//                     message: 'Busca pelo Perfil!',
//                     usuario
//                 });
//             }
//         }else if (id_tipo == 6){
//             const usuario = await Usuario.findAll({
//                 where: {
//                     statusUsuario: valor
//                 }
//             });
//             if (usuario == "") {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Usuário não encontrado!'
//                 });
//             } else {
//                 return res.status(200).send({
//                     status: 1,
//                     message: 'Busca pelo Statua do Usuário!',
//                     usuario
//                 });
//             }
//         }
//     },
//     //Método para cadastro de usuário rápido
//     async storeQuick(req, res) {
//         try {
//             // Recebe as informações básicas do corpo da requisição
//             const { cpf, nome, email, sexo, senha } = req.body;
            
//             // Define valores padrão para os campos não fornecidos
//             const endereco = '';
//             const telefone = '';
//             const perfil = 'usuario'; // Valor padrão ou um perfil pré-definido
//             const statusUsuario = 'ativo'; // Valor padrão ou status inicial
//             const logado = false;
//             const quantidadeSinais = 0;
//             const fotoPerfil = 'perfilSemFoto.jpg'; // Valor padrão para a foto de perfil
    
//             // Dados reduzidos recebidos do front-end
//             const dados = { cpf, nome, email, sexo, senha };
    
//             // Validação dos dados recebidos
//             let schema = yup.object().shape({
//                 cpf: yup.string("Error: Necessário preencher o campo CPF").required("Error: Necessário preencher o campo CPF"),
//                 nome: yup.string("Error: Necessário preencher o campo Nome").required("Error: Necessário preencher o campo Nome"),
//                 email: yup.string("Error: Necessário preencher o campo e-mail").required("Error: Necessário preencher o campo email"),
//                 sexo: yup.string("Error: Necessário preencher o campo Sexo").required("Error: Necessário preencher o campo Sexo"),
//                 senha: yup.string("Error: Necessário preencher o campo senha").required("Error: Necessário preencher o campo senha")
//             });
    
//             try {
//                 // Verifica se os dados recebidos do front-end estão preenchidos
//                 await schema.validate(dados);
//             } catch (err) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: err.errors
//                 });
//             }
            
//             // Verifica se o e-mail já está cadastrado
//             const validarEmail = await Usuario.findOne({
//                 where: {
//                     email: email
//                 } 
//             });
//             // Verifica se o e-mail já está cadastrado
//             const validarCpf = await Usuario.findOne({
//                 where: {
//                     cpf: cpf
//                 } 
//             });
//             if (validarCpf) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Error: CPF já cadastrado!'
//                 });
//             }
            
//             if (validarEmail) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Error: e-mail já cadastrado!'
//                 });
//             }
    
//             // Cria o usuário com os dados fornecidos
//             const usuario = await Usuario.create({ 
//                 cpf, 
//                 nome, 
//                 email, 
//                 endereco, 
//                 telefone, 
//                 senha, 
//                 perfil, 
//                 statusUsuario, 
//                 logado, 
//                 quantidadeSinais, 
//                 sexo, 
//                 fotoPerfil 
//             });
    
//             // Gera um token para o usuário
//             const token = generateToke({ id: usuario.id });
    
//             // Retorna o status 200 e informações sobre o sucesso do cadastro
//             return res.status(200).send({
//                 status: 1,
//                 message: "Usuário cadastrado com sucesso!",
//                 usuario,
//                 token
//             });
//         } catch (err) {
//             // Em caso de erro, retorna o status 400 com detalhes do erro
//             return res.status(400).json({ error: err });
//         }
//     },
    
//     //Método para salvar no banco de dados
//     async store(req, res) {
//         try {
            
//             //recebe as informações do corpo da requisição
//             const { cpf, nome, email, endereco, telefone, senha, perfil, statusUsuario, sexo} = req.body;
            
//             let logado = false;
//             let quantidadeSinais = 0;  
//             const dados = req.body;
//             var fotoPerfil = '';
//             //console.log(req.files.fotoPerfil[0].filename);
//             if(req.files.fotoPerfil == null){
                
//                 fotoPerfil = "perfilSemFoto.jpg";
                
//             }else{
//                 fotoPerfil = req.files.fotoPerfil[0].filename;
//             }
//             //usando a dependência yup para validar os dados vinda do front-end no back-end
//             let schema = yup.object().shape({
//                 statusUsuario: yup.string("Error: Necessário preencher o campo Status Usuario").required("Error: Necessário preencher o campo Status Usuario"),
//                 perfil: yup.string("Error: Necessário preencher o campo perfil").required("Error: Necessário preencher o campo perfil"),
//                 senha: yup.string("Error: Necessário preencher o campo senha").required("Error: Necessário preencher o campo senha"),
//                 email: yup.string("Error: Necessário preencher o campo e-mail").required("Error: Necessário preencher o campo email"),
//                 nome: yup.string("Error: Necessário preencher o campo Nome").required("Error: Necessário preencher o campo Nome"),
//                 cpf: yup.string("Error: Necessário preencher o campo CPF").required("Error: Necessário preencher o campo CPF")
//             });
//             try{
//                 //verifica se os dados recebidos do front-end estão preenchidos, caso não esteja é exibido a mensagem acima
//                 await schema.validate(dados);
//             }catch(err){
//                 return res.status(400).send({
//                     status: 0,
//                     //esse errors refere aos campos acima que não estão preenchidos, sendo exibidos as mensagens
//                     message: err.errors
//                 });
//             }
            
//             //verificando se existe o e-mail cadastrado
//             const validarEmail = await Usuario.findOne({
//                 where: {
//                     email: email
//                 } 
//             });
            
//             if (validarEmail){
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Error: e-mail já cadastrado!'
//                 });
//             }
           


//             //Informa os parâmetros vindo do corpo para serem inseridos no INSERT do banco de dados
            
//             const usuario = await Usuario.create({ cpf, nome, email, endereco, telefone, senha, perfil, statusUsuario, logado, quantidadeSinais, sexo, fotoPerfil });

//             //gerando o token quando logar
//             const token = generateToke({ id: usuario.id });

//             //retorna o status 200 e informa o sucesso
//             return res.status(200).send({
//                 status: 1,
//                 message: "Usuário cadastrado com sucesso!",
//                 usuario,
//                 token
//             });
//         } catch (err) {
//             return res.status(400).json({ error: err })
//         }

//     },
//     //Método para atualizar no banco de dados
//     async update(req, res) {
//         try {
//             // Recebe as informações do corpo da requisição
//             const { cpf, nome, email, endereco, telefone, senha, perfil, statusUsuario, sexo } = req.body;
//             const dados = req.body;
            
//             // Recebe o parâmetro passado pela URL, neste caso, a ID do usuário
//             const { user_id } = req.params;
            
//             // Usando a dependência yup para validar os dados vindos do front-end no back-end
//             let schema = yup.object().shape({
//                 statusUsuario: yup.string("Error: Necessário preencher o campo Status Usuario").required("Error: Necessário preencher o campo Status Usuario"),
//                 perfil: yup.string("Error: Necessário preencher o campo perfil").required("Error: Necessário preencher o campo perfil"),
//                 email: yup.string("Error: Necessário preencher o campo e-mail").required("Error: Necessário preencher o campo email"),
//                 nome: yup.string("Error: Necessário preencher o campo Nome").required("Error: Necessário preencher o campo Nome"),
//                 cpf: yup.string("Error: Necessário preencher o campo CPF").required("Error: Necessário preencher o campo CPF")
//             });
    
//             // Verifica se os dados recebidos do front-end estão preenchidos, caso não esteja é exibida a mensagem de erro acima
//             await schema.validate(dados);
    
//             // Faz a busca para identificar e-mails iguais diferente da ID que está logado
//             const validarEmail = await Usuario.findOne({
//                 where: {
//                     email: email,
//                     id: {
//                         [Op.ne]: user_id // O operador [Op.ne] é usado para garantir que o e-mail não seja o mesmo do usuário atual
//                     }
//                 }
//             });
    
//             // Se encontrar um e-mail já cadastrado, retorna uma mensagem de erro
//             if (validarEmail) {
//                 return res.status(400).send({
//                     status: 0,
//                     message: 'Error: e-mail já cadastrado!'
//                 });
//             }
    
//             let fotoPerfil = '';
    
//             // Busca o usuário para verificar o caminho da foto de perfil atual
//             const usuariosTemp = await Usuario.findByPk(user_id);
    
//             // Verifica se foi enviado um novo arquivo de foto de perfil
//             if (req.files.fotoPerfil == null) {
//                 // Se não houver um novo arquivo, mantém a foto de perfil atual
//                 fotoPerfil = usuariosTemp.fotoPerfil;
//             } else {
//                 // Se houver um novo arquivo, usa o novo nome do arquivo e deleta a foto antiga
//                 fotoPerfil = req.files.fotoPerfil[0].filename;
//                 deletarImgAntiga(usuariosTemp.fotoPerfil, "fotosPerfilUsuarios");
//             }
    
//             // Prepara os dados para atualização
//             let updateData = {
//                 cpf,
//                 nome,
//                 email,
//                 endereco,
//                 telefone,
//                 perfil,
//                 statusUsuario,
//                 sexo,
//                 fotoPerfil
//             };
    
//             // Se uma nova senha for fornecida, criptografa a senha antes de atualizar
//             if (senha) {
//                 const salt = bcrypt.genSaltSync();
//                 updateData.senha = bcrypt.hashSync(senha, salt);
//             }
    
//             // Atualiza os dados do usuário no banco de dados
//             await Usuario.update(updateData, {
//                 where: {
//                     id: user_id
//                 }
//             });
    
//             // Retorna o status 200 e informa que as informações foram atualizadas com sucesso
//             return res.status(200).send({
//                 status: 1,
//                 message: "Informações atualizadas com sucesso!",
//             });
//         } catch (err) {
//             // Em caso de erro, retorna o status 400 com detalhes do erro
//             return res.status(400).json({ error: err });
//         }
//     },
    
//     //Método para deletar no banco de dados
//     async delete(req, res) {
//         try {
//             //recebe o parâmetro passado pela URL, neste cado a ID do usuário
//             const { user_id } = req.params;

//             //comando para deletar do banco de dados
//             await Usuario.destroy({
//                 where: {
//                     id: user_id
//                 }
//             });
//             //retorna o status 200 e informa o sucesso
//             return res.status(200).send({
//                 status: 1,
//                 message: "Usuários deletado com sucesso!",
//             });
//         } catch (err) {
//             return res.status(400).json({ error: err })
//         }

//     }
// };

const Usuario = require('../models/Usuario');
const Sinal = require('../models/Sinal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const yup = require('yup');
const { Op } = require("sequelize"); 
const fs = require('fs'); // manipular arquivos

function generateToke(parms = {}) {
    return jwt.sign(parms, authConfig.secret, {
        //definir o tempo em segundos da expiração do token
        expiresIn: 78300,
    })
}
async function deletarImgAntiga(imgAntiga, tipoImg) {

    if(imgAntiga == ''){
        return false;
    }else{
        imgOld = './public/upload/' + tipoImg + "/" + imgAntiga;

    fs.access(imgOld, (err) => {
        if (!err) {
            //este comando deleta o arquivo da pasta
            fs.unlink(imgOld, () => { });
            return true


        } else {
            console.log(err)
            return false;
        }
    });
    }
    
    
   

}

module.exports = {
    //Método para autenticar usuários
    async login(req, res) {
        try {
            // Recebe as informações do corpo da requisição
            const { senha, email, logado } = req.body;
    
            // Busca o usuário pelo email fornecido
            const usuario = await Usuario.findOne({ where: { email } });
    
            // Verifica se o usuário foi encontrado
            if (!usuario) {
                return res.status(400).send({
                    status: 0,
                    message: 'Email ou senha incorreto'
                });
            }
    
            // Verifica se a senha foi fornecida
            if (!senha) {
                return res.status(400).send({
                    status: 0,
                    message: 'Senha não fornecida'
                });
            }
    
            // Compara a senha fornecida com a senha armazenada no banco de dados
            const isMatch = bcrypt.compareSync(senha, usuario.senha);
            console.log(isMatch)
            if (!isMatch) {
                return res.status(400).send({
                    status: 0,
                    message: 'Email ou senha incorreto'
                });
            }
    
            // Atualiza o status do usuário para "logado"
            await Usuario.update({ logado }, { where: { id: usuario.id } });
    
            // Remove a senha do objeto usuário antes de enviar a resposta
            usuario.senha = undefined;
    
            // Gera um token para o usuário
            const token = generateToke({ id: usuario.id });
    
            // Retorna a resposta de sucesso com o token e informações do usuário
            return res.status(200).send({
                status: 1,
                message: "Usuário logado com sucesso!",
                usuario,
                token
            });
        } catch (err) {
            // Retorna uma resposta de erro em caso de exceção
            return res.status(400).json({ error: err });
        }
    },    
    
    
    //Método para buscar tudo do banco de dados
    async index(req, res) {
        try {
            //implementando a paginação
            //recebendo do parâmentro qual a página
            const {paginacao = 1} = req.params;
            //estabelecendo o limite de registro
            const limite = 2;
            var ultimaPagina = 1;
           
            //consultando a quantidade de registros no banco de dados
            const qtdRegistros = await Usuario.count();
            //Caso não tiver nenhum registro retornar null
            if(qtdRegistros === null){
                return res.status(400).json({ error: err })
            } else{
                ultimaPagina = Math.ceil(qtdRegistros /limite);
            }

            //A função findAll no sequelize tras todas as informações para um array
            const usuarios = await Usuario.findAll({ offset: Number((paginacao * limite) - limite), limit: limite});

            //validação se não tiver nenhum dado
            if (usuarios == "" || usuarios == null) {
                return res.status(200).send({ message: "Nenhum usuário encontrado" })
            }
            return res.status(200).send({ usuarios, qtdRegistros, ultimaPagina });

        } catch (err) {
            return res.status(400).json({ error: err })
        }

    },
    async indexUsuarioParametros(req, res) {
        /*
            este método faz a busca através da selecão vinda do front-end por tipos diferentes
            parâmetros:
            1 - busca pela id do usuário
            2 - busca pelo nome do usuário
            3 - busca pelo CPF do usuário
            4 - busca pelo email do usuário
            5 - busca pelo perfil do usuário (Administrador, usuário padrão)
            6 - busca pelo status do usuário (ATIVO ou INATIVO)
            7 - busca da polissemia por palavra
            
        */

        const { id_tipo, valor } = req.params;
        
        if (id_tipo == 1) {
            //const usuario = await Usuario.findByPk(valor);
            const usuario = await Usuario.findAll({
                where: {
                    id: valor
                }
            });
            if (usuario == "") {
                return res.status(400).send({
                    status: 0,
                    message: 'Usuário não encontrado!'
                });
            } else {
                return res.status(200).send({
                    status: 1,
                    message: 'Busca pela ID!',
                    usuario
                });
            }

        } else if (id_tipo == 2){
            const usuario = await Usuario.findAll({
                where: {
                    nome: valor
                }
            });
            if (usuario == "") {
                return res.status(400).send({
                    status: 0,
                    message: 'Usuário não encontrado!'
                });
            } else {
                return res.status(200).send({
                    status: 1,
                    message: 'Busca pelo Nome!',
                    usuario
                });
            }
        }else if (id_tipo == 3){
            const usuario = await Usuario.findAll({
                where: {
                    cpf: valor
                }
            });
            if (usuario == "") {
                return res.status(400).send({
                    status: 0,
                    message: 'Usuário não encontrado!'
                });
            } else {
                return res.status(200).send({
                    status: 1,
                    message: 'Busca pelo CPF!',
                    usuario
                });
            }
        }else if (id_tipo == 4){
            const usuario = await Usuario.findAll({
                where: {
                    email: valor
                }
            });
            if (usuario == "") {
                return res.status(400).send({
                    status: 0,
                    message: 'Usuário não encontrado!'
                });
            } else {
                return res.status(200).send({
                    status: 1,
                    message: 'Busca pelo E-mail!',
                    usuario
                });
            }
        }else if (id_tipo == 5){
            const usuario = await Usuario.findAll({
                where: {
                    perfil: valor
                }
            });
            if (usuario == "") {
                return res.status(400).send({
                    status: 0,
                    message: 'Usuário não encontrado!'
                });
            } else {
                return res.status(200).send({
                    status: 1,
                    message: 'Busca pelo Perfil!',
                    usuario
                });
            }
        }else if (id_tipo == 6){
            const usuario = await Usuario.findAll({
                where: {
                    statusUsuario: valor
                }
            });
            if (usuario == "") {
                return res.status(400).send({
                    status: 0,
                    message: 'Usuário não encontrado!'
                });
            } else {
                return res.status(200).send({
                    status: 1,
                    message: 'Busca pelo Statua do Usuário!',
                    usuario
                });
            }
        }
    },
    //Método para cadastro de usuário rápido
    async storeQuick(req, res) {
        try {
            // Recebe as informações básicas do corpo da requisição
            const { cpf, nome, email, sexo, senha } = req.body;
            
            // Define valores padrão para os campos não fornecidos
            const endereco = 'Não Informado';
            const telefone = '00 00000000';
            const perfil = 'padrao'; // Valor padrão ou um perfil pré-definido
            const statusUsuario = 'ativo'; // Valor padrão ou status inicial
            const logado = false;
            const quantidadeSinais = 0;
            const fotoPerfil = 'perfilSemFoto.jpg'; // Valor padrão para a foto de perfil
    
            // Dados reduzidos recebidos do front-end
            const dados = { cpf, nome, email, sexo, senha };
    
            // Validação dos dados recebidos
            let schema = yup.object().shape({
                cpf: yup.string("Error: Necessário preencher o campo CPF").required("Error: Necessário preencher o campo CPF"),
                nome: yup.string("Error: Necessário preencher o campo Nome").required("Error: Necessário preencher o campo Nome"),
                email: yup.string("Error: Necessário preencher o campo e-mail").required("Error: Necessário preencher o campo email"),
                sexo: yup.string("Error: Necessário preencher o campo Sexo").required("Error: Necessário preencher o campo Sexo"),
                senha: yup.string("Error: Necessário preencher o campo senha").required("Error: Necessário preencher o campo senha")
            });
    
            try {
                // Verifica se os dados recebidos do front-end estão preenchidos
                await schema.validate(dados);
            } catch (err) {
                return res.status(400).send({
                    status: 0,
                    message: err.errors
                });
            }
            
            // Verifica se o e-mail já está cadastrado
            const validarEmail = await Usuario.findOne({
                where: {
                    email: email
                } 
            });
            // Verifica se o e-mail já está cadastrado
            const validarCpf = await Usuario.findOne({
                where: {
                    cpf: cpf
                } 
            });
            if (validarCpf) {
                return res.status(400).send({
                    status: 0,
                    message: 'Error: CPF já cadastrado!'
                });
            }
            
            if (validarEmail) {
                return res.status(400).send({
                    status: 0,
                    message: 'Error: e-mail já cadastrado!'
                });
            }
    
            // Cria o usuário com os dados fornecidos
            const usuario = await Usuario.create({ 
                cpf, 
                nome, 
                email, 
                endereco, 
                telefone, 
                senha, 
                perfil, 
                statusUsuario, 
                logado, 
                quantidadeSinais, 
                sexo, 
                fotoPerfil 
            });
    
            // Gera um token para o usuário
            const token = generateToke({ id: usuario.id });
    
            // Retorna o status 200 e informações sobre o sucesso do cadastro
            return res.status(200).send({
                status: 1,
                message: "Usuário cadastrado com sucesso!",
                usuario,
                token
            });
        } catch (err) {
            // Em caso de erro, retorna o status 400 com detalhes do erro
            return res.status(400).json({ error: err });
        }
    },
    
    //Método para salvar no banco de dados
    async store(req, res) {
        try {
            
            //recebe as informações do corpo da requisição
            const { cpf, nome, email, endereco, telefone, senha, perfil, statusUsuario, sexo} = req.body;
            
            let logado = false;
            let quantidadeSinais = 0;  
            const dados = req.body;
            var fotoPerfil = '';
            //console.log(req.files.fotoPerfil[0].filename);
            if(req.files.fotoPerfil == null){
                
                fotoPerfil = "perfilSemFoto.jpg";
                
            }else{
                fotoPerfil = req.files.fotoPerfil[0].filename;
            }
            //usando a dependência yup para validar os dados vinda do front-end no back-end
            let schema = yup.object().shape({
                statusUsuario: yup.string("Error: Necessário preencher o campo Status Usuario").required("Error: Necessário preencher o campo Status Usuario"),
                perfil: yup.string("Error: Necessário preencher o campo perfil").required("Error: Necessário preencher o campo perfil"),
                senha: yup.string("Error: Necessário preencher o campo senha").required("Error: Necessário preencher o campo senha"),
                email: yup.string("Error: Necessário preencher o campo e-mail").required("Error: Necessário preencher o campo email"),
                nome: yup.string("Error: Necessário preencher o campo Nome").required("Error: Necessário preencher o campo Nome"),
                cpf: yup.string("Error: Necessário preencher o campo CPF").required("Error: Necessário preencher o campo CPF")
            });
            try{
                //verifica se os dados recebidos do front-end estão preenchidos, caso não esteja é exibido a mensagem acima
                await schema.validate(dados);
            }catch(err){
                return res.status(400).send({
                    status: 0,
                    //esse errors refere aos campos acima que não estão preenchidos, sendo exibidos as mensagens
                    message: err.errors
                });
            }
            
            //verificando se existe o e-mail cadastrado
            const validarEmail = await Usuario.findOne({
                where: {
                    email: email
                } 
            });
            
            if (validarEmail){
                return res.status(400).send({
                    status: 0,
                    message: 'Error: e-mail já cadastrado!'
                });
            }
           


            //Informa os parâmetros vindo do corpo para serem inseridos no INSERT do banco de dados
            
            const usuario = await Usuario.create({ cpf, nome, email, endereco, telefone, senha, perfil, statusUsuario, logado, quantidadeSinais, sexo, fotoPerfil });

            //gerando o token quando logar
            const token = generateToke({ id: usuario.id });

            //retorna o status 200 e informa o sucesso
            return res.status(200).send({
                status: 1,
                message: "Usuário cadastrado com sucesso!",
                usuario,
                token
            });
        } catch (err) {
            return res.status(400).json({ error: err })
        }

    },
    //Método para atualizar no banco de dados
    async update(req, res) {
        try {
            // Recebe as informações do corpo da requisição
            const { cpf, nome, email, endereco, telefone, senha, perfil, statusUsuario, sexo } = req.body;
            const dados = req.body;
            
            // Recebe o parâmetro passado pela URL, neste caso, a ID do usuário
            const { user_id } = req.params;
            
            // Usando a dependência yup para validar os dados vindos do front-end no back-end
            let schema = yup.object().shape({
                statusUsuario: yup.string("Error: Necessário preencher o campo Status Usuario").required("Error: Necessário preencher o campo Status Usuario"),
                perfil: yup.string("Error: Necessário preencher o campo perfil").required("Error: Necessário preencher o campo perfil"),
                email: yup.string("Error: Necessário preencher o campo e-mail").required("Error: Necessário preencher o campo email"),
                nome: yup.string("Error: Necessário preencher o campo Nome").required("Error: Necessário preencher o campo Nome"),
                cpf: yup.string("Error: Necessário preencher o campo CPF").required("Error: Necessário preencher o campo CPF")
            });
    
            // Verifica se os dados recebidos do front-end estão preenchidos, caso não esteja é exibida a mensagem de erro acima
            await schema.validate(dados);
    
            // Faz a busca para identificar e-mails iguais diferente da ID que está logado
            const validarEmail = await Usuario.findOne({
                where: {
                    email: email,
                    id: {
                        [Op.ne]: user_id // O operador [Op.ne] é usado para garantir que o e-mail não seja o mesmo do usuário atual
                    }
                }
            });
    
            // Se encontrar um e-mail já cadastrado, retorna uma mensagem de erro
            if (validarEmail) {
                return res.status(400).send({
                    status: 0,
                    message: 'Error: e-mail já cadastrado!'
                });
            }
    
            let fotoPerfil = '';
    
            // Busca o usuário para verificar o caminho da foto de perfil atual
            const usuariosTemp = await Usuario.findByPk(user_id);
    
            // Verifica se foi enviado um novo arquivo de foto de perfil
            if (req.files.fotoPerfil == null) {
                // Se não houver um novo arquivo, mantém a foto de perfil atual
                fotoPerfil = usuariosTemp.fotoPerfil;
            } else {
                // Se houver um novo arquivo, usa o novo nome do arquivo e deleta a foto antiga
                fotoPerfil = req.files.fotoPerfil[0].filename;
                deletarImgAntiga(usuariosTemp.fotoPerfil, "fotosPerfilUsuarios");
            }
    
            // Prepara os dados para atualização
            let updateData = {
                cpf,
                nome,
                email,
                endereco,
                telefone,
                perfil,
                statusUsuario,
                sexo,
                fotoPerfil
            };
    
            // Se uma nova senha for fornecida, criptografa a senha antes de atualizar
            if (senha) {
                const salt = bcrypt.genSaltSync();
                updateData.senha = bcrypt.hashSync(senha, salt);
            }
    
            // Atualiza os dados do usuário no banco de dados
            await Usuario.update(updateData, {
                where: {
                    id: user_id
                }
            });
    
            // Retorna o status 200 e informa que as informações foram atualizadas com sucesso
            return res.status(200).send({
                status: 1,
                message: "Informações atualizadas com sucesso!",
            });
        } catch (err) {
            // Em caso de erro, retorna o status 400 com detalhes do erro
            return res.status(400).json({ error: err });
        }
    },
    
    //Método para deletar no banco de dados
    async delete(req, res) {
        try {
            //recebe o parâmetro passado pela URL, neste cado a ID do usuário
            const { user_id } = req.params;

            //comando para deletar do banco de dados
            await Usuario.destroy({
                where: {
                    id: user_id
                }
            });
            //retorna o status 200 e informa o sucesso
            return res.status(200).send({
                status: 1,
                message: "Usuários deletado com sucesso!",
            });
        } catch (err) {
            return res.status(400).json({ error: err })
        }

    }
};