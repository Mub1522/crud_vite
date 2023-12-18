import Swal from 'sweetalert2'

const url_empleados = "http://localhost/empleados_API/";

let producto = document.getElementById('producto')
let cantidad = document.getElementById('cantidad')
let precio_unitario = document.getElementById('precio_unitario')

let lista_productos = document.getElementById('productos')

const app = new function () {

    this.listar = function () {
        fetch(url_empleados)
            .then(r => r.json())
            .then((res) => {
                let tabla_data = "";
                res.map(
                    function (producto, index, array) {
                        tabla_data += `
                        <tr>
                            <td>${producto.id}</td>
                            <td>${producto.producto}</td>
                            <td>${producto.cantidad}</td>
                            <td>${producto.precio_unitario}</td>
                            <td>
                                <button class="btn btn-warning" id="btn_editar_producto">Editar</button>
                                <button class="btn btn-danger btn_eliminar" data-id=`+ producto.id + ` data-producto=` + producto.producto + `>Eliminar</button>
                            </td>
                        </tr>
                        `
                    }
                )

                lista_productos.innerHTML = tabla_data;

                let btns_eliminar = document.querySelectorAll('.btn_eliminar')

                btns_eliminar.forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        app.borrar(this.dataset.id, this.dataset.producto)
                    })
                })
            })
            .catch(console.log)
    }

    this.guardar = function () {

        let insertar_data = {
            producto: producto.value,
            cantidad: cantidad.value,
            precio_unitario: precio_unitario.value
        }

        fetch(url_empleados + "?insertar=1", { method: "post", body: JSON.stringify(insertar_data) })
            .then(r => r.json())
            .then((res) => {
                console.log(res.err)
                if (res.err) {
                    Swal.fire({
                        title: "Atencion!",
                        text: "Debes ingresar un nombre para el producto.",
                        icon: "warning",
                        timer: 2000,
                        timerProgressBar: true,
                    });
                } else {
                    Swal.fire({
                        title: "Exito!",
                        text: "Se ha guardado el producto.",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    this.listar()
                }
            })
            .catch(console.log)
    }

    this.borrar = function (id, producto) {
        Swal.fire({
            title: "Estas seguro?",
            text: `Eliminaras el producto #${id} - ${producto}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "red",
            cancelButtonColor: "gray",
            confirmButtonText: "Confirmar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(url_empleados + `?borrar=${id}`)
                    .then(r => r.json())
                    .then((res) => {
                        if (res.err) {
                            Swal.fire({
                                title: "Error!",
                                text: "Los datos no se han eliminado.",
                                icon: "error",
                                timer: 2000,
                                timerProgressBar: true,
                            });
                            return;
                        }

                        Swal.fire({
                            title: "Eliminado!",
                            text: `El producto #${id} - ${producto} se ha eliminado.`,
                            icon: "success",
                            timer: 2000,
                            timerProgressBar: true,
                        });
                        this.listar()
                    })
                    .catch(console.log)
            }
        });
    }
}

app.listar()

document.getElementById('btn_guardar_producto').addEventListener('click', function () {
    app.guardar()
})



