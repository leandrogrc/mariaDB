import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Text,
} from "@react-email/components";
import * as React from "react";

interface CreateAccountEmailProps {
  name: string;
  code?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const CreateAccountEmail = ({ name, code }: CreateAccountEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Olá {name},</Text>
        <Text style={paragraph}>
          Bem vindo à aplicação. Aqui está o seu link para validação de perfil:
        </Text>
        <Button style={button} href={`${baseUrl}/account/confirmation/${code}`}>
          Confirmar conta
        </Button>
        <Hr style={hr} />
        <Text style={reportLink}>Linktree</Text>
      </Container>
    </Body>
  </Html>
);

CreateAccountEmail.PreviewProps = {
  name: "John Doe",
  code: "0abd4645-5d11-4723-a7e9-b4a3b067c64f",
} as CreateAccountEmailProps;

export default CreateAccountEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const button = {
  backgroundColor: "#615fff",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "26px 0 26px",
};
