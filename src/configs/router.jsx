import { createBrowserRouter } from "react-router-dom";
import SocialMediaApp from "../pages/Page";

const router = createBrowserRouter([
    {
        path: '/',
        element: <SocialMediaApp />,
        children: [
            {
                path: '/',
                element: <SocialMediaApp />
            },
            {
                path: '/social',
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