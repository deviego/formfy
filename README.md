# FormFy - Construtor de Formulários Dinâmicos

Uma aplicação web moderna para criar e gerenciar formulários dinâmicos com lógica condicional, construída com Next.js, TypeScript, TailwindCSS e Shadcn/UI.

## 🌐 Demo Online

**Acesse o projeto em produção:** [https://formfy.vercel.app](https://formfy.vercel.app)

> A aplicação está hospedada na Vercel com todas as funcionalidades disponíveis. Não é necessário configuração local para usar o sistema.

## 📋 Funcionalidades

- � **Criação Dinâmica de Formulários**: Crie formulários com múltiplos tipos de perguntas
- 📝 **Tipos de Perguntas**: Suporte para Sim/Não, Múltipla Escolha, Escolha Única, Texto Livre, Números Inteiros e Decimais
- 📧 **Integração de Email**: Configure emails de destino para receber respostas via Resend API
- 🔗 **URLs Compartilháveis**: Gere URLs únicas para distribuição de formulários
- 💾 **Armazenamento Local**: Persistência de dados usando localStorage do navegador
- 📱 **Design Responsivo**: Interface amigável para dispositivos móveis
- ✅ **Validação em Tempo Real**: Validação de campos com feedback visual
- 🎨 **Interface Moderna**: UI construída com Shadcn/UI e TailwindCSS

## 🚀 Como Usar (Versão Online)

### 1. Criando um 


1. Acesse [https://formfy-roan.vercel.app](https://formfy-roan.vercel.app)
2. Clique em **"Novo Formulário"**
3. Preencha os detalhes do formulário:
   - **Título**: Nome do seu formulário
   - **Descrição**: Breve descrição do propósito do formulário
   - **Email de Destino**: Endereço de email para receber as respostas
4. Adicione perguntas selecionando o tipo e preenchendo os detalhes
5. Para perguntas de Múltipla/Única Escolha, adicione as opções de resposta
6. Marque perguntas como obrigatórias se necessário
7. Salve o formulário

### 2. Compartilhando um Formulário

1. Na página inicial, clique no botão **Compartilhar** em qualquer formulário
2. A URL compartilhável será copiada para sua área de transferência
3. o link do formulário deve ser aberto no mesmo navegador pos está sendo salvo em localstorage  - mas adicionando um armazenamento externo é possível compartilhar

### 3. Respondendo um Formulário

1. Acesse o formulário via URL compartilhada no mesmo navegador
2. Opcionalmente forneça seu email para acompanhamento
3. Responda todas as perguntas (obrigatórias marcadas com \*)
4. Envie o formulário

### 4. Gerenciando Formulários

- **Visualizar**: Clique no ícone do olho para pré-visualizar/preencher um formulário
- **Compartilhar**: Clique no ícone de compartilhar para copiar a URL do formulário
- **Excluir**: Clique no ícone da lixeira para remover um formulário

## 🛠️ Tipos de Perguntas Suportados

- **Sim/Não**: Perguntas booleanas com botões de rádio
- **Escolha Única**: Seleção com botões de rádio de opções predefinidas
- **Múltipla Escolha**: Seleção com checkboxes permitindo múltiplas respostas
- **Texto Livre**: Área de texto aberta para respostas detalhadas
- **Número Inteiro**: Entrada numérica para números inteiros
- **Número Decimal**: Entrada numérica para valores decimais

---

## 💻 Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/formfy.git
   cd formfy
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto:

   ```env
   RESEND_API_KEY=sua_chave_da_api_resend
   ```

4. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

5. **Abra o navegador**

   Navegue para [http://localhost:3000](http://localhost:3000)

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Build
npm run build        # Constrói a aplicação para produção
npm start           # Inicia o servidor de produção

# Qualidade de código
npm run lint        # Executa o linter
npm run type-check  # Verifica tipos TypeScript
```

## 🏗️ Stack Tecnológica

- **Frontend**: Next.js 15 com App Router
- **Estilização**: TailwindCSS + Shadcn/UI
- **Linguagem**: TypeScript
- **Email**: Resend API
- **Armazenamento**: localStorage (simulação de backend)
- **Ícones**: Lucide React
- **Deploy**: Vercel

## 📁 Estrutura do Projeto

```
formfy/
├── src/
│   ├── app/                    # Páginas do Next.js App Router
│   │   ├── api/
│   │   │   └── send-form-response/  # API para envio de emails
│   │   ├── forms/
│   │   │   ├── create/         # Página de criação de formulários
│   │   │   └── [id]/           # Página de visualização/resposta
│   │   ├── globals.css         # Estilos globais
│   │   ├── layout.tsx          # Layout raiz
│   │   └── page.tsx            # Página inicial
│   ├── components/
│   │   ├── forms/              # Componentes específicos de formulários
│   │   │   ├── FormCard.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   ├── QuestionRenderer.tsx
│   │   │   └── ...
│   │   └── ui/                 # Componentes Shadcn/UI
│   ├── hooks/                  # Hooks customizados
│   │   ├── useForms.ts
│   │   ├── useFormCreation.ts
│   │   └── useFormResponse.ts
│   ├── services/               # Camada de serviços
│   │   └── formService.ts
│   ├── utils/                  # Utilitários
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── lib/
│   │   ├── storage.ts          # Utilitários localStorage
│   │   └── utils.ts            # Utilitários gerais
│   └── types/
│       └── form.ts             # Interfaces TypeScript
├── components.json             # Configuração Shadcn/UI
├── tailwind.config.ts          # Configuração TailwindCSS
└── README.md
```

## 🔧 Configuração de Email

O sistema utiliza a [Resend API](https://resend.com) para envio de emails. Para configurar:

1. Crie uma conta em [resend.com](https://resend.com)
2. Obtenha sua chave da API
3. Configure a variável de ambiente `RESEND_API_KEY`

## 📊 Armazenamento de Dados

Atualmente, a aplicação usa localStorage do navegador para simular um backend. Os dados são armazenados como objetos JSON:

```typescript
// Estrutura do Formulário
interface Form {
  id: string;
  title: string;
  description: string;
  order: number;
  destinationEmail: string;
  questions: Question[];
}

// Estrutura da Resposta
interface FormResponse {
  id: string;
  formId: string;
  respondentEmail?: string;
  responseDate: string;
  answers: {
    questionId: string;
    answer: string | string[] | number | boolean;
  }[];
}
```

## 🚀 Deploy na Vercel

1. **Fork o repositório** no GitHub
2. **Conecte com a Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe o projeto do GitHub
   - Configure a variável de ambiente `RESEND_API_KEY`
3. **Deploy automático**: A Vercel fará o deploy automaticamente

## 🔮 Melhorias Futuras

- 🔐 Autenticação e autorização de usuários
- 🌐 Integração com backend real (Prisma + PostgreSQL)
- 📊 Análise e relatórios de respostas
- 🎨 Temas customizados e branding
- 📤 Exportação de respostas para CSV/Excel
- 🔔 Notificações por email para novas respostas
- 🔀 Lógica condicional avançada (operadores AND/OR)
- 📋 Templates de formulários
- 🔍 Busca e filtragem de formulários
- 🗂️ Categorias e organização de formulários

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Arquitetura e Boas Práticas

O projeto foi refatorado seguindo os princípios SOLID:

- **S** - Single Responsibility: Cada componente tem uma única responsabilidade
- **O** - Open/Closed: Componentes abertos para extensão, fechados para modificação
- **L** - Liskov Substitution: Interfaces bem definidas e intercambiáveis
- **I** - Interface Segregation: Interfaces específicas e focadas
- **D** - Dependency Inversion: Dependências invertidas através de hooks e services

### Principais Melhorias Aplicadas:

- ✅ **Componentização**: Quebra de componentes grandes em menores e reutilizáveis
- ✅ **Hooks Customizados**: Separação da lógica de estado dos componentes
- ✅ **Service Layer**: Isolamento da lógica de negócio
- ✅ **Validação Centralizada**: Utilitários de validação reutilizáveis
- ✅ **TypeScript Rigoroso**: Tipagem forte em toda a aplicação

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

## 🆘 Suporte

Para suporte ou dúvidas, abra uma issue no repositório do GitHub.
