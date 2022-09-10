import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const UserPage = () => {
    const { store, actions } = useContext(Context);
    const nav = useNavigate();

    const desloguear = ()=>{
        actions.logout();
        alert("Deslogueado correctamente")
        nav('/');
    }
    
    useEffect(()=>{
        actions.infoUsuario();
    },[])

    return (
        <div className="container mt-5">
            <p>{`Estas logueado con el numero de usuario: ${store.user.id} y con el email: ${store.user.email}`}</p>
            <button className="btn btn-danger my-5" onClick={desloguear}>
            Desloguear
            </button>
        </div>
    );
};

export default UserPage;
