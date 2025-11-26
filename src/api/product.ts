import { http } from '@/http/http'

// 商品分类接口类型
export interface Category {
  id: number
  name: string
  icon: string
  badge: string
}

// 商品信息接口类型
export interface Product {
  id: number
  title: string
  desc: string
  price: number
  image: string
  badge: string
}

// 商品分组接口类型
export interface ProductGroup {
  id: number
  name: string
  items: Product[]
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 获取所有商品分类
 */
export function getCategories(): Promise<Category[]> {
  return http.get<Category[]>('/api/categories')
}

/**
 * 获取所有商品（按分组）
 */
export function getProductGroups(): Promise<ProductGroup[]> {
  return http.get<ProductGroup[]>('/api/products')
}

/**
 * 根据分类ID获取商品
 * @param categoryId 分类ID
 */
export function getProductsByCategory(categoryId: number): Promise<Product[]> {
  return http.get<Product[]>(`/api/products/category/${categoryId}`)
}

/**
 * 搜索商品
 * @param keyword 搜索关键词
 */
export function searchProducts(keyword: string): Promise<ProductGroup[]> {
  return http.get<ProductGroup[]>('/api/products/search', { keyword })
}

/**
 * 获取商品详情
 * @param productId 商品ID
 */
export function getProductDetail(productId: number): Promise<Product> {
  return http.get<Product>(`/api/products/${productId}`)
}

/**
 * 获取热门商品
 */
export function getPopularProducts(): Promise<Product[]> {
  return http.get<Product[]>('/api/products/popular')
}
