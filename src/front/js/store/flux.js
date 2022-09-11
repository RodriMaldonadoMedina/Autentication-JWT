const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: {id: null, email: null},
			token: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			cargarUsuario: (datos)=>{
				fetch(process.env.BACKEND_URL + "/api/signup", {
				  method: "POST",
				  headers: {
					"content-type": "application/json",
				  },
				  body: JSON.stringify(datos),
				})
				  .then((resp) => {
					if (resp.status === 404)
					  alert("El usuario ya existe")
					else alert("Usuario creado correctamente")
					resp.json();
				  })
				  .catch((error) => {
					console.log(error);
				});
			},

			loguearUsuario: (datos)=>{
				fetch(process.env.BACKEND_URL + '/api/login', 
				{
				  method : 'POST',
				  headers : {
					"content-type" : "application/json"
				  },
				  body: JSON.stringify(datos)
				})
				.then(resp => {
					if(resp.status === 401){
						console.log("Invalid credentials")
				    }
				    else if(resp.status === 400){
						console.log("Invalid email or password format")
				    }
					return resp.json()
				})
				.then( data => {
					sessionStorage.setItem("token",data.token);
					setStore({token: data.token});
				})
				.catch((error) => {console.log(error)});
			  },

			infoUsuario: ()=>{
				let store = getStore();
				fetch(process.env.BACKEND_URL + '/api/protected',
				{
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
          				"Authorization": 'Bearer '+ store.token
					}
				})
				.then(resp=>resp.json())
				/////////////////////////////////////////////////////////
				//como agregar el data a user si tengo nombres distintos?
				.then(data=>setStore({user:data}))
				.catch(error=>console.log(error));
			  },

			logout: ()=>{
				let store = getStore();
				fetch(process.env.BACKEND_URL + "/api/logout", {
				  method: "DELETE",
				  headers: {
					"Authorization": "Bearer " + store.token,
					"Content-Type": "application/json",
				  },
				})
				  .then(resp => resp.json())
				  .then((data) => {
					setStore({token: null});
					sessionStorage.removeItem("token");
				  });
			  }
			
		}
	};
};

export default getState;
