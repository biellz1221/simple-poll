#Sistema de Cadastro de Enquetes

-   [OK] Usuário não necessita logar para responder
-   Pode aceitar respostas únicas por e-mail
-   [OK] Usuário Logado deve poder cadastrar enquetes
-   [OK] Cada enquete deve ter seu próprio conjunto de opções
-   [OK] Deve ser possível adicionar uma opção "Outro" para que o usuário digite
-   O usuário logado deve poder ver os resultados da enquete em forma de relatório
-   [OK] Deve ser possível a enquete estar "aberta" ou "fechada"
-   [OK] Usuário logado só pode ter acesso aos dados das enquetes que ele mesmo criou
-   [OK] Uma vez criada a enquete, caso já haja votos, não será possível alterar as opções

#Rotas

-   [OK] [Post] Create User
-   [OK] [Post] Login User
-   [OK] [Post] Logout User
-   [OK] [Post] Logout All User Sessions
-   [OK] [Post] Create Poll
-   [OK] [Patch] Vote
-   [OK] [Patch] Edit Poll
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
    -   created: date (in milliseconds)
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
