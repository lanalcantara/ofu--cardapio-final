import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Atualizar o tipo Product para incluir cookies
export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  subcategory?: string
  image_url?: string
  popular: boolean
  active: boolean
}

export type Order = {
  id: string
  customer_name: string
  customer_phone: string
  customer_address?: string
  observations?: string
  total_amount: number
  status: string
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
}
