'use client'
import React, { useState } from "react";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

const ChatPage = () => {
    const router = useRouter()
    const { token, user } = useAuth();
    if (!token) {
        router.replace("/login")
    }
    return (
        <div>
            <h1>ChatPage</h1>
        </div>
    );
}

export default ChatPage;