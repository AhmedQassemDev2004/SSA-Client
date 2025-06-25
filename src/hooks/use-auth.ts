import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../contexts/createAuthContext';

export function useAuth(): AuthContextType & {
    loginAndRedirect: (token: string, userData: any, refreshToken: string, redirectTo?: string) => void;
    requireAuth: (redirectTo?: string) => boolean;
} {
    const context = useContext(AuthContext);
    const navigate = useNavigate();    if (context === undefined || context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }    const loginAndRedirect = (
        token: string, 
        userData: AuthContextType['user'], 
        refreshToken: string,
        redirectTo?: string
    ) => {
        context.login(token, userData, refreshToken);
        navigate(redirectTo || '/');
    };

    const requireAuth = (redirectTo?: string): boolean => {
        if (!context.isAuthenticated) {
            navigate('/login', { state: { from: redirectTo || window.location.pathname } });
            return false;
        }
        return true;
    };

    return {
        ...context,
        loginAndRedirect,
        requireAuth,
    };
}
