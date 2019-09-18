# Meetapp :grimacing:

# Sobre o projeto :satisfied:

Este repositório é destinado a armazenar o backend de uma aplicação parecida com o [Meetup](https://www.meetup.com/pt-BR/). Depois será desenvolvido o frontend dessa mesma aplicação.

# Funcionalidades :blush:

Abaixo vou deixar funcionalidades que serão desenvolvidas para a aplicação:

### Autenticação :guardsman:

Permita que um usuário se autentique em sua aplicação utilizando e-mail e senha.

- [X] A autenticação deve ser feita utilizando JWT.
- [X] Realize a validação dos dados de entrada;

### Cadastro e atualização de usuários :boy: 

Permita que novos usuários se cadastrem em sua aplicação utilizando nome, e-mail e senha.

Para atualizar a senha, o usuário deve também enviar um campo de confirmação com a mesma senha.

- [X] Criptografe a senha do usuário para segurança.
- [X] Realize a validação dos dados de entrada;

### Gerenciamento de arquivos :books:

- [X] Crie uma rota para upload de arquivos que cadastra em uma tabela o caminho e nome do arquivo e retorna todos dados do arquivo cadastrado.

### Gerenciamento de meetups :file_folder:

- [X] O usuário pode cadastrar meetups na plataforma com título do meetup, descrição, localização, data e hora e imagem (banner). Todos campos são obrigatórios. Adicione também um campo user_id que armazena o ID do usuário que organiza o evento.

- [X] Não deve ser possível cadastrar meetups com datas que já passaram.

- [X] O usuário também deve poder editar todos dados de meetups que ainda não aconteceram e que ele é organizador.

- [X] Crie uma rota para listar os meetups que são organizados pelo usuário logado.

- [X] O usuário deve poder cancelar meetups organizados por ele e que ainda não aconteceram. O cancelamento deve deletar o meetup da base de dados.

### Inscrição no meetup :pushpin:

- [X] O usuário deve poder se inscrever em meetups que não organiza.

- [X] O usuário não pode se inscrever em meetups que já aconteceram.

- [X] O usuário não pode se inscrever no mesmo meetup duas vezes.

- [X] O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.

- [X] Sempre que um usuário se inscrever no meetup, envie um e-mail ao organizador contendo os dados relacionados ao usuário inscrito. O template do e-mail fica por sua conta :)

### Listagem de meetups :clipboard:

- [X] Crie uma rota para listar os meetups com filtro por data (não por hora), os resultados dessa listagem devem vir paginados em 10 itens por página. Abaixo tem um exemplo de chamada para a rota de listagem dos meetups:

 ```http://localhost:3333/meetups?date=2019-07-01&page=2``` 


- [X] Nessa listagem retorne também os dados do organizador.

### Listagem de inscrições :scroll:

- [X] Crie uma rota para listar os meetups em que o usuário logado está inscrito.

- [X] Liste apenas meetups que ainda não passaram e ordene meetups mais próximos como primeiros da lista.

<h2 align="center">
  Acessem a He4rt :purple_heart:
</h2>

<h3 align="center">
  <img src="https://heartdevs.com/wp-content/uploads/2018/12/logo.png" width="215"><br>
    Visite nosso discord, vamo codar junto!! :godmode:
	<a href="https://discord.io/He4rt" target="_blank">
	<img src="https://discordapp.com/api/guilds/452926217558163456/embed.png" alt="Discord server"/></a><br>
</h3>

[Twitter He4rt](https://twitter.com/He4rtDevs)

[Meu Twitter](https://twitter.com/m7AeiHe4rt)