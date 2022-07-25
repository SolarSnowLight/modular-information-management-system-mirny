import { TextField } from "@mui/material";
import { Container } from "@mui/system";
import { FC } from "react";
import styles from "./RecoverPasswordPage.module.css";

const RecoverPasswordPage: FC<any> = () => {
  return (
    <div>
      <Container>
        <TextField
          id="outlined-basic"
          label="Введите email-адрес"
          variant="outlined"
        />
      </Container>
    </div>
  );
};

export default RecoverPasswordPage;
