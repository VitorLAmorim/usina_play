# Usina Play

Este projeto foi atualizado para utilizar o Firebase para autenticação e armazenamento de dados.

## Funcionalidades Implementadas

### Autenticação Firebase
- Login de usuários
- Registro de novos usuários
- Logout

### Banco de Dados Firebase (Firestore)
- Armazenamento de dados de usuários
- Armazenamento de notificações
- Armazenamento de programas de treino

## Estrutura do Projeto

### Serviços

- **AuthService**: Gerencia autenticação de usuários com Firebase
- **UserService**: Interface para gerenciamento de usuários (utiliza AuthService)
- **NotificationService**: Implementa operações CRUD para notificações
- **ProgramService**: Implementa operações CRUD para programas de treino

### Componentes

- **TestComponent**: Componente para testar a funcionalidade do Firebase

## Como Testar

1. Execute o aplicativo
2. Navegue para `/test` no navegador
3. Clique no botão "Run Tests" para executar os testes do Firebase
4. Verifique os resultados no console do navegador

## Inicialização de Dados

O aplicativo inicializa automaticamente o Firebase com dados de exemplo quando é iniciado pela primeira vez. Isso garante que haja dados disponíveis para demonstração.

## Coleções do Firestore

- **users**: Armazena informações dos usuários
- **notifications**: Armazena notificações do sistema
- **slides**: Armazena informações sobre os programas de treino

## Configuração do Firebase

Mude o nome do arquivo firebase-config.example.ts para firebase-config.ts e adicione as chaves relativas ao firebase
