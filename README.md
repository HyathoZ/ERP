# ERP System

Um sistema ERP moderno e completo desenvolvido com React e TypeScript.

## Tecnologias Principais

- React
- TypeScript
- Tailwind CSS
- Node.js
- PostgreSQL
- Prisma ORM

## Funcionalidades

- Autenticação e Autorização
- Gestão de Usuários
- Gestão de Empresas
- Módulo Financeiro
  - Contas bancárias
  - Transações
  - Orçamentos
- Módulo de Vendas
  - Produtos
  - Pedidos
  - Clientes

## Pré-requisitos

- Node.js 18+
- PostgreSQL
- NPM ou Yarn

## Configuração

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/erp.git
cd erp
```

2. Instale as dependências

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

4. Preencha as variáveis com suas configurações

5. Execute as migrações do banco de dados

```bash
npx prisma migrate dev
```

6. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── features/      # Funcionalidades específicas
  ├── layouts/       # Layouts da aplicação
  ├── hooks/         # Hooks personalizados
  ├── utils/         # Funções utilitárias
  ├── services/      # Serviços e APIs
  ├── types/         # Tipos TypeScript
  ├── constants/     # Constantes
  ├── assets/        # Recursos estáticos
  └── styles/        # Estilos globais
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Visualiza a build de produção localmente
- `npm run lint`: Executa o linter

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
