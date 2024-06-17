import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicial from "./pages/inicial";
import Cadastro from "./pages/cadastro";
import Home from "./pages/Home/home";
import Editar from "./pages/editar/editar"

function AppRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}> </Route>
                <Route path="/lista" element={<Inicial />}> </Route>
                <Route path="/Cadastro" element={<Cadastro />}> </Route>
                <Route path="/Editar" element={<Editar />} />
            </Routes>
        </BrowserRouter>
    );


}

export default AppRoutes