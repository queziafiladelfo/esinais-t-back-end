const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class Usuario extends Model {
    static init(sequelize) {
        super.init({
            cpf: DataTypes.STRING, // Campo para o CPF do usuário
            nome: DataTypes.STRING, // Campo para o nome do usuário
            email: DataTypes.STRING, // Campo para o e-mail do usuário
            endereco: DataTypes.STRING, // Campo para o endereço do usuário
            telefone: DataTypes.STRING, // Campo para o telefone do usuário
            senha: DataTypes.STRING, // Campo para a senha do usuário
            perfil: DataTypes.STRING, // Campo para o perfil do usuário
            statusUsuario: DataTypes.STRING, // Campo para o status do usuário
            logado: DataTypes.BOOLEAN, // Campo para indicar se o usuário está logado
            quantidadeSinais: DataTypes.INTEGER, // Campo para a quantidade de sinais associados ao usuário
            sexo: DataTypes.STRING, // Campo para o sexo do usuário
            fotoPerfil: DataTypes.STRING // Campo para o caminho da foto de perfil do usuário
        }, {
            sequelize,
            hooks: {
                // Hook para criptografar a senha antes de criar um novo usuário
                beforeCreate: (usuario) => {
                    const salt = bcrypt.genSaltSync();
                    usuario.senha = bcrypt.hashSync(usuario.senha, salt);
                },
                // Hook para criptografar a senha antes de atualizar um usuário existente
                beforeUpdate: (usuario) => {
                    // Verifica se a senha foi alterada antes de criptografar
                    if (usuario.changed('senha')) {
                        const salt = bcrypt.genSaltSync();
                        usuario.senha = bcrypt.hashSync(usuario.senha, salt);
                    }
                },
            }
        });
    }

    // Criando relacionamento de 1 para N com o modelo Sinal
    static associate(models) {
        this.hasMany(models.Sinal, { foreignKey: 'id_usuario', as: 'sinal' });
    }
}

module.exports = Usuario;
