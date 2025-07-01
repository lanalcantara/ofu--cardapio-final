-- Criar tabelas no Supabase
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url TEXT,
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT,
  observations TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Inserir produtos exemplo
INSERT INTO products (name, description, price, category, popular) VALUES
('Bolo de Chocolate Gourmet', 'Bolo de chocolate com recheio de brigadeiro e cobertura de ganache', 45.00, 'bolos', true),
('Brigadeiros Gourmet', 'Brigadeiros artesanais com diversos sabores (caixa com 12 unidades)', 24.00, 'doces', true),
('Bolo Red Velvet', 'Bolo aveludado com cream cheese e frutas vermelhas', 50.00, 'bolos', false),
('Beijinhos Premium', 'Beijinhos de coco com leite condensado (caixa com 12 unidades)', 22.00, 'doces', false);

-- Remover os cookies exemplo e adicionar os cookies reais do cardápio

-- Limpar cookies antigos
DELETE FROM products WHERE category = 'cookies';

-- Inserir cookies individuais com preços corretos
INSERT INTO products (name, description, price, category, popular) VALUES
('Cookie OREO', 'Cookie tradicional de baunilha com pedaços de biscoito oreo e pedaços de chocolate branco', 16.00, 'cookies', true),
('Cookie MARACUJÁ', 'Cookie massa de cacau 100% com gotas de chocolate 40% e recheio de brigadeiro de maracujá', 15.00, 'cookies', false),
('Cookie BRANCO', 'Cookie tradicional de baunilha com gotas de chocolate branco', 16.00, 'cookies', false),
('Cookie TRADICIONAL', 'Cookie tradicional de baunilha com gotas de chocolate 40%', 15.00, 'cookies', true),
('Cookie NUTELLA', 'Cookie tradicional de baunilha com gotas de chocolate 40%, recheado com nutella', 20.00, 'cookies', true),
('Cookie REDVELVET', 'Cookie red velvet com gotas de chocolate branco', 18.00, 'cookies', false),
('Cookie REDNINHO', 'Cookie red velvet com gotas de chocolate branco, recheado com brigadeiro de ninho', 18.00, 'cookies', false),
('Cookie CACAU', 'Cookie tradicional de baunilha com gotas de chocolate 40% e recheio de brigadeiro de maracujá', 19.00, 'cookies', false);

-- Inserir combos de cookies
INSERT INTO products (name, description, price, category, popular) VALUES
('KIT 3 COOKIES TRADICIONAIS', 'Escolha entre: Cookie de cacau, cookie chocolate branco, cookie tradicional e cookie redvelvet', 45.00, 'cookies', false),
('KIT 3 COOKIES ESPECIAIS', 'Escolha entre: cookie redninho, cookie Oreo, cookie maracujá e cookie nutella', 54.00, 'cookies', false),
('KIT 3 COOKIES MISTOS', 'Escolha qualquer sabor do nosso cardápio', 50.00, 'cookies', true);

ALTER TABLE products ADD COLUMN subcategory VARCHAR(50);

UPDATE products SET subcategory = 'cookies' WHERE category = 'cookies';
UPDATE products SET category = 'doces' WHERE subcategory = 'cookies';

UPDATE products SET subcategory = 'brigadeiros' WHERE name LIKE '%Brigadeiro%';
UPDATE products SET subcategory = 'outros' WHERE category = 'doces' AND subcategory IS NULL;
