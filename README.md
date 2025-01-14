# Projeto de Banco de Dados 2

### Projeto

> TODO: Especificar objetivos e funções do projeto 

### Desenvolvimento

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
