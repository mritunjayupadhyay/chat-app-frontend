import { NextRequest, NextResponse } from 'next/server'

const isAuthenticated = (request: NextRequest) => false;
 
export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    // Call our authentication function to check the request
    if (!isAuthenticated(request) && (url.pathname === '/' || url.pathname === '/chat')) {
        // Respond with JSON indicating an error message
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }
}