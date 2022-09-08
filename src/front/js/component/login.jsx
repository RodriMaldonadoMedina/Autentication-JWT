import React, { useState } from "react";

const Login = () => {
  const [datos, setDatos] = useState({});

  function inputChange(e){
    setDatos({...datos, [e.target.type]: e.target.value})
  }

  function datosCargados(e){
    e.preventDefault();
    console.log(datos);
    loguearUsuario();
  }

  function loguearUsuario(){
    fetch(process.env.BACKEND_URL + '/api/login', 
    {
      method : 'POST',
      headers : {
        "content-type" : "application/json"
      },
      body: JSON.stringify(datos)
    })
    .then(resp=>resp.json())
    .then(data=>console.log(data))
    .catch((error)=>{console.log(error)});
  }

  return (
    <div className="container">
        <form onSubmit={datosCargados}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">
            Email address
            </label>
            <input
            type="email"
            value={datos.mail}
            onChange={inputChange}
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
            </div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">
            Password
            </label>
            <input
            type="password"
            value={datos.pass}
            onChange={inputChange}
            className="form-control"
            id="password"
            />
        </div>
        <button type="submit" className="btn btn-primary">
            Submit
        </button>
        </form>
    </div>
  );
};


export default Login;