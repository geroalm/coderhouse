// Agrega un evento al botón para mostrar el cuadro de diálogo de SweetAlert2

   document.getElementById('forgotBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    	
const { value: email } = await Swal.fire({
    title: "Reestablecer contraseña",
    input: "email",
    inputLabel: "Tu direccion de correo",
    inputPlaceholder: "Ingresa tu correo"
  });
  if (email) {
    Swal.fire(`Entered email: ${email}`);
    window.location.href = `/forgot?email=${email}`;
  }

})

    