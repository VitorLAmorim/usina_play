#  💪 GymApp - Sistema de Gerenciamento de Academia
Projeto desenvolvido em Ionic 8 com Angular 20 para gerenciamento de atividades de academia, com funcionalidades completas de CRUD e integração com Firebase.

Download versão com firebase: https://drive.google.com/file/d/16QXS-WsiVuqaVjyuhOZAJVlb8J9dkbOm/view?usp=sharing

Download versão sem firebase: https://drive.google.com/file/d/1VTCFKZC_d1a37SStc_qEYPTIrEY_vRu6/view?usp=sharing

🏗️ Estrutura do Projeto
🌿 Branches Disponíveis
1. Branch master
   (Projeto Base - Dados Mockados)

Características:

✅ Dados totalmente mockados em memória

✅ Funcionalidades completas de CRUD

✅ Interface básica funcional

✅ Sem persistência de dados (dados são perdidos ao recarregar)

2. Branch firebase
   (Projeto Completo - Com Integração)

Características:

🔥 Integração completa com Firebase Firestore

🎨 Melhorias visuais e de UX/UI

💾 Persistência real de dados

🔐 Autenticação de usuários

📱 Sincronização em tempo real

☁️ Backup na nuvem

## 🚀 Tecnologias Utilizadas
Ionic Framework 8

Angular 20

TypeScript

Firebase Firestore (na branch firebase)

Firebase Authentication (na branch firebase)

Ionic Components

## 📋 Funcionalidades
✅ Comuns a ambas as branches:
Cadastro de exercícios

Cadastro de usuário

Notificações*

## 🔥 Exclusivo da branch firebase:
Autenticação de usuários

Sincronização em nuvem

Backup automático


## 🛠️ Instalação e Configuração
Pré-requisitos
bash
Node.js 18+
npm 8+
Ionic CLI: npm install -g @ionic/cli
Clone e Setup
bash
cordova

# Clone o repositório
git clone https://github.com/VitorLAmorim/usina_play

# Navegue até o diretório
cd usina_play

# Instale as dependências
npm install
Para usar a branch master (dados mockados):
bash
git checkout master
ionic serve
Para usar a branch firebase (com integração):
bash
git checkout firebase
npm install

# Configure o Firebase
cp src/firebase-config.example.json src/firebase-config.json
# Edite o arquivo com suas credenciais do Firebase

ionic serve
# 🔥 Configuração do Firebase
Crie um projeto no Firebase Console

Ative o Firestore Database

Ative a Authentication (se desejar)

Copie as credenciais para src/firebase-config.json

Exemplo de config.json:

json
{
"firebase": {
"apiKey": "sua-api-key",
"authDomain": "seu-projeto.firebaseapp.com",
"projectId": "seu-projeto-id",
"storageBucket": "seu-projeto.appspot.com",
"messagingSenderId": "123456789",
"appId": "sua-app-id"
}
}
# 📱 Build para Dispositivos
bash
# Adicionar plataforma Android
ionic cordova add android

# Build para Android
npm run apk:debug

# 🤝 Contribuição
Faça o fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

# 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

# 👥 Autores
Vitor Leandro Amorim - @VitorLAmorim

# 🙋‍♂️ Suporte
Se encontrar algum problema ou tiver dúvidas:

Verifique a documentação do Ionic

Consulte os issues do GitHub

Crie um novo issue descrevendo o problema

## ⭐️ Dê uma estrela no repositório se este projeto te ajudou!
