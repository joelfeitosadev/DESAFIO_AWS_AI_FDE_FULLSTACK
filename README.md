# Movie API - Desafio AWS AI FDE Fullstack

API RESTful para gerenciamento de Filmes e Diretores, desenvolvida em **Node.js** com **TypeScript** e **Prisma ORM**.

---

## 🚀 Tecnologias e Metodologias Utilizadas

O projeto foi construído seguindo as melhores práticas de desenvolvimento, focando em manutenibilidade, tipagem estática e testes.

**Tecnologias:**
* **Node.js & Express.js:** Base da aplicação para criação do servidor e gerenciamento de rotas.
* **TypeScript:** Utilizado para tipagem estática, garantindo maior segurança e previsibilidade do código.
* **Prisma ORM:** Escolhido para modelagem do banco de dados relacional e execução das *migrations*.
* **MySQL:** Banco de dados relacional escolhido para persistência dos dados.
* **Docker & Docker Compose:** Utilizado para conteinerização da aplicação e do banco de dados, utilizando *multi-stage builds* para otimizar o tamanho da imagem final.
* **Vitest & Supertest:** Ferramentas escolhidas para a suíte de testes de integração e unitários.
* **Swagger UI (swagger-autogen):** Para a documentação interativa da API de forma automatizada.

**Metodologias e Padrões:**
* **Clean Code:** Nomenclatura descritiva (em inglês) e tratamento centralizado de erros (Middleware Global).
* **Padrão Repository & Service Pattern:** A aplicação foi refatorada para separar as responsabilidades. Os `Controllers` lidam apenas com as requisições HTTP, os `Services` contêm as regras de negócio e os `Repositories` fazem a comunicação direta com o banco de dados.
* **Test-Driven Development (TDD) / Testes Unitários e Integração:** Criação de mocks de banco de dados (`vitest-mock-extended`) para testar o comportamento da aplicação de forma isolada.
* **Conventional Commits:** Padrão adotado no versionamento do projeto.

---

## 📋 Pré-requisitos

Para rodar este projeto, você precisará ter as seguintes ferramentas instaladas em sua máquina. Escolha a versão adequada para o seu sistema operacional (Windows, macOS ou Linux) nos links abaixo:

* **Docker & Docker Compose:** Utilizados para rodar a aplicação e o banco de dados via containers.
  * 🔗 [Guia oficial de instalação do Docker](https://docs.docker.com/engine/install/)
  * 🔗 [Guia oficial de instalação do Docker Compose](https://docs.docker.com/compose/install/) (já incluído no Docker Desktop para Windows/Mac)
* **Node.js:** Recomendada a versão 20 ou superior. *Necessário apenas para rodar a suíte de testes localmente e gerar a tipagem do Prisma.*
  * 🔗 [Guia oficial de instalação do Node.js](https://nodejs.org/en/download/package-manager)

---

## 🔧 Como Executar a Aplicação (Docker)

O foco principal de execução desta aplicação é via **Docker**. O `docker-compose` irá subir dois containers: um para a API e outro para o banco de dados MySQL.

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd DESAFIO_AWS_AI_FDE_FULLSTACK
    ```

2.  **Configure as variáveis de ambiente:**
    Renomeie o arquivo `.env.example` na raiz do projeto para `.env`. Ele já contém a URL de conexão com o banco e a porta configurada para rodar a aplicação local.

3.  **Suba os containers:**
    Na raiz do projeto, execute:
    ```bash
    docker compose up -d --build
    ```
    *A API via Docker estará acessível em `http://localhost:3000`.* O banco de dados estará rodando internamente na porta `3306`.

---

## 🧪 Como Executar a Aplicação Localmente e Rodar os Testes

### Passos para execução local:

1.  **Instale as dependências localmente:**
    ```bash
    npm install
    ```

2.  **Gere o Prisma Client:**
    Necessário para criar a tipagem do banco de dados na sua máquina local, permitindo que os testes e a IDE reconheçam os modelos.
    ```bash
    npx prisma generate
    ```

3.  **Inicie a aplicação:**
    Como o arquivo `.env` está configurado com `PORT=3001`, a aplicação local não entrará em conflito com o Docker (que usa a porta 3000).
    ```bash
    npm run dev
    ```

### Como rodar os testes:

O projeto utiliza `Vitest` em conjunto com mocks do Prisma, logo, os testes de unidade e integração **não afetam e não dependem do banco de dados real**.

* **Executar todos os testes:**
  ```bash
  npm test

*Para ver a interface visual de testes do Vitest (opcional), você pode rodar `npx vitest --ui`.*

## 📚 Documentação da API (Swagger)

A aplicação possui uma documentação interativa via Swagger.
Com a aplicação rodando via Docker, acesse no seu navegador:

👉 **`http://localhost:3000/docs`**

*(Se estiver rodando a aplicação localmente sem o Docker, acesse `http://localhost:3001/docs`)*

### Endpoints

* **health check**

| action | endpoint | HTTP method |
| :--- | :--- | :--- |
| get api status | {base_url}/health | GET |

* **directors routes**

| action | endpoint | HTTP method |
| :--- | :--- | :--- |
| create director | {base_url}/directors | POST |
| get all directors | {base_url}/directors | GET |
| get director by id | {base_url}/directors/:id | GET |
| update director | {base_url}/directors/:id | PUT |
| delete director | {base_url}/directors/:id | DELETE |
| get movies from director | {base_url}/directors/:id/movies | GET |

* **movies routes**

| action | endpoint | HTTP method |
| :--- | :--- | :--- |
| create movie | {base_url}/movies | POST |
| get all movies | {base_url}/movies | GET |
| get movie by id | {base_url}/movies/:id | GET |
| update movie | {base_url}/movies/:id | PUT |
| delete movie | {base_url}/movies/:id | DELETE |

### Payloads

* POST /directors
* PUT /directors/:id
* POST /movies
* PUT /movies/:id

---

## 📂 Arquitetura e Padrões

* **Controllers:** Requisições e respostas HTTP.
* **Services:** Regras de negócio e validações.
* **Repositories:** Consultas ao banco de dados (Prisma).
* **Middlewares:** Validação de dados e logs.
* **Interfaces:** Tipagem TypeScript e erros customizados.

**Desenvolvido por Joel Feitosa da Silva.**