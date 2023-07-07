import { Container, Nav, Navbar } from "react-bootstrap";

export default function Barra() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href={process.env.REACT_APP_URL}>TODO</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/calculadora">Calculadora</Nav.Link>
            <Nav.Link href="/reporte">Reporte</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
