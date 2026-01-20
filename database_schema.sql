-- 1. Tabela de Produtos
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL, -- 'bolos', 'doces', 'especiais'
    subcategory TEXT,       -- 'brigadeiros', 'cookies', 'outros'
    image_url TEXT,
    popular BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true
);

-- 2. Tabela de Pedidos
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    observations TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Itens do Pedido (Relacionamento)
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id), -- Sem cascade para manter histórico se produto for deletado
    product_name TEXT NOT NULL,  -- Salvar nome histórico
    product_price DECIMAL(10,2) NOT NULL, -- Salvar preço histórico
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- 4. Habilitar RLS (Segurança) - Opcional, mas recomendado.
-- Por enquanto, vamos deixar liberado para leitura/escrita pública (ANON) 
-- para facilitar o desenvolvimento rápido, mas idealmente configuraríamos policies.

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
-- Permitir que qualquer um LEIA os produtos ativos
CREATE POLICY "Public Read Products" ON public.products
FOR SELECT USING (true); -- active = true filtrado no app, mas aqui liberamos todos para o admin ver

-- Permitir que o ADM (ou app) insira/atualize produtos
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

-- Pedidos (Qualquer um pode criar, Admin vê todos)
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

-- Itens do Pedido
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);


-- 5. Inserir alguns dados inicias (Seed)
INSERT INTO public.products (name, description, price, category, subcategory, popular, image_url) VALUES 
('Bolo de Cenoura', 'Com cobertura de chocolate belga cremosa', 25.00, 'bolos', null, true, 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=800'),
('Brigadeiro Gourmet', 'Chocolate 50% cacau', 5.50, 'doces', 'brigadeiros', true, 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800'),
('Cookie Clássico', 'Com gotas de chocolate', 8.00, 'doces', 'cookies', false, 'https://images.unsplash.com/photo-1499636138143-bd630f5cf446?w=800');
