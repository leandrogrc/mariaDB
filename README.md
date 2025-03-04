# Projeto de Banco de Dados 2

## Projeto

Página para divulgação de url personalizadas.

O que deverá ser mostrado:

- Nome
- Foto de perfil
- Descrição
- Links
  - Título
  - Url
  - Ícone

## Frontend

Deverá ter as seguintes páginas:
- Página pública para mostrar os dados do usuário;
- Página autenticada para alterar dados do usuário;
- Página de gerenciamento da aplicação;
- Página de não encontrado, caso o nome de usuário não exista.

URL's:
- `/admin` -> Página de gerenciamento da aplicação
- `/login` -> Página de login
- `/register` -> Página de login
- `/account` -> Gerenciamento de conta
- `/link/{username}` -> Página pública com os links do usuário

--- 

## Desenvolvimento

Para testar o projeto localmente você precisa:

1. Instalar dependências:
  ```bash
  npm install
  ``` 
2. Copar e alterar o arquivo `.env.example` para `.env`:
  ```env
  PORT=5000
  COOKIE_SECRET=your-secret
  DATABASE_URL=mysql://root:root@localhost:3306/projeto
  ```
3. Criar o banco de dados do projeto:
  ```bash
  # Se estiver usando docker, digite o comando para entrar no container:
  docker exec -it database mariadb -u root -proot

  # Crie o banco de dados, aqui o nome `projeto` é usado como exemplo:
  create database projeto
  ```
4. Migrar as tabelas do banco:
  ```bash
  npm run db:migrate
  ```
5. Iniciar o projeto:
```bash
npm run start
```

---

## Regras de negócio

- [ ] Autenticação
  - [x] Login
  - [X] Logout
  - [x] Criação de usuário
  - [X] Edição de usuário
  - [ ] Deleção de usuário
  - [ ] Confirmar conta
  - [ ] Recuperar conta
- [ ] Links
  - [x] Criação de links
  - [x] Deleção de links
  - [x] Listagem de links
  - [X] Edição de links
- [ ] Sistema de logs
  - [ ] Criação de log
  - [ ] Listagem de logs
- [ ] Observabilidade de erros
  - [ ] Listagem de erros
  - [ ] Criação de erros

## Banco de dados

Entidades:
- `users`
- `sessions`
- `links`
- `error_logs`
- `logs`
- `config`

## Roadmap

- [ ] **Autenticação**
  - [x] Token de sessão
  - [ ] Token de atualização de sessão 
- [ ] **Envio de e-mail**
  - [ ] Configuração SMTP
  - [ ] Templates de e-mail
    - [ ] Confirmar e-mail
    - [ ] Recuperar senha
- [ ] **Páginas web**
  - [x] Página de usuário
  - [x] Página de gerenciamento de dados
- [ ] **Testes**
  - [ ] Testes unitários
  - [ ] Testes de integração
