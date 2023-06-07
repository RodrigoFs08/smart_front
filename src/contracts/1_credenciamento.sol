pragma solidity ^0.8.0;

contract Credenciamento {
    address private owner;
    mapping(address => bool) private credenciados;
    mapping(address => bool) private autorizados;

    // Array de todas as pessoas
    address[] public pessoas;

    struct Pessoa {
        bool aprovado;
        string nomeRazaoSocial;
        string email;
        string cpfCnpj;
        string tipo_pessoa;
        string categoria;
    }

    mapping(address => Pessoa) private informacoesPessoas;

    event PessoaCredenciada(address indexed pessoa);
    event PessoaDescredenciada(address indexed pessoa);
    event CredenciamentoAprovado(address indexed pessoa);
    event CredenciamentoReprovado(address indexed pessoa);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Apenas o proprietario pode chamar esta funcao.");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || autorizados[msg.sender], "Apenas o proprietario ou smart contracts autorizados podem chamar esta funcao.");
        _;
    }

    function credenciarPessoa(
        string memory nomeRazaoSocial,
        string memory cpfCnpj,
        string memory email,
        string memory tipo_pessoa,
        string memory categoria
    ) public {
        require(!credenciados[msg.sender], "Voce ja esta credenciado.");

        informacoesPessoas[msg.sender] = Pessoa({
            aprovado: false,
            nomeRazaoSocial: nomeRazaoSocial,
            cpfCnpj: cpfCnpj,
            email: email,
            tipo_pessoa: tipo_pessoa,
            categoria: categoria
        });

        // Adiciona o endereço ao array de pessoas
        pessoas.push(msg.sender);

        emit PessoaCredenciada(msg.sender);
    }

    // Retorna o total de pessoas
    function totalPessoas() public view returns (uint256) {
        return pessoas.length;
    }

    // Retorna as informações de uma pessoa específica
    function getPessoa(uint256 index) public view returns (bool, string memory, string memory, string memory, string memory, string memory) {
        address pessoa = pessoas[index];
        Pessoa memory info = informacoesPessoas[pessoa];
        return (info.aprovado, info.nomeRazaoSocial, info.cpfCnpj, info.email, info.tipo_pessoa, info.categoria);
    }


 

    // Funcao para aprovar o credenciamento de uma pessoa
    function aprovarCredenciamento(address pessoa) public onlyOwner {
        require(!credenciados[pessoa], "Esta pessoa ja esta credenciada.");
        require(!informacoesPessoas[pessoa].aprovado, "O credenciamento ja foi aprovado para esta pessoa.");

        // Marca o credenciamento como aprovado
        autorizados[pessoa] = true;
        informacoesPessoas[pessoa].aprovado = true;
        credenciados[pessoa] = true;
        emit CredenciamentoAprovado(pessoa);
    }

 

    // Funcao para reprovar o credenciamento de uma pessoa
    function reprovarCredenciamento(address pessoa) public onlyOwner {
        

 

        // Remove as informacões pessoais da pessoa
        informacoesPessoas[pessoa].aprovado = false;
        credenciados[pessoa] = false;
        emit CredenciamentoReprovado(pessoa);
    }


    // Funcao para descredenciar uma pessoa
    function descredenciarPessoa(address pessoa) public onlyOwner {
        require(credenciados[pessoa], "Esta pessoa nao esta credenciada.");

        // Remove as informacões pessoais da pessoa
        delete informacoesPessoas[pessoa];
        credenciados[pessoa] = false;
        emit PessoaDescredenciada(pessoa);
    }

 

    // Funcao para verificar o credenciamento de uma pessoa
    function verificarCredenciamento(address pessoa) public view onlyAuthorized returns (bool, string memory,string memory, string memory, string memory, string memory) {
        require(credenciados[pessoa], "Esta pessoa nao esta credenciada.");

 

        // Retorna as informacões pessoais da pessoa
        Pessoa memory info = informacoesPessoas[pessoa];
        return (info.aprovado, info.tipo_pessoa, info.nomeRazaoSocial, info.email, info.cpfCnpj,info.categoria);
    }

 

    // Funcao para adicionar um contrato inteligente autorizado a verificar o credenciamento
    function adicionarContratoAutorizado(address contrato) public onlyOwner {
        autorizados[contrato] = true;
    }

 

    // Funcao para remover um contrato inteligente autorizado a verificar o credenciamento
    function removerContratoAutorizado(address contrato) public onlyOwner {
        autorizados[contrato] = false;
    }

    function isAuthorized(address _address) public view returns (bool) {
    return autorizados[_address];
}

}