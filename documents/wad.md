# Web Application Document - Projeto Individual - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final._**

## Project Name
TMO - Task Matrix Organizer

#### Project Author
Lucas Michel Pereira

## Table of Contents

1. [Introduction](#c1)  
2. [Overview of the Web Application](#c2)  
3. [Technical Design of the Web Application](#c3)  
4. [Web Application Development](#c4)  
5. [References](#c5)  

<br>

## <a name="c1"></a>1. Introduction (semana 3)

<!-- *Preencha com até 300 palavras – sem necessidade de fonte.*

*Descreva brevemente o sistema que você irá desenvolver.* -->

This document aims to formalize the ideation process, creation, and final form of the web application **"TMO - Task Matrix Organizer"**, developed as an individual practical project for the web development module at the **Institute of Technology and Leadership (Inteli)**. The goal of the project is to build a functional and appealing web application that integrates a database, backend, and frontend, applying modern development concepts and methodologies.

The **TMO** system was designed to offer an effective solution for **personal task management**, with strong emphasis on organization and customization, always aiming to continuously optimize user productivity and comfort.

Among the many challenges presented by a project of this complexity are the following:
- Effective use and deep understanding of databases.
- Creating a pleasant and intuitive frontend for users.
- Adding visual and/or subconscious cues for all possible user actions — that is, avoiding the need for an extensive tutorial just to use the application.
- Ideating and implementing features that help users achieve their goals.

Additionally, the development of **TMO** aims to apply solid software engineering practices, with every design and technology decision made to create a secure, scalable, and easily maintainable system.

This document will detail the entire journey of building the system, including the definition of the main persona, requirements gathering, solution architecture, technologies used, and navigation flows.

Finally, a plan for future improvements will also be presented to ensure that **TMO** can continue evolving and meet new user demands.

---

## <a name="c2"></a>2. Overview of the Web Application

### 2.1. Personas

<!-- *Posicione aqui suas Personas em forma de texto markdown com imagens, ou como imagem de template preenchido. Atualize esta seção ao longo do módulo se necessário.* -->

<div align="center">
  <sub>FIGURE 1 - Persona </sub><br>
  <img src= "../assets/persona.png" width="100%"
  alt="Persona"><br>
  <sup>Source: Material created by the author, profile image made using https://picrew.me/en/image_maker/2435758, 2025</sup>
</div>

### 2.2. User Stories

<!-- *Posicione aqui a lista de User Stories levantadas para o projeto. Siga o template de User Stories e utilize a mesma referência USXX no roadmap de seu quadro Kanban. Indique todas as User Stories mapeadas, mesmo aquelas que não forem implementadas ao longo do projeto. Não se esqueça de explicar o INVEST das 5 User Stories prioritárias.* -->

**US01** | As a university student, I want to organize my tasks in the way I find best — whether by urgency, date, or other custom categories — so I don't waste time recalling each one and organizing them mentally.
The user story above is:

- **I – Independent** because the ability to organize tasks by different criteria can be implemented without directly depending on other functionalities.

- **N – Negotiable** because there are different ways to implement this organization, such as a simple list, filters, or even dragging tasks (drag-and-drop), providing great flexibility for its implementation.

- **V – Valuable** because it directly addresses the pain points of the persona (Isabela), allowing users to organize their tasks in a more efficient, personalized, and complete way.

- **E – Estimable** because it is clear enough to estimate the effort needed to implement functionalities such as creating filters, allowing customization, and saving these preferences.

- **S – Small** because it is small enough to be developed in a short period of time, but still significant enough to add value.

- **T – Testable** because it’s possible to create tests to validate that the user can organize tasks by the defined criteria and that these preferences are applied correctly.

**US02** | As a university student, I want to be able to break down large tasks into subtasks so that I can more easily track their progress and avoid delays.

**US03** | As a university student, I want to visualize my progress for the day/week compared to what was planned so that I don’t feel unmotivated or lost.

---

## <a name="c3"></a>3. Technical Design of the Web Application

### 3.1. Modelagem do banco de dados  (Semana 3)

*Posicione aqui os diagramas de modelos relacionais do seu banco de dados, apresentando todos os esquemas de tabelas e suas relações. Utilize texto para complementar suas explicações, se necessário.*

*Posicione também o modelo físico com o Schema do BD (arquivo .sql)*

<div align="center">
  <sub>FIGURE 2 - Relational database model </sub><br>
  <img src= "../assets/modelo-banco.png" width="100%"
  alt="Relational database model"><br>
  <sup>Source: Diagram created by the author using dbdiagram.io, 2025</sup>
</div>

<div align="center">
  <sub>FIGURE 3 - Database's code </sub><br>
  <img src= "../assets/databaseCode.png" width="80%"
  alt="Database's code"><br>
  <sup>Source: Material created by the author, 2025</sup>
</div>

This database schema is designed to support a collaborative, visual workspace application. It manages users, work areas, access control, and visual elements like shapes or annotations that users can place in different areas. All primary keys use UUIDs to ensure global uniqueness and scalability.

#### **1. users Table**

- **Purpose:** Stores information about each user in the system.

- **Fields:**

  - *id:* Unique identifier (UUID).
  - *username:* Display name of the user.
  - *email:* Unique email address used for login.
  - *password:* Hashed user password.
  - *created_at:* Timestamp of when the user account was created.

- **Relationships:**

  - One user can own multiple areas *(areas.owner_id)*.
  - Users can be granted access to multiple areas through the *user_area* table.

#### **areas Table**

- **Purpose:** Represents a workspace or canvas where users can collaborate and place elements.

- **Fields:**

  - *id:* Unique identifier (UUID).
  - *title:* Name of the area.
  - *description:* Optional description of the area.
  - *owner_id:* The users.id of the area creator.
  - *is_private:* Boolean flag indicating if the area is private.
  - *created_at:* Timestamp of area creation.

- **Relationships:**

  - Each area is owned by one user *(owner_id → users.id)*.
  - An area can have many users with access through *user_area*.
  - An area can contain multiple visual elements *(elements.area_id)*.

#### **user_area Table**

- **Purpose:** Defines a many-to-many relationship between users and areas. Allows multiple users to access and collaborate on an area.

- **Fields:**

  - *id:* Unique identifier (UUID).
  - *user_id:* Foreign key to users.id.
  - *area_id:* Foreign key to areas.id.

- **Relationships:**

  - Connects a user to an area they have access to.
  - One user can be connected to many areas.
  - One area can be accessed by many users.

#### **element_types Table**

- **Purpose:** Catalog of possible types of visual elements (e.g., box, arrow, sticky note).

- **Fields:**

  - *id:* Unique identifier (UUID).
  - *title:* Name of the element type (e.g., "box", "arrow", etc).

- **Relationships:**

  - One element type can be used by many elements in different areas.

#### **elements Table**

- **Purpose:** Stores the actual elements placed inside an area (e.g., a specific box or arrow).

- **Fields:**

  - *id:* Unique identifier (UUID).
  - *type_id:* Foreign key to element_types.id.
  - *area_id:* Foreign key to areas.id.
  - *created_at:* Timestamp of when the element was created.

- **Relationships:**

  - Each element belongs to one area (area_id → areas.id).
  - Each element has one type (type_id → element_types.id).

#### **Entity Relationship Summary**

```
users   1 ────<   areas
users   1 ────<   user_area   >──── 1   areas
areas   1 ────<   elements
element_types   1 ────<   elements
```

**This structure enables:**

- Secure user management.
- Collaborative areas where multiple users can contribute.
- Typed visual elements in each workspace.
- Fine-grained access control through user_area.

### 3.1.1 BD e Models (Semana 5)
*Descreva aqui os Models implementados no sistema web*

### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

**Instruções para criação do diagrama de arquitetura**  
- **Model**: A camada que lida com a lógica de negócios e interage com o banco de dados.
- **View**: A camada responsável pela interface de usuário.
- **Controller**: A camada que recebe as requisições, processa as ações e atualiza o modelo e a visualização.
  
*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

### 3.3. Wireframes

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*

#### 3.4.1. Cores

*Apresente aqui a paleta de cores, com seus códigos de aplicação e suas respectivas funções.*

#### 3.4.2. Tipografia

*Apresente aqui a tipografia da solução, com famílias de fontes e suas respectivas funções.*

#### 3.4.3. Iconografia e imagens 

*(esta subseção é opcional, caso não existam ícones e imagens, apague esta subseção)*

*Posicione aqui imagens e textos contendo exemplos padronizados de ícones e imagens, com seus respectivos atributos de aplicação, utilizadas na solução.*

### 3.5. Protótipo de alta fidelidade

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 5)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação (Semana 7)

*Descreva e ilustre aqui o desenvolvimento do frontend do sistema web, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

---

## <a name="c4"></a>4. Web Application Development (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*

---

## <a name="c5"></a>5. References

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

---
---