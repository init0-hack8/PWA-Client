import { createBrowserRouter } from "react-router-dom";
import SocialMediaApp from "../pages/Page";
import Layout from "../pages/Layout";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <SocialMediaApp />
            },
            {
                path: '/home',
                element: <SocialMediaApp />
            },
            {
                path: '/search',
                element: <SocialMediaApp />
            },
            {
                path: '/fashion',
                element: <SocialMediaApp />
            },
            {
                path: '/notifications',
                element: <SocialMediaApp />
            },
            {
                path: '/profile',
                element: <SocialMediaApp />
            }
        ]
    },
    {
        path: "/signup",
        element: (
            <>
                <h1>Signup Page</h1>
            </>
        )
    },
    {
        path: "/login",
        element: (
            <>
                <h1>Login Page</h1>
            </>
        )
    },
    {
        path: "*",
        element: (
            <>
                <h1>404 Page not found</h1>
            </>
        )
    }
])

export default router;