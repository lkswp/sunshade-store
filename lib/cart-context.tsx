"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    total: number;
    username: string;
    setUsername: (name: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [username, setUsername] = useState<string>("");

    // Load cart and username from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedUsername = localStorage.getItem('username');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    // Save username to local storage on change
    useEffect(() => {
        localStorage.setItem('username', username);
    }, [username]);

    const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const handleSetUsername = useCallback((name: string) => {
        setUsername(name);
    }, []);

    const total = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items]);

    const value = useMemo(() => ({
        items,
        addItem,
        removeItem,
        clearCart,
        total,
        username,
        setUsername: handleSetUsername
    }), [items, addItem, removeItem, clearCart, total, username, handleSetUsername]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
