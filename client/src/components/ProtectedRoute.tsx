import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Button } from '@mui/material';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    gap: 2
                }}
            >
                <Typography variant="h4" color="primary">
                    Acceso Restringido
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Debes iniciar sesión para acceder a esta página
                </Typography>
                <Button variant="contained" href="/">
                    Volver al inicio
                </Button>
            </Box>
        );
    }

    if (!isAdmin) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    gap: 2
                }}
            >
                <Typography variant="h4" color="error">
                    No Autorizado
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    No tienes permisos de administrador
                </Typography>
                <Button variant="contained" href="/">
                    Volver al inicio
                </Button>
            </Box>
        );
    }

    return <>{children}</>;
}
