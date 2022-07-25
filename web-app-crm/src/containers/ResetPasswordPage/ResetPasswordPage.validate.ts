const REQUIRED_FIELD = 'Обязательно для заполнения'

export const passwordValidation = {
    required: REQUIRED_FIELD,
    validate: (value: string) => {
        
        if(value.length < 6) {
            return 'Пароль должен содержать 6-ть или более символов'
        }

        return true;
    }
}

export const retryPasswordValidation = (password?: string) => {
    return {
        required: REQUIRED_FIELD,
        validate: (value: string) => {
            
            if(value.length < 6) {
                return 'Пароль должен содержать 6-ть или более символов'
            }

            if(value !== password){
                return 'Пароли должны совпадать'
            }
    
            return true;
        }
    }
}