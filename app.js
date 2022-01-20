
let nac_actualizadas = false;

function actualizar_nacionalidades(nacionalidades){
  const nacionalidades_html = document.getElementById('nacionalidad');
  nacionalidades.forEach(nacionalidad => {
    var option_el = document.createElement('option');
    option_el.value = nacionalidad.name;
    option_el.innerHTML = nacionalidad.name;
    nacionalidades_html.appendChild(option_el);
  })
}

function obtener_nacionalidades(){
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function(){
    const nacionalidades = JSON.parse(this.response);
    actualizar_nacionalidades(nacionalidades);
    nac_actualizadas = true;
    todo_cargado();
  }
  xhttp.open("GET", "https://restcountries.com/v2/all");
  xhttp.send();
}

obtener_nacionalidades();

let users_actualizados = false;

function actualizar_usuarios(usuarios){
  const usuarios_table_body_html = document.getElementById('usuarios_tbody');
  usuarios_table_body_html.innerHTML = '';
  usuarios.forEach(usuario => {
    const tr = document.createElement('tr');

    const doc_td = document.createElement('td');
    doc_td.innerHTML = usuario.sicCodeType +" - " + usuario.sicCode;
    tr.appendChild(doc_td);
    const name_td = document.createElement('td');
    name_td.innerHTML = usuario.completeName;
    tr.appendChild(name_td);
    const nac_td = document.createElement('td');
    nac_td.innerHTML = usuario.nationality;
    tr.appendChild(nac_td);
    const cel_td = document.createElement('td');
    cel_td.innerHTML = usuario.mobilePhone;
    tr.appendChild(cel_td);
    const email_td = document.createElement('td');
    email_td.innerHTML = usuario.email;
    tr.appendChild(email_td);

    usuarios_table_body_html.appendChild(tr);
  })
}

function obtener_usuarios(){
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function(){
    console.log(JSON.parse(this.response))
    // Filtrando datos vacios o indefinidos
    const usuarios = JSON.parse(this.response).data.filter(el => el.sicCode != "" && el.completeName.trim() != "" && el.sicCode != undefined);
    actualizar_usuarios(usuarios);
    users_actualizados = true;
    todo_cargado();
  }
  xhttp.open("GET", "http://144.217.88.168:3030/api/user");
  xhttp.send();
}

function todo_cargado(){
  if(users_actualizados && nac_actualizadas){
    document.getElementById('myModal').setAttribute('style', 'display: none');
  }
}

obtener_usuarios();

function valores_en_objeto_full(obj){
  return Object.values(obj).every(x => (x != null && x != ''));
}

function validar_cel(cel){
  var regExp = /^[0-9]{10}$/;
  return cel.match(regExp);
}

function validar_email(email){
  var regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return email.match(regExp);
}

function validar_form(valores){
  let msg = "";
  if(valores_en_objeto_full(valores)){
    if(!validar_cel(valores.mobilePhone)){
      msg = "El numero de celular deben ser solo numeros y un máximo de 10 números. "
    }
    if(!validar_email(valores.email)){
      msg += "El email debe tener un formato válido"
    }
  }else{
    msg = "Todos los campos deben estar registrados!"
  }

  return { valid: msg.length < 1, msg: msg };
}

function mostrar_mensaje(msg){
  document.getElementById('error_msg').innerHTML = msg;
  document.getElementById("boton_agregar").disabled = false;
}

function enviar_info(info){
  document.getElementById('error_msg').innerHTML = "Sending info to server...";
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function(){
    document.getElementById('error_msg').innerHTML = "";
    document.getElementById("boton_agregar").disabled = false;
    obtener_usuarios();
  }
  xhttp.open("POST", "http://144.217.88.168:3030/api/user", true);
  xhttp.setRequestHeader('Content-Type', 'application/json')
  xhttp.send(JSON.stringify(info));
}

function agregar(){
  document.getElementById('error_msg').innerHTML = "";
  document.getElementById("boton_agregar").disabled = true;
  let valores_form = {
    "firstName": document.getElementById('nombres').value,
    "lastName": document.getElementById('apellidos').value,
    "email": document.getElementById('email').value.toLowerCase(),
    "sicCode": document.getElementById('identificacion').value,
    "sicCodeType": document.getElementById('tipodocumento').value,
    "mobilePhone": document.getElementById('celular').value,
    "nationality": document.getElementById('nacionalidad').value,
    "createdBy": "Diana M. Banguera V."
  }

  const form_valido = validar_form(valores_form);

  if(form_valido.valid){
    enviar_info(valores_form);
  }else{
    mostrar_mensaje(form_valido.msg);
  }

  console.log(valores_form);
}

