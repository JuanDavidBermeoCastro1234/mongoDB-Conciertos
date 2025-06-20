// ==============================
// 1. EXPRESIONES REGULARES
// ==============================

// Buscar bandas cuyo nombre empiece por la letra “A”
db.bandas.find({ nombre: /^A/ })

// Buscar asistentes cuyo nombre contenga "Gómez"
db.asistentes.find({ nombre: /Gómez/ })

// ==============================
// 2. OPERADORES DE ARREGLOS
// ==============================

// Buscar asistentes que tengan "Rock" dentro de su campo generos_favoritos
db.asistentes.find({ generos_favoritos: "Rock" })

// ==============================
// 3. AGGREGATION FRAMEWORK
// ==============================

// Agrupar presentaciones por escenario y contar cuántas presentaciones hay por cada uno
db.presentaciones.aggregate([
  { $group: { _id: "$escenario", total_presentaciones: { $sum: 1 } } }
])

// Calcular el promedio de duración de las presentaciones
db.presentaciones.aggregate([
  { $group: { _id: null, promedio_duracion: { $avg: "$duracion_minutos" } } }
])

// ==============================
// 4. FUNCIONES EN system.js
// ==============================

// Crear una función llamada escenariosPorCiudad(ciudad) que devuelva todos los escenarios en esa ciudad.
db.system.js.insertOne({
  _id: "escenariosPorCiudad",
  value: function(ciudad) {
    return db.escenarios.find({ ciudad: ciudad }).toArray();
  }
})

// Crear una función llamada bandasPorGenero(genero) que devuelva todas las bandas activas de ese género.
db.system.js.insertOne({
  _id: "bandasPorGenero",
  value: function(genero) {
    return db.bandas.find({ genero: genero, activa: true }).toArray();
  }
})

// Simular compra de un boleto: insertar nuevo boleto en boletos_comprados y disminuir en 1 la capacidad del escenario.
db.system.js.insertOne({
  _id: "comprarBoleto",
  value: function(a,e,f){
    db.asistentes.updateOne({_id:ObjectId(a)},{$push:{boletos_comprados:{escenario:e,dia:f}}});
    let r=db.escenarios.updateOne({nombre:e,capacidad:{$gt:0}},{$inc:{capacidad:-1}});
    if(r.modifiedCount===0)throw new Error('No hay capacidad');
  }
})

// Reversar la compra: eliminar el boleto insertado anteriormente y aumentar en 1 la capacidad del escenario.
db.system.js.insertOne({
  _id: "reversarCompra",
  value: function(a,e,f){
    db.asistentes.updateOne({_id:ObjectId(a)},{$pull:{boletos_comprados:{escenario:e,dia:f}}});
    db.escenarios.updateOne({nombre:e},{$inc:{capacidad:1}});
  }
})

// ==============================
// 5. ÍNDICES + CONSULTAS
// ==============================

// Crear un índice en bandas.nombre
db.bandas.createIndex({ nombre: 1 })

// Buscar una banda específica por nombre
db.bandas.find({ nombre: "Aterciopelados" })

// Crear un índice en presentaciones.escenario
db.presentaciones.createIndex({ escenario: 1 })

// Contar presentaciones de un escenario
db.presentaciones.countDocuments({ escenario: "Escenario Principal" })

// Crear un índice compuesto en asistentes.ciudad y edad
db.asistentes.createIndex({ ciudad: 1, edad: 1 })

// Consultar asistentes de Bogotá menores de 30
db.asistentes.find({ ciudad: "Bogotá", edad: { $lt: 30 } })
