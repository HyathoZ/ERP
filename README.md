# Sistema ERP Web

Um sistema ERP moderno e completo desenvolvido com React, TypeScript e Supabase.

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Banco de dados e autenticação)
- React Query
- React Router DOM
- Zustand (Gerenciamento de estado)
- React Hook Form
- Zod (Validação)

## Funcionalidades

- ✅ Autenticação de usuários
- ✅ Dashboard com métricas importantes
- ✅ Gerenciamento de clientes
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de pedidos
- ✅ Configurações do sistema
- ✅ Interface responsiva e moderna

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## Configuração

1. Clone o repositório:

```bash
git clone https://seu-repositorio/erp-web.git
cd erp-web
```

2. Instale as dependências:

```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:

- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis com suas credenciais do Supabase

4. Inicie o servidor de desenvolvimento:

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

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
