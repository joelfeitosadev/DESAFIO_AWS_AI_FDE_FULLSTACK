<a id="português"></a>

[Português](#português) | [English](#english)

## 🇧🇷 Português

# Movie API - Desafio AWS AI FDE Fullstack


API RESTful para gerenciamento de Filmes e Diretores, desenvolvida em **Node.js** com **TypeScript** e **Prisma ORM**.

## 📝 Descrição do Projeto

Este projeto consiste no desenvolvimento de uma **API RESTful** para o gerenciamento de uma biblioteca de filmes e seus respectivos diretores. O desafio foca na implementação de uma arquitetura robusta utilizando **Node.js, TypeScript e MySQL**, aplicando padrões de design como **Repository e Service Pattern**, além de garantir a integridade dos dados e a qualidade do código através de **testes automatizados (TDD)** e conteinerização com **Docker**.

### Principais Objetivos:

* **CRUD Completo:** Gerenciamento de filmes e diretores com persistência em banco de dados relacional.
* **Regras de Negócio:** Validações de integridade, como impedir a exclusão de diretores vinculados a filmes e restrições de unicidade.
* **Qualidade Técnica:** Tipagem estática, tratamento global de erros, documentação automatizada (Swagger) e ambiente isolado via Docker Compose.

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

2.  **Suba os containers:**
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

2.  **Configure as variáveis de ambiente:**
    Renomeie o arquivo `.env.example` na raiz do projeto para `.env`. Ele já contém a URL de conexão com o banco e a porta configurada para rodar a aplicação local.


3.  **Gere o Prisma Client:**
    Necessário para criar a tipagem do banco de dados na sua máquina local, permitindo que os testes e a IDE reconheçam os modelos.
    ```bash
    npx prisma generate
    ```

4.  **Inicie a aplicação:**
    ```bash
    npm run dev
    ```
*A API estará acessível em `http://localhost:3000`.*

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


[Português](#português) | [English](#english)
<a id="english"></a>

## 🇺🇸 English

# Movie API - AWS AI FDE Fullstack Challenge

RESTful API for Movie and Director management, developed in **Node.js** with **TypeScript** and **Prisma ORM**.

---

## 📝 Project Description

This project consists of the development of a **RESTful API** to manage a library of movies and their respective directors. The challenge focuses on implementing a robust architecture using **Node.js, TypeScript, and MySQL**, applying design patterns such as **Repository and Service Pattern**, while ensuring data integrity and code quality through **automated tests (TDD)** and containerization with **Docker**.

### Main Objectives:

* **Full CRUD:** Management of movies and directors with persistent storage in a relational database.
* **Business Rules:** Integrity validations, such as preventing the deletion of directors linked to movies and uniqueness constraints.
* **Technical Quality:** Static typing, centralized global error handling, automated documentation (Swagger), and isolated environment via Docker Compose.

---

## 🚀 Technologies and Methodologies

The project was built following development best practices, focusing on maintainability, static typing, and testing.

**Technologies:**
* **Node.js & Express.js:** Application base for server creation and route management.
* **TypeScript:** Used for static typing, ensuring greater security and code predictability.
* **Prisma ORM:** Chosen for relational database modeling and migration execution.
* **MySQL:** Relational database chosen for data persistence.
* **Docker & Docker Compose:** Used for containerizing the application and database, utilizing *multi-stage builds* to optimize the final image size.
* **Vitest & Supertest:** Tools chosen for the integration and unit testing suite.
* **Swagger UI (swagger-autogen):** For automated interactive API documentation.

**Methodologies and Patterns:**
* **Clean Code:** Descriptive naming (in English) and centralized error handling (Global Middleware).
* **Repository & Service Pattern:** The application was refactored to separate responsibilities. `Controllers` handle HTTP requests, `Services` contain business rules, and `Repositories` handle direct database communication.
* **Test-Driven Development (TDD) / Unit & Integration Testing:** Creation of database mocks (`vitest-mock-extended`) to test application behavior in isolation.
* **Conventional Commits:** Standard adopted for project versioning.

---

## 📋 Prerequisites

To run this project, you will need the following tools installed. Choose the appropriate version for your operating system (Windows, macOS, or Linux) at the links below:

* **Docker & Docker Compose:** Used to run the application and database via containers.
  * 🔗 [Official Docker Installation Guide](https://docs.docker.com/engine/install/)
  * 🔗 [Official Docker Compose Installation Guide](https://docs.docker.com/compose/install/)
* **Node.js:** Version 20 or higher recommended. *Required only for running the test suite locally and generating Prisma types.*
  * 🔗 [Official Node.js Installation Guide](https://nodejs.org/en/download/package-manager)

---

## 🔧 How to Run the Application (Docker)

The primary execution method is via **Docker**. `docker-compose` will spin up two containers: one for the API and one for the MySQL database.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd DESAFIO_AWS_AI_FDE_FULLSTACK
    ```

2.  **Start the containers:**
    In the root directory, run:
    ```bash
    docker compose up -d --build
    ```
    *The Docker API will be accessible at `http://localhost:3000`.* The database will run internally on port `3306`.

---

## 🧪 How to Run Locally and Execute Tests

### Local Execution Steps:

1.  **Install dependencies locally:**
    ```bash
    npm install
    ```

2.  **Configure environment variables:**
    Rename the `.env.example` file in the root directory to `.env`. It already contains the database connection URL and the port configured for local execution.

3.  **Generate Prisma Client:**
    Necessary to create database typing on your local machine for tests and IDE recognition.
    ```bash
    npx prisma generate
    ```

4.  **Start the application:**
    Since the `.env` file is configured with `PORT=3001`, the local app will not conflict with Docker (which uses 3000).
    ```bash
    npm run dev
    ```
    *The API will be accessible at `http://localhost:3000`.*

### How to run tests:

The project uses `Vitest` with Prisma mocks, so unit and integration tests **do not affect or depend on the real database**.

* **Run all tests:**
  ```bash
  npm test

*To view the Vitest visual test interface (optional), you can run `npx vitest --ui`.*

  ## 📚 API Documentation (Swagger)

The application features interactive documentation via Swagger.
With the app running via Docker, access it in your browser:

👉 **`http://localhost:3000/docs`**

*(If running locally without Docker, access `http://localhost:3001/docs`)*

### Endpoints

* **Health Check**

| Action | Endpoint | HTTP Method |
| :--- | :--- | :--- |
| Get API status | {base_url}/health | GET |

* **Directors Routes**

| Action | Endpoint | HTTP Method |
| :--- | :--- | :--- |
| Create director | {base_url}/directors | POST |
| Get all directors | {base_url}/directors | GET |
| Get director by ID | {base_url}/directors/:id | GET |
| Update director | {base_url}/directors/:id | PUT |
| Delete director | {base_url}/directors/:id | DELETE |
| Get movies by director | {base_url}/directors/:id/movies | GET |

* **Movies Routes**

| Action | Endpoint | HTTP Method |
| :--- | :--- | :--- |
| Create movie | {base_url}/movies | POST |
| Get all movies | {base_url}/movies | GET |
| Get movie by ID | {base_url}/movies/:id | GET |
| Update movie | {base_url}/movies/:id | PUT |
| Delete movie | {base_url}/movies/:id | DELETE |

### Payloads

The documentation for request bodies (Payloads) can be found directly in the Swagger UI for:
* POST /directors
* PUT /directors/:id
* POST /movies
* PUT /movies/:id

---

## 📂 Architecture and Patterns

* **Controllers:** Handle HTTP requests and responses.
* **Services:** Contain business logic and validations.
* **Repositories:** Execute database queries (Prisma).
* **Middlewares:** Data validation and logging.
* **Interfaces:** TypeScript types/interfaces and custom error handling.

**Developed by Joel Feitosa da Silva.**