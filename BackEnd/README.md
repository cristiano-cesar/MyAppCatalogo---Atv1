# Catálogo de Produtos — Back-end

API REST para gerenciamento de produtos de tecnologia, desenvolvida com Node.js, TypeScript, Express, Prisma ORM e PostgreSQL.

## 1. Tecnologias utilizadas

* **Node.js:** ambiente de execução JavaScript.
* **TypeScript:** tipagem estática para o desenvolvimento.
* **Express:** criação dos endpoints da API REST.
* **PostgreSQL 15:** banco de dados relacional.
* **Docker Compose:** execução do banco de dados em contêiner.
* **Prisma ORM:** acesso ao banco de dados, gerenciamento do esquema e migrações.
* **tsx:** execução dos arquivos TypeScript durante o desenvolvimento.
* **Insomnia:** testes das requisições HTTP.

## 2. Pré-requisitos

Antes de executar o projeto, instale:

* Node.js e npm.
* Docker Desktop, com o mecanismo Docker em execução.
* Visual Studio Code ou outro editor de código.
* Insomnia, para testar os endpoints.

## 3. Estrutura do projeto

```text
BackEnd/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── prisma.ts
│   └── server.ts
├── .env
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── prisma.config.ts
└── README.md
```

A pasta `prisma/migrations/` armazena o histórico das alterações do banco de dados. O arquivo `seed.ts` cadastra os produtos iniciais. A pasta `src/` contém o servidor Express e a conexão com o Prisma Client.

## 4. Instalação das dependências

Abra o terminal na pasta do projeto:

```powershell
cd D:\MyAppCatalogo\BackEnd
```

Instale as dependências:

```powershell
npm install
```

## 5. Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, caso ainda não exista.

Configure as variáveis de acordo com o `docker-compose.yml`:

```dotenv
POSTGRES_USER=catalogo_user
POSTGRES_PASSWORD=SUBSTITUA_POR_UMA_SENHA_LOCAL
POSTGRES_DB=catalogo_db

DATABASE_URL="postgresql://catalogo_user:SUBSTITUA_POR_UMA_SENHA_LOCAL@localhost:5432/catalogo_db?schema=public"
```

**Importante:** substitua o texto da senha pela mesma senha nos dois locais. O valor de `DATABASE_URL` deve corresponder às credenciais configuradas para o PostgreSQL.

Não publique o arquivo `.env` em repositórios públicos. Inclua-o no `.gitignore` e disponibilize apenas um exemplo sem senhas reais.

## 6. Inicialização do PostgreSQL com Docker

Com o Docker Desktop em execução, inicialize o banco:

```powershell
docker compose up -d
```

Confira o estado do contêiner:

```powershell
docker compose ps
```

O serviço PostgreSQL deve aparecer como ativo e saudável (*healthy*).

O banco utiliza a porta `5432` do computador e o volume `postgres_data` para persistir os dados.

Para interromper o contêiner sem remover os dados:

```powershell
docker compose down
```

Para iniciar novamente:

```powershell
docker compose up -d
```

## 7. Configuração do Prisma e migrações

Valide o esquema do banco:

```powershell
npx prisma validate
```

Gere o Prisma Client:

```powershell
npx prisma generate
```

Para aplicar as migrações já existentes em um ambiente configurado:

```powershell
npx prisma migrate deploy
```

Durante o desenvolvimento, quando houver alterações no esquema que precisem de uma nova migração, utilize:

```powershell
npx prisma migrate dev --name nome_da_migracao
```

As migrações criam e atualizam a estrutura do banco de dados de acordo com o esquema definido em `prisma/schema.prisma`.

## 8. Cadastro dos produtos iniciais

Para inserir os produtos de teste no banco de dados, execute:

```powershell
npm run seed
```

O seed cadastra cinco produtos de tecnologia, como notebook, mouse, teclado, monitor e SSD.

O procedimento utiliza o modelo `Produto` do Prisma e evita duplicar os produtos iniciais quando executado novamente, desde que os nomes permaneçam iguais.

## 9. Execução da API

Inicie o servidor em modo de desenvolvimento:

```powershell
npm run dev
```

A API estará disponível em:

`http://localhost:3001`

Para verificar se o servidor está funcionando, acesse:

`http://localhost:3001/`

Resposta esperada:

```json
{
  "status": "ok"
}
```

## 10. Endpoints disponíveis

A API utiliza JSON para receber e retornar os dados dos produtos.

| Método | Endpoint        | Descrição                  |
| ------ | --------------- | -------------------------- |
| GET    | `/`             | Verifica o estado da API   |
| GET    | `/products`     | Lista os produtos          |
| GET    | `/products/:id` | Consulta um produto por ID |
| POST   | `/products`     | Cadastra um produto        |
| PUT    | `/products/:id` | Atualiza um produto        |
| DELETE | `/products/:id` | Exclui um produto          |

### 10.1. Listar produtos

**Requisição:**

```http
GET http://localhost:3001/products
```

Retorna uma lista de produtos cadastrados.

### 10.2. Consultar um produto

**Requisição:**

```http
GET http://localhost:3001/products/1
```

Retorna o produto correspondente ao ID informado.

Se o produto não existir, a API retorna `404 Not Found`.

### 10.3. Cadastrar um produto

**Requisição:**

```http
POST http://localhost:3001/products
Content-Type: application/json
```

Corpo da requisição:

```json
{
  "nome": "Webcam Logitech C920",
  "descricao": "Webcam Full HD para videoconferências e aulas on-line.",
  "preco": "349.90"
}
```

Em caso de sucesso, a API retorna `201 Created` e os dados do produto criado.

O campo `nome` deve ser único. O preço deve ser um número positivo, enviado como número ou string numérica.

### 10.4. Atualizar um produto

**Requisição:**

```http
PUT http://localhost:3001/products/1
Content-Type: application/json
```

Corpo da requisição:

```json
{
  "nome": "Webcam Logitech C920",
  "descricao": "Webcam Full HD atualizada para videoconferências.",
  "preco": "329.90"
}
```

Em caso de sucesso, a API retorna `200 OK` e o produto atualizado.

A operação exige os campos `nome`, `descricao` e `preco`.

### 10.5. Excluir um produto

**Requisição:**

```http
DELETE http://localhost:3001/products/1
```

Em caso de sucesso, a API retorna `200 OK` e uma mensagem de confirmação.

## 11. Testes com o Insomnia

Crie requisições HTTP no Insomnia utilizando a URL-base:

`http://localhost:3001`

Configure o método HTTP, o endpoint e, quando necessário, o corpo da requisição no formato JSON.

Verifique os seguintes cenários:

* Consulta do estado da API.
* Listagem de produtos.
* Consulta de produto existente.
* Consulta de ID inválido ou inexistente.
* Cadastro de produto válido.
* Tentativa de cadastro com campos inválidos.
* Tentativa de cadastro com nome duplicado.
* Atualização de produto existente.
* Atualização de ID inexistente.
* Exclusão de produto existente.
* Exclusão de ID inexistente.

Os principais códigos de resposta utilizados são:

| Código HTTP | Significado                      |
| ----------- | -------------------------------- |
| 200         | Requisição concluída com sucesso |
| 201         | Recurso criado                   |
| 400         | Dados ou identificador inválidos |
| 404         | Produto não encontrado           |
| 409         | Conflito, como nome duplicado    |
| 500         | Erro interno do servidor         |

## 12. Observações

* O banco de dados é executado localmente por meio do Docker Compose.
* O Prisma Client é gerado a partir do esquema do Prisma.
* O campo `preco` utiliza o tipo `Decimal` para representar valores monetários.
* O campo `imageUrl` está preparado para armazenar o caminho ou endereço de uma imagem; o upload de arquivos não faz parte da implementação atual.
* O arquivo `.env` contém configurações locais e não deve ser publicado com credenciais reais.

## 13. Licença

Projeto desenvolvido para fins acadêmicos e de aprendizagem em desenvolvimento de APIs REST.
