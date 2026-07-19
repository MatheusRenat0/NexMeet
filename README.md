# NexMeet

<p align="center">
  <strong>Uma plataforma moderna para gerenciamento de reservas de salas de reunião.</strong>
</p>

<p align="center">
  Desenvolvido com <strong>FastAPI</strong>, <strong>Vue.js</strong> e <strong>Docker</strong>, o NexMeet foi criado para simular uma aplicação corporativa real, aplicando conceitos modernos de arquitetura de software, DevOps e desenvolvimento Full Stack.
</p>

---

## Sobre o projeto

O **NexMeet** é uma plataforma web desenvolvida para simplificar o gerenciamento de salas de reunião em ambientes corporativos.

A aplicação permite que colaboradores consultem a disponibilidade das salas e realizem reservas de forma rápida e intuitiva, enquanto administradores gerenciam usuários, ambientes e acompanham indicadores por meio de dashboards e relatórios.

Mais do que um sistema de reservas, o NexMeet é um projeto de portfólio criado para aplicar boas práticas de engenharia de software, arquitetura de sistemas e infraestrutura moderna, simulando um ambiente de produção.

---

## Funcionalidades

* Autenticação com JWT
* Controle de acesso baseado em perfis (RBAC)
* Gerenciamento de usuários
* Cadastro e gerenciamento de salas
* Sistema de reservas com validação de conflitos
* Calendário de reservas
* Dashboard executivo
* Geração de relatórios em PDF e Excel
* Sistema de notificações
* Auditoria de operações
* Interface responsiva

---

## Tecnologias

### Front-end

* Vue.js 3
* Vite
* Pinia
* Vue Router
* Axios
* Tailwind CSS
* Chart.js
* FullCalendar

### Back-end

* Python
* FastAPI
* SQLAlchemy
* Alembic
* Pydantic

### Banco de Dados

* PostgreSQL

### Infraestrutura

* Docker
* Docker Compose
* Nginx

### Serviços

* Redis
* RabbitMQ
* Celery

---

## Arquitetura

```text
                 Nginx
                   │
      ┌────────────┴────────────┐
      │                         │
   Frontend                 Backend
    Vue.js                  FastAPI
      │                         │
      └────────────┬────────────┘
                   │
              PostgreSQL
                   │
         Redis • RabbitMQ
```

---

## Estrutura do Repositório

```text
nexmeet/
│
├── backend/
├── frontend/
├── docs/
├── infrastructure/
├── .github/
│
├── docker-compose.yml
├── README.md
├── LICENSE
└── .env.example
```

---

## Documentação

Toda a documentação do projeto estará organizada na pasta **docs**, separada por áreas para facilitar a consulta e manutenção.

* Visão do Produto
* Requisitos Funcionais
* Requisitos Não Funcionais
* Regras de Negócio
* Arquitetura do Sistema
* Modelagem do Banco de Dados
* Documentação da API
* Infraestrutura
* Deploy
* Interface da Aplicação
* Roadmap
* Decisões de Arquitetura (ADR)

---

## Objetivos

Este projeto tem como objetivo consolidar conhecimentos em:

* Desenvolvimento Full Stack
* Arquitetura em Camadas
* APIs REST
* Docker e Conteinerização
* PostgreSQL
* Processamento Assíncrono
* Controle de Acesso (RBAC)
* DevOps
* CI/CD
* Escalabilidade
* Boas Práticas de Engenharia de Software

---

## Estrutura da Documentação

```text
docs/
├── 01-product/
├── 02-requirements/
├── 03-architecture/
├── 04-database/
├── 05-api/
├── 06-infrastructure/
├── 07-ui/
└── 08-decisions/
```

