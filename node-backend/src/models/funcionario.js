class Funcionario {
 constructor(data) {
    this.ativo = data.ativo ?? true;
    this.foto = data.foto || data.fotoUrl || null;
    this.nome = data.nome;
    this.email = data.email;
    this.dataContratacao = data.dataContratacao;
    this.cpf = data.cpf;
    this.endereco = {
      rua: data.endereco?.rua || '',
      cep: data.endereco?.cep || '',
      bairro: data.endereco?.bairro || '',
      cidade: data.endereco?.cidade || '',
      estado: data.endereco?.estado || '',
    };
  }
  toPlainObject() {
    return {
      nome: this.nome,
      email: this.email,
      dataContratacao: this.dataContratacao,
      cpf: this.cpf,
      ativo: this.ativo,
      foto: this.foto,
      endereco: {
        rua: this.endereco.rua,
        cep: this.endereco.cep,
        bairro: this.endereco.bairro,
        cidade: this.endereco.cidade,
        estado: this.endereco.estado,
      },
    };
  }
}
module.exports = Funcionario;