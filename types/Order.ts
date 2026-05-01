export interface CartItem {
    productId: string
    quantity: number
    price: number
    name: string
}

export interface Order {
    id: string
    orderId: string
    userId: string
    userName: string
    userEmail: string
    items: CartItem[]
    subtotal: number
    tax: number
    shippingCost: number
    totalAmount: number
    paymentStatus: "pending" | "completed" | "failed"
    orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    shippingAddress: {
        addressLine1: string
        addressLine2?: string
        city: string
        state: string
        pinCode: string
    }
    createdAt: string
    updatedAt: string
}