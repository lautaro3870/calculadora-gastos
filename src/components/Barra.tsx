import { Container, Nav, Navbar } from "react-bootstrap";

export default function Barra() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="https://prueba-react-vercel.vercel.app/super">TODO</Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}