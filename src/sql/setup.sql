-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Remover tabelas existentes (ordem importa por causa das foreign keys)
DROP TABLE IF EXISTS public.financial_transactions CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.bank_accounts CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.quotations CASCADE;
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.customer_interactions CASCADE;
DROP TABLE IF EXISTS public.inventory_movements CASCADE;
DROP TABLE IF EXISTS public.purchase_orders CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.service_orders CASCADE;
DROP TABLE IF EXISTS public.production_orders CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.payroll CASCADE;
DROP TABLE IF EXISTS public.timesheet CASCADE;
DROP TABLE IF EXISTS public.training CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;

-- Tabelas base do sistema
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'basic',
    active BOOLEAN DEFAULT true,
    max_users INTEGER DEFAULT 5,
    current_users INTEGER DEFAULT 0,
    cnpj TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    company_id UUID REFERENCES public.companies(id),
    department TEXT,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_users INTEGER NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. Gestão Financeira
CREATE TABLE public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    branch_number TEXT NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    type TEXT NOT NULL, -- receita/despesa
    category TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status TEXT NOT NULL,
    description TEXT,
    bank_account_id UUID REFERENCES public.bank_accounts(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    department TEXT NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    actual_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Gestão de Vendas e CRM
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- PF/PJ
    document TEXT NOT NULL, -- CPF/CNPJ
    email TEXT,
    phone TEXT,
    address TEXT,
    segment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    customer_id UUID REFERENCES public.customers(id),
    status TEXT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    valid_until DATE,
    items JSONB NOT NULL,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    customer_id UUID REFERENCES public.customers(id),
    start_date DATE NOT NULL,
    end_date DATE,
    value DECIMAL(15,2) NOT NULL,
    status TEXT NOT NULL,
    terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.customer_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    customer_id UUID REFERENCES public.customers(id),
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    scheduled_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Gestão de Estoque e Compras
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    category TEXT,
    unit TEXT,
    cost_price DECIMAL(15,2),
    sale_price DECIMAL(15,2),
    min_stock INTEGER,
    current_stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    name TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    supplier_id UUID REFERENCES public.suppliers(id),
    status TEXT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    expected_date DATE,
    items JSONB NOT NULL,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    product_id UUID REFERENCES public.products(id),
    type TEXT NOT NULL, -- entrada/saída
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    document_type TEXT,
    document_id UUID,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Gestão de Ordem de Serviço
CREATE TABLE public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    customer_id UUID REFERENCES public.customers(id),
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    description TEXT NOT NULL,
    scheduled_date TIMESTAMPTZ,
    completion_date TIMESTAMPTZ,
    items JSONB,
    total_amount DECIMAL(15,2),
    assigned_to UUID REFERENCES public.users(id),
    signature BYTEA,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Gestão de Produção
CREATE TABLE public.production_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    product_id UUID REFERENCES public.products(id),
    status TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    actual_cost DECIMAL(15,2),
    materials JSONB,
    steps JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gestão de RH
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    user_id UUID REFERENCES public.users(id),
    name TEXT NOT NULL,
    document TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    salary DECIMAL(15,2) NOT NULL,
    hire_date DATE NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    employee_id UUID REFERENCES public.employees(id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    base_salary DECIMAL(15,2) NOT NULL,
    benefits JSONB,
    deductions JSONB,
    net_salary DECIMAL(15,2) NOT NULL,
    payment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.timesheet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    employee_id UUID REFERENCES public.employees(id),
    date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    break_start TIMESTAMPTZ,
    break_end TIMESTAMPTZ,
    total_hours DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL,
    participants JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Gestão Fiscal
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    type TEXT NOT NULL, -- NF-e, NFS-e, NFC-e
    number TEXT NOT NULL,
    series TEXT,
    customer_id UUID REFERENCES public.customers(id),
    items JSONB NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) NOT NULL,
    status TEXT NOT NULL,
    issue_date TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir planos padrão
INSERT INTO public.plans (name, type, price, max_users, features) VALUES
    ('Básico', 'basic', 99.90, 5, '["Gestão Financeira Básica", "Vendas", "Estoque Básico"]'::jsonb),
    ('Profissional', 'professional', 199.90, 10, '["Gestão Financeira Completa", "CRM", "Estoque Avançado", "OS", "RH Básico"]'::jsonb),
    ('Empresarial', 'enterprise', 399.90, 20, '["Todos os Módulos", "API", "Suporte 24/7", "Personalização"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Configurar permissões
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Criar políticas de segurança básicas
CREATE POLICY company_isolation_policy ON public.users
    FOR ALL
    TO authenticated
    USING (company_id = auth.uid() OR role = 'superadmin');

-- Função para verificar se é superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users
        WHERE id = auth.uid()
        AND role = 'superadmin'
    );
$$; 