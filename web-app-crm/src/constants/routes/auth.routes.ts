export const AuthRoutesMain = '/auth';

const AuthRoutes = {
    AUTH_MAIN: `${AuthRoutesMain}`,
    RECOVER_PASSWORD: `${AuthRoutesMain}/recover/password`,
    RESET_PASSWORD: `${AuthRoutesMain}/reset/password/:token`,
}

export default AuthRoutes;