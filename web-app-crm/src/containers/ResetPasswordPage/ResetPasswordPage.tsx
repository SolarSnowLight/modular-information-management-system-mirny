import { Button, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { FC, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import AuthApis from "../../constants/apis/auth.apis";
import MainApis, { MainApi } from "../../constants/apis/main.apis";
import styles from "./ResetPasswordPage.module.css";
import { passwordValidation, retryPasswordValidation } from "./ResetPasswordPage.validate";

interface IResetPasswordForm {
  // добавить в строку с const useForm дженерик
  password: string;
  retryPassword: string;
  token: string | null | undefined
}

const ResetPasswordPage: FC<any> = () => {
  const token = useParams()["token"];

  const { handleSubmit, control } = useForm<IResetPasswordForm>();
  const [password, setPassword] = useState<string>("");

  const { errors } = useFormState({
    control,
  });

  const onSubmit: SubmitHandler<IResetPasswordForm> = async(data) => {
    data.token = token;

    const response = await fetch(
        (MainApi + AuthApis.RESET_PASSWORD), 
        { 
            method: "POST", 
            body: JSON.stringify(data), 
            headers: {} 
        }
    );

    const result = await response.json();

    console.log(result);
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <Typography variant="h4" component="div">
          Восстановление пароля
        </Typography>

        <form className="auth-form__form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="password"
            rules={passwordValidation}
            render={({ field }) => (
              <TextField
                label="Новый пароль"
                size="small"
                margin="normal"
                className="auth-form__input"
                fullWidth={true}
                onChange={(e) => {
                    field.onChange(e);
                    setPassword(e.target?.value);
                }}
                value={field.value}
                error={!!errors.password?.message}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="retryPassword"
            rules={retryPasswordValidation(password)}
            render={({ field }) => (
              <TextField
                label="Повторите новый пароль"
                type="password"
                size="small"
                margin="normal"
                className="auth-form__input"
                fullWidth={true}
                onChange={(e) => field.onChange(e)}
                value={field.value}
                error={!!errors.retryPassword?.message}
                helperText={errors.retryPassword?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth={true}
            disableElevation={true}
            sx={{
              marginTop: 2,
            }}
          >
            Изменить пароль
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
