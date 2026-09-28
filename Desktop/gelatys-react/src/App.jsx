import React, { useState, useEffect } from 'react'

export default function App() {
  // ---------------------------------------------------------------------------
  // HELPER PARA OBTENER LA FECHA LOCAL ACTUAL (FORMATO YYYY-MM-DD) SIN DESFASE UTC
  // ---------------------------------------------------------------------------
  const obtenerFechaLocal = () => {
    const hoy = new Date()
    const year = hoy.getFullYear()
    const month = String(hoy.getMonth() + 1).padStart(2, '0')
    const day = String(hoy.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // ---------------------------------------------------------------------------
  // HELPER PARA FORMATO DE MONEDA CON SEPARADOR DE MILES POR PUNTO
  // ---------------------------------------------------------------------------
  const formatearPrecio = (valor) => {
    const num = Number(valor)
    if (isNaN(num)) return '$ 0'
    return '$ ' + Math.round(num).toLocaleString('es-CO')
  }

  // ---------------------------------------------------------------------------
  // DATOS INICIALES POR DEFECTO
  // ---------------------------------------------------------------------------
  const usuariosIniciales = [
    { id: 1, nombreCompleto: 'Leonel Morales', usuario: 'admin', pass: 'admin123', rol: 'Administrador' },
    { id: 2, nombreCompleto: 'Carlos Pérez', usuario: 'trabajador', pass: 'user123', rol: 'Trabajador' }
  ]

  const productosIniciales = [
    { id: 1, nombre: 'Gelatina de Pata Tradicional 250g', descripcion: 'Gelatina de pata artesanal', valor: 3500, stock: 50 },
    { id: 2, nombre: 'Gelatina con Leche y Coco 300g', descripcion: 'Gelatina especial con coco rallado', valor: 4500, stock: 20 },
    { id: 3, nombre: 'Postre de Gelatina Mosaico 200g', descripcion: 'Postre frío de múltiples sabores', valor: 5000, stock: 15 }
  ]

  const ventasIniciales = [
    { idVenta: 1, fecha: obtenerFechaLocal(), total: 11500, itemsCount: 3 },
    { idVenta: 2, fecha: obtenerFechaLocal(), total: 7000, itemsCount: 2 }
  ]

  // ---------------------------------------------------------------------------
  // ESTADOS CON PERSISTENCIA EN LOCALSTORAGE
  // ---------------------------------------------------------------------------
  const [sesionIniciada, setSesionIniciada] = useState(() => {
    return JSON.parse(localStorage.getItem('gelatys_sesionIniciada')) || false
  })

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(() => {
    return JSON.parse(localStorage.getItem('gelatys_usuarioAutenticado')) || null
  })

  const [moduloActivo, setModuloActivo] = useState(() => {
    return localStorage.getItem('gelatys_moduloActivo') || 'menu'
  })

  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('gelatys_usuarios')
    return guardados ? JSON.parse(guardados) : usuariosIniciales
  })

  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem('gelatys_productos')
    return guardados ? JSON.parse(guardados) : productosIniciales
  })

  const [ventasRegistradas, setVentasRegistradas] = useState(() => {
    const guardadas = localStorage.getItem('gelatys_ventas')
    return guardadas ? JSON.parse(guardadas) : ventasIniciales
  })

  // GUARDADO EN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('gelatys_sesionIniciada', JSON.stringify(sesionIniciada))
  }, [sesionIniciada])

  useEffect(() => {
    localStorage.setItem('gelatys_usuarioAutenticado', JSON.stringify(usuarioAutenticado))
  }, [usuarioAutenticado])

  useEffect(() => {
    localStorage.setItem('gelatys_moduloActivo', moduloActivo)
  }, [moduloActivo])

  useEffect(() => {
    localStorage.setItem('gelatys_usuarios', JSON.stringify(usuarios))
  }, [usuarios])

  useEffect(() => {
    localStorage.setItem('gelatys_productos', JSON.stringify(productos))
  }, [productos])

  useEffect(() => {
    localStorage.setItem('gelatys_ventas', JSON.stringify(ventasRegistradas))
  }, [ventasRegistradas])

  // Formulario de Login
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [errorLogin, setErrorLogin] = useState('')

  // ---------------------------------------------------------------------------
  // 1.1 MÓDULO USUARIOS
  // ---------------------------------------------------------------------------
  const [idUsuarioEdit, setIdUsuarioEdit] = useState(null)
  const [uNombre, setUNombre] = useState('')
  const [uUsuario, setUUsuario] = useState('')
  const [uPass, setUPass] = useState('')
  const [uRol, setURol] = useState('Administrador')

  const guardarUsuario = (e) => {
    e.preventDefault()
    if (!uNombre || !uUsuario || !uPass) return alert('Diligencie todos los campos de usuario.')

    if (idUsuarioEdit !== null) {
      setUsuarios(usuarios.map(u => u.id === idUsuarioEdit ? { ...u, nombreCompleto: uNombre, usuario: uUsuario, pass: uPass, rol: uRol } : u))
      setIdUsuarioEdit(null)
    } else {
      const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1
      const nuevo = { id: nuevoId, nombreCompleto: uNombre, usuario: uUsuario, pass: uPass, rol: uRol }
      setUsuarios([...usuarios, nuevo])
    }
    setUNombre(''); setUUsuario(''); setUPass(''); setURol('Administrador')
  }

  const prepararEditarUsuario = (u) => {
    setIdUsuarioEdit(u.id)
    setUNombre(u.nombreCompleto)
    setUUsuario(u.usuario)
    setUPass(u.pass)
    setURol(u.rol)
  }

  const eliminarUsuario = (id) => {
    if (window.confirm('¿Desea eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
  }

  // ---------------------------------------------------------------------------
  // 1.2 MÓDULO INVENTARIO
  // ---------------------------------------------------------------------------
  const [idProdEdit, setIdProdEdit] = useState(null)
  const [pNombre, setPNombre] = useState('')
  const [pDescripcion, setPDescripcion] = useState('')
  const [pValor, setPValor] = useState('')
  const [pStock, setPStock] = useState('')

  const guardarProducto = (e) => {
    e.preventDefault()
    if (!pNombre || !pDescripcion || pValor === '' || pStock === '') {
      return alert('Diligencie todos los campos del producto.')
    }

    const valorNumerico = parseFloat(pValor)
    const stockNumerico = parseInt(pStock, 10)

    if (isNaN(valorNumerico) || valorNumerico < 0) {
      return alert('Ingrese un valor numérico válido para el precio.')
    }
    if (isNaN(stockNumerico) || stockNumerico < 0) {
      return alert('Ingrese un stock válido.')
    }

    if (idProdEdit !== null) {
      setProductos(productos.map(p => p.id === idProdEdit ? {
        ...p,
        nombre: pNombre,
        descripcion: pDescripcion,
        valor: valorNumerico,
        stock: stockNumerico
      } : p))
      setIdProdEdit(null)
    } else {
      const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1
      const nuevo = {
        id: nuevoId,
        nombre: pNombre,
        descripcion: pDescripcion,
        valor: valorNumerico,
        stock: stockNumerico
      }
      setProductos([...productos, nuevo])
    }
    setPNombre(''); setPDescripcion(''); setPValor(''); setPStock('')
  }

  const prepararEditarProducto = (p) => {
    setIdProdEdit(p.id)
    setPNombre(p.nombre)
    setPDescripcion(p.descripcion)
    setPValor(p.valor.toString())
    setPStock(p.stock.toString())
  }

  const eliminarProducto = (id) => {
    if (window.confirm('¿Desea eliminar este producto del inventario?')) {
      setProductos(productos.filter(p => p.id !== id))
    }
  }

  // ---------------------------------------------------------------------------
  // 1.3 MÓDULO FACTURACIÓN
  // ---------------------------------------------------------------------------
  const [prodSeleccionadoId, setProdSeleccionadoId] = useState('')
  const [cantFactura, setCantFactura] = useState(1)
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = () => {
    if (!prodSeleccionadoId) return alert('Seleccione un producto.')
    const prod = productos.find(p => p.id === parseInt(prodSeleccionadoId, 10))
    if (!prod) return

    const cantidad = parseInt(cantFactura, 10)
    if (isNaN(cantidad) || cantidad <= 0) return alert('Ingrese una cantidad válida.')

    const enCarritoActual = carrito.filter(item => item.id === prod.id).reduce((acc, curr) => acc + curr.cantidad, 0)
    if (cantidad + enCarritoActual > prod.stock) {
      return alert(`Stock insuficiente. Máximo disponible: ${prod.stock - enCarritoActual}`)
    }

    const itemCarrito = {
      cartId: Date.now(),
      id: prod.id,
      nombre: prod.nombre,
      valorUnitario: prod.valor,
      cantidad: cantidad,
      subtotal: prod.valor * cantidad
    }

    setCarrito([...carrito, itemCarrito])
    setCantFactura(1)
  }

  const quitarDelCarrito = (cartId) => {
    setCarrito(carrito.filter(item => item.cartId !== cartId))
  }

  const totalVenta = carrito.reduce((sum, item) => sum + item.subtotal, 0)

  const registrarVenta = () => {
    if (carrito.length === 0) return alert('El carrito está vacío.')

    const nuevoInventario = productos.map(prod => {
      const itemsComprados = carrito.filter(c => c.id === prod.id)
      const totalComprado = itemsComprados.reduce((acc, curr) => acc + curr.cantidad, 0)
      return { ...prod, stock: prod.stock - totalComprado }
    })

    setProductos(nuevoInventario)

    // REGISTRO DE VENTA USANDO LA FECHA LOCAL
    const nuevaVenta = {
      idVenta: ventasRegistradas.length > 0 ? Math.max(...ventasRegistradas.map(v => v.idVenta)) + 1 : 1,
      fecha: obtenerFechaLocal(),
      total: totalVenta,
      itemsCount: carrito.reduce((acc, c) => acc + c.cantidad, 0)
    }

    setVentasRegistradas([nuevaVenta, ...ventasRegistradas])
    alert('¡Venta registrada con éxito!')
    setCarrito([])
  }

  const cancelarVenta = () => {
    if (window.confirm('¿Está seguro de cancelar la venta y vaciar el carrito?')) {
      setCarrito([])
    }
  }

  // ---------------------------------------------------------------------------
  // 1.4 MÓDULO INFORMES (FILTRADO DE FECHAS CORREGIDO CON FECHA LOCAL)
  // ---------------------------------------------------------------------------
  const [tipoInforme, setTipoInforme] = useState('ventas')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [informeGenerado, setInformeGenerado] = useState(null)

  const generarInforme = () => {
    if (tipoInforme === 'ventas') {
      let filtradas = [...ventasRegistradas]

      if (fechaDesde) {
        filtradas = filtradas.filter(v => v.fecha >= fechaDesde)
      }
      if (fechaHasta) {
        filtradas = filtradas.filter(v => v.fecha <= fechaHasta)
      }

      setInformeGenerado({
        tipo: 'ventas',
        datos: filtradas,
        totalAcumulado: filtradas.reduce((sum, v) => sum + v.total, 0)
      })
    } else {
      setInformeGenerado({
        tipo: 'inventario',
        datos: [...productos],
        totalProductos: productos.reduce((sum, p) => sum + p.stock, 0)
      })
    }
  }

  const descargarCSV = () => {
    if (!informeGenerado || !informeGenerado.datos) return alert('Primero genere un informe.')

    let csvContent = 'data:text/csv;charset=utf-8,'

    if (informeGenerado.tipo === 'ventas') {
      csvContent += 'ID Venta,Fecha,Unidades Vendidas,Total Venta\n'
      informeGenerado.datos.forEach(v => {
        csvContent += `${v.idVenta},${v.fecha},${v.itemsCount || 1},${v.total}\n`
      })
    } else {
      csvContent += 'ID,Nombre,Descripcion,Valor,Stock\n'
      informeGenerado.datos.forEach(p => {
        csvContent += `${p.id},"${p.nombre}","${p.descripcion}",${p.valor},${p.stock}\n`
      })
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Informe_Gelatys_${informeGenerado.tipo}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ---------------------------------------------------------------------------
  // LÓGICA DE AUTENTICACIÓN Y SALIDA
  // ---------------------------------------------------------------------------
  const manejarLogin = (e) => {
    e.preventDefault()
    const encontrado = usuarios.find(u => u.usuario === loginUser && u.pass === loginPass)
    if (encontrado) {
      setUsuarioAutenticado(encontrado)
      setSesionIniciada(true)
      setModuloActivo('menu')
      setErrorLogin('')
      setLoginUser('')
      setLoginPass('')
    } else {
      setErrorLogin('Usuario o contraseña incorrectos.')
    }
  }

  const cerrarSesion = () => {
    if (window.confirm('¿Desea salir de la aplicación Gelatys?')) {
      setSesionIniciada(false)
      setUsuarioAutenticado(null)
      setModuloActivo('menu')
      localStorage.removeItem('gelatys_sesionIniciada')
      localStorage.removeItem('gelatys_usuarioAutenticado')
    }
  }

  // ===========================================================================
  // VISTA 1: MÓDULO LOGIN
  // ===========================================================================
  if (!sesionIniciada) {
    return (
      <div className="bg-secondary min-vh-100 d-flex align-items-center justify-content-center p-3">
        <div className="card shadow-lg border-0 style-login" style={{ maxWidth: '420px', width: '100%' }}>
          <div className="card-header bg-dark text-white text-center py-4">
            <h2 className="fw-bold text-warning mb-0">🍧 GELATYS</h2>
            <small className="text-light">Sistema de Control y Gestión</small>
          </div>
          <div className="card-body p-4 bg-white">
            {errorLogin && <div className="alert alert-danger py-2">{errorLogin}</div>}
            <form onSubmit={manejarLogin}>
              <div className="mb-3">
                <label className="form-label fw-bold">Usuario</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={loginUser} 
                  onChange={(e) => setLoginUser(e.target.value)} 
                  placeholder="Ingrese su usuario" 
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={loginPass} 
                  onChange={(e) => setLoginPass(e.target.value)} 
                  placeholder="Ingrese su contraseña" 
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning w-100 fw-bold shadow-sm py-2">
                INGRESAR AL SISTEMA
              </button>
            </form>

            <div className="mt-4 p-3 bg-light rounded border text-center">
              <p className="fw-bold text-dark mb-1 small">🔑 Credenciales de Acceso al Sistema:</p>
              <div className="text-muted small">
                <div><strong>Administrador:</strong> admin / admin123</div>
                <div><strong>Trabajador:</strong> trabajador / user123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===========================================================================
  // VISTA 2: APLICACIÓN PRINCIPAL
  // ===========================================================================
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3">
        <div className="container-fluid">
          <span 
            className="navbar-brand fw-bold text-warning fs-3 me-4 style-pointer" 
            style={{ cursor: 'pointer' }}
            onClick={() => setModuloActivo('menu')}
          >
            Gelatys
          </span>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarGelatys">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarGelatys">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${moduloActivo === 'menu' ? 'text-warning fw-bold active' : 'text-white'}`}
                  onClick={() => setModuloActivo('menu')}
                >
                  🏠 Menú
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${moduloActivo === 'usuarios' ? 'text-warning fw-bold active' : 'text-white'}`}
                  onClick={() => setModuloActivo('usuarios')}
                >
                  👤 Usuario
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${moduloActivo === 'inventario' ? 'text-warning fw-bold active' : 'text-white'}`}
                  onClick={() => setModuloActivo('inventario')}
                >
                  📦 Inventario
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${moduloActivo === 'facturacion' ? 'text-warning fw-bold active' : 'text-white'}`}
                  onClick={() => setModuloActivo('facturacion')}
                >
                  🧾 Facturación
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${moduloActivo === 'informes' ? 'text-warning fw-bold active' : 'text-white'}`}
                  onClick={() => setModuloActivo('informes')}
                >
                  📊 Informe
                </button>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <span className="text-white small d-none d-md-inline">
                {usuarioAutenticado?.nombreCompleto} ({usuarioAutenticado?.rol})
              </span>
              <button onClick={cerrarSesion} className="btn btn-danger btn-sm fw-bold shadow-sm">
                🚪 Cierre de Aplicación
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container py-4 flex-grow-1">

        {/* 2.0 MÓDULO MENÚ */}
        {moduloActivo === 'menu' && (
          <div className="row justify-content-center my-5">
            <div className="col-md-10 text-center">
              <div className="card shadow border-0 p-4 bg-white rounded-3">
                <h2 className="fw-bold text-dark mb-3 fs-4" style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
                  Bienvenido, {usuarioAutenticado?.rol} – seleccione el menú en la parte superior.
                </h2>
                <p className="text-muted small mb-0">
                  Sistema de Gestión comercial de productos, usuarios, facturación e informes para GELATYS.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1.1 MÓDULO USUARIOS */}
        {moduloActivo === 'usuarios' && (
          <div>
            <h3 className="fw-bold mb-3 text-dark">Módulo de Gestión de Usuarios</h3>
            
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white fw-bold">
                {idUsuarioEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </div>
              <div className="card-body">
                <form onSubmit={guardarUsuario} className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Nombre Completo</label>
                    <input type="text" className="form-control" value={uNombre} onChange={(e) => setUNombre(e.target.value)} placeholder="Ej: Maria Lopez" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Usuario</label>
                    <input type="text" className="form-control" value={uUsuario} onChange={(e) => setUUsuario(e.target.value)} placeholder="mlopez" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Contraseña</label>
                    <input type="password" className="form-control" value={uPass} onChange={(e) => setUPass(e.target.value)} placeholder="****" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Rol</label>
                    <select className="form-select" value={uRol} onChange={(e) => setURol(e.target.value)}>
                      <option value="Administrador">Administrador</option>
                      <option value="Trabajador">Trabajador</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-success w-100 fw-bold">
                      {idUsuarioEdit ? 'Actualizar' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white fw-bold">Lista de Usuarios Registrados</div>
              <div className="card-body p-0">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>ID</th>
                      <th>Nombre Completo</th>
                      <th>Usuario</th>
                      <th>Contraseña</th>
                      <th>Rol</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id}>
                        <td><strong>#{u.id}</strong></td>
                        <td>{u.nombreCompleto}</td>
                        <td>{u.usuario}</td>
                        <td>••••••</td>
                        <td><span className={`badge ${u.rol === 'Administrador' ? 'bg-primary' : 'bg-info text-dark'}`}>{u.rol}</span></td>
                        <td className="text-center">
                          <button onClick={() => prepararEditarUsuario(u)} className="btn btn-warning btn-sm me-2 fw-bold">Editar</button>
                          <button onClick={() => eliminarUsuario(u.id)} className="btn btn-danger btn-sm fw-bold">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 1.2 MÓDULO INVENTARIO */}
        {moduloActivo === 'inventario' && (
          <div>
            <h3 className="fw-bold mb-3 text-dark">Módulo de Inventario de Productos</h3>
            
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white fw-bold">
                {idProdEdit ? 'Editar Producto' : 'Crear Producto (Registrar Producto)'}
              </div>
              <div className="card-body">
                <form onSubmit={guardarProducto} className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Nombre</label>
                    <input type="text" className="form-control" value={pNombre} onChange={(e) => setPNombre(e.target.value)} placeholder="Ej: Gelatina Mosaico" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Descripción</label>
                    <input type="text" className="form-control" value={pDescripcion} onChange={(e) => setPDescripcion(e.target.value)} placeholder="Detalle del producto" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Valor ($)</label>
                    <input type="number" className="form-control" value={pValor} onChange={(e) => setPValor(e.target.value)} placeholder="3500" min="0" step="any" />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label fw-bold">Stock</label>
                    <input type="number" className="form-control" value={pStock} onChange={(e) => setPStock(e.target.value)} placeholder="10" min="0" />
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-success w-100 fw-bold">
                      {idProdEdit ? 'Actualizar' : 'Registrar Producto'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white fw-bold">Tabla de Inventario Cronológico</div>
              <div className="card-body p-0">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Valor</th>
                      <th>Stock</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>{p.nombre}</td>
                        <td>{p.descripcion}</td>
                        <td className="fw-bold">{formatearPrecio(p.valor)}</td>
                        <td>
                          <span className={`badge ${p.stock > 10 ? 'bg-success' : 'bg-danger'}`}>
                            {p.stock} unids.
                          </span>
                        </td>
                        <td className="text-center">
                          <button onClick={() => prepararEditarProducto(p)} className="btn btn-warning btn-sm me-2 fw-bold">Editar</button>
                          <button onClick={() => eliminarProducto(p.id)} className="btn btn-danger btn-sm fw-bold">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 1.3 MÓDULO FACTURACIÓN */}
        {moduloActivo === 'facturacion' && (
          <div>
            <h3 className="fw-bold mb-3 text-dark">Módulo de Facturación y Ventas</h3>

            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white fw-bold">Agregar Productos a la Venta</div>
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Seleccionar Producto (Creados en Inventario)</label>
                    <select 
                      className="form-select" 
                      value={prodSeleccionadoId} 
                      onChange={(e) => setProdSeleccionadoId(e.target.value)}
                    >
                      <option value="">-- Seleccione un Producto --</option>
                      {productos.map(p => (
                        <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                          {p.nombre} - {formatearPrecio(p.valor)} (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Cantidad</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={cantFactura} 
                      onChange={(e) => setCantFactura(e.target.value)} 
                      min="1" 
                    />
                  </div>
                  <div className="col-md-3">
                    <button onClick={agregarAlCarrito} className="btn btn-success w-100 fw-bold">
                      🛒 Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-header bg-dark text-white fw-bold">Detalle de la Compra</div>
              <div className="card-body p-0">
                <table className="table table-striped mb-0 align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>Producto</th>
                      <th>Valor Unitario</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-3 text-muted">El carrito está vacío.</td>
                      </tr>
                    ) : (
                      carrito.map(item => (
                        <tr key={item.cartId}>
                          <td>{item.nombre}</td>
                          <td>{formatearPrecio(item.valorUnitario)}</td>
                          <td>{item.cantidad}</td>
                          <td>{formatearPrecio(item.subtotal)}</td>
                          <td className="text-center">
                            <button onClick={() => quitarDelCarrito(item.cartId)} className="btn btn-outline-danger btn-sm fw-bold">
                              Quitar del Carrito
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="card-footer bg-white d-flex justify-content-between align-items-center p-3">
                <h4 className="fw-bold mb-0 text-dark">
                  Valor Total de Venta: <span className="text-success">{formatearPrecio(totalVenta)}</span>
                </h4>
                <div className="d-flex gap-2">
                  <button onClick={cancelarVenta} className="btn btn-secondary fw-bold">Cancelar Venta</button>
                  <button onClick={registrarVenta} className="btn btn-primary fw-bold fs-5 px-4">Registrar Venta</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1.4 MÓDULO INFORMES */}
        {moduloActivo === 'informes' && (
          <div>
            <h3 className="fw-bold mb-3 text-dark">Módulo de Generación de Informes</h3>

            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white fw-bold">Filtros para la Generación de Informes</div>
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Tipo de Informe</label>
                    <select 
                      className="form-select" 
                      value={tipoInforme} 
                      onChange={(e) => {
                        setTipoInforme(e.target.value)
                        setInformeGenerado(null)
                      }}
                    >
                      <option value="ventas">Informe por Ventas</option>
                      <option value="inventario">Informe por Inventario</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold">Fecha Desde (Opcional)</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={fechaDesde} 
                      onChange={(e) => setFechaDesde(e.target.value)} 
                      disabled={tipoInforme === 'inventario'}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold">Fecha Hasta (Opcional)</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={fechaHasta} 
                      onChange={(e) => setFechaHasta(e.target.value)} 
                      disabled={tipoInforme === 'inventario'}
                    />
                  </div>

                  <div className="col-md-3">
                    <button onClick={generarInforme} className="btn btn-primary w-100 fw-bold">
                      📊 Generar Informe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLA Y RESULTADO DEL INFORME */}
            {informeGenerado && (
              <div className="card shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                  <span className="fw-bold">
                    Resultados: {informeGenerado.tipo === 'ventas' ? 'Informe de Ventas' : 'Informe de Estado del Inventario'}
                  </span>
                  <button onClick={descargarCSV} className="btn btn-success btn-sm fw-bold">
                    ⬇️ Descargar Informe en Formato CSV
                  </button>
                </div>
                <div className="card-body p-0">
                  {informeGenerado.tipo === 'ventas' ? (
                    <div>
                      <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-secondary">
                          Registros Encontrados: {informeGenerado.datos.length}
                        </span>
                        <span className="fw-bold fs-5 text-success">
                          Total Ventas Acumuladas: {formatearPrecio(informeGenerado.totalAcumulado)}
                        </span>
                      </div>
                      <table className="table table-striped mb-0 align-middle">
                        <thead className="table-secondary">
                          <tr>
                            <th># Venta</th>
                            <th>Fecha de Registro</th>
                            <th>Unidades Vendidas</th>
                            <th>Total Facturado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {informeGenerado.datos.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center py-4 text-muted">
                                No hay ventas registradas para el rango de fechas seleccionado.
                              </td>
                            </tr>
                          ) : (
                            informeGenerado.datos.map(v => (
                              <tr key={v.idVenta}>
                                <td><strong>#{v.idVenta}</strong></td>
                                <td>{v.fecha}</td>
                                <td>{v.itemsCount || 1} unids.</td>
                                <td className="fw-bold text-success">{formatearPrecio(v.total)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div>
                      <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-secondary">
                          Ítems en Catálogo: {informeGenerado.datos.length}
                        </span>
                        <span className="fw-bold fs-5 text-primary">
                          Total Existencias Globales: {informeGenerado.totalProductos} unidades
                        </span>
                      </div>
                      <table className="table table-striped mb-0 align-middle">
                        <thead className="table-secondary">
                          <tr>
                            <th>ID</th>
                            <th>Nombre del Producto</th>
                            <th>Descripción</th>
                            <th>Valor Unitario</th>
                            <th>Stock Disponible</th>
                          </tr>
                        </thead>
                        <tbody>
                          {informeGenerado.datos.map(p => (
                            <tr key={p.id}>
                              <td><strong>#{p.id}</strong></td>
                              <td>{p.nombre}</td>
                              <td>{p.descripcion}</td>
                              <td className="fw-bold">{formatearPrecio(p.valor)}</td>
                              <td>
                                <span className={`badge ${p.stock > 10 ? 'bg-success' : 'bg-danger'}`}>
                                  {p.stock} unidades
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* PIE DE PÁGINA */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small className="text-muted">
          GELATYS Web System © 2026 | Sistema de Control Modular React.js
        </small>
      </footer>
    </div>
  )
}