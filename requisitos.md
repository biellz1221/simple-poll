#Sistema de Cadastro de Enquetes

-   Usuário não necessita logar para responder
-   Pode aceitar respostas únicas por e-mail
-   Administrador deve poder cadastrar enquetes
-   Cada enquete deve ter seu próprio conjunto de opções
-   Deve ser possível adicionar uma opção "Outro" para que o usuário digite
-   O Administrador deve poder ver os resultados da enquete em forma de relatório
-   Deve ser possível a enquete estar "aberta" ou "fechada"
-   Usuário administrador só pode ter acesso aos dados das enquetes que ele mesmo criou
-   Uma vez criada a enquete, caso já haja votos, não será possível alterar as opções

#Rotas

-   [OK] [Post] Create User
-   [OK] [Post] Login User
-   [OK] [Post] Logout User
-   [OK] [Post] Logout All User Sessions
-   [OK] [Post] Create Poll
-   [Post] Vote
-   [Patch] Edit Poll
-   [OK] [Delete] Delete User
-   [OK] [Delete] Delete Poll
-   [OK] [Get] All Polls By User
-   [OK] [Get] Poll by Id

#Páginas

-   Login
-   Single Enquete para Votar (front)
-   Lista de Enquetes (auth)
-   Single Enquete (auth)
-   Cadastro de Enquete (auth)

#Entidades

-   Poll

    -   id: string
    -   name: string
    -   slug: string (slugify name)
    -   created: date
    -   createdBy: string => currentUser.id
    -   userCanType?: boolean
    -   totalVotes?: number
    -   options: object[]

-   Poll Option

    -   id: string
    -   text: string
    -   votes?: number
    -   order?: number

-   User

    -   id: string
    -   name: string
    -   email: string
    -   password: string
    -   tokens: string[]
