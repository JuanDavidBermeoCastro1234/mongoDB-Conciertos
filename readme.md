# Festival de Conciertos en Colombia

## Consultas

### Expresiones Regulares

**Buscar bandas cuyo nombre empiece por la letra “A”**  

    db.bandas.find({nombre:{$regex: "^[Aa]"}})
![Primer comando](capturas/1.png)

**Buscar asistentes cuyo nombre contenga "Gómez".**  

    db.asistentes.find({nombre:{$regex:"Gómez"}})
![](capturas/2.png)

### Operadores de Arreglos

**Buscar asistentes que tengan "Rock" dentro de su campo generos_favoritos.**  

    db.asistentes.find({generos_favoritos:{$regex:"Rock"}})
![](capturas/3.png)

### Aggregation Framework

**Agrupar presentaciones por escenario y contar cuántas presentaciones hay por cada uno.**  

    db.presentaciones.aggregate([{$group:{_id:"$escenario", totalPresentaciones:{$sum:1}}}])
![](capturas/4.png)

**Calcular el promedio de duración de las presentaciones.**  

    db.presentaciones.aggregate([{$group:{_id:"$banda",promedio:{$avg:"$duracion_minutos"}}}])
![](capturas/5.png)

## Funciones en system.js

**Crear una función llamada escenariosPorCiudad(ciudad) que devuelva todos los escenarios en esa ciudad.** 

    db.system.js.insertOne({_id:"ciudad",value:new Code ("function(valor){ var a = db.escenarios.find({ciudad:valor},{nombre:1});return a;}")});
![](capturas/6.png)

**Crear una función llamada bandasPorGenero(genero) que devuelva todas las bandas activas de ese género.** 

    db.system.js.insertOne({_id:'genero',value:new Code ("function(valor){const a = db.bandas.find({genero:valor},{nombre:1});return a;}")});
![](capturas/7.png)

## Transacciones (requiere replica set)

### Simular compra de un boleto:

**Insertar nuevo boleto en boletos_comprados de un asistente y Disminuir en 1 la capacidad del escenario correspondiente.**

    db.system.js.insertOne({
    _id: "comprarBoleto",
    value: new Code(
        "function(a,e,f){" +
        "db.asistentes.updateOne(" +
            "{_id:ObjectId(a)}," +
            "{$push:{boletos_comprados:{escenario:e,dia:f}}}" +
        ");" +
        "let r=db.escenarios.updateOne(" +
            "{nombre:e,capacidad:{$gt:0}}," +
            "{$inc:{capacidad:-1}}" +
        ");" +
        "if(r.modifiedCount===0)throw new Error('No hay capacidad');" +
        "return{success:true}" +
        "}"
    )
    });


![](capturas/8.png)

### Reversar la compra:

**Eliminar el boleto insertado anteriormente y Incrementar la capacidad del escenario.**

    db.system.js.insertOne({
    _id: "reversarCompra",
    value: new Code(`
        function(a, e, f) {
        db.asistentes.updateOne(
            { _id: ObjectId(a) },
            { $pull: { boletos_comprados: { escenario: e, dia: f } } }
        );
        
        db.escenarios.updateOne(
            { nombre: e },
            { $inc: { capacidad: 1 } }
        );
        
        return { success: true };
        }
    `)
    });

![](capturas/9.png)

## Índices + Consultas

### Crear un índice en `bandas.nombre` y buscar una banda específica por nombre.

    // Crear índice
    db.bandas.createIndex({ nombre: 1 });

    // Consultar banda específica (ej: Aterciopelados)
    db.bandas.find(
        { nombre: "Aterciopelados" },
        { nombre: 1, genero: 1, pais_origen: 1 }
    ).explain("executionStats");

![](capturas/10.png)

### Crear un índice en `presentaciones.escenario` y hacer una consulta para contar presentaciones de un escenario.

    // Crear índice
    db.presentaciones.createIndex({ escenario: 1 });

    // Contar presentaciones en un escenario (ej: Tarima Caribe)
    db.presentaciones.aggregate([
        { $match: { escenario: "Tarima Caribe" } },
        { $count: "total_presentaciones" }
    ]);

![](capturas/11.png)

### Crear un índice compuesto en `asistentes.ciudad` y edad, luego consultar asistentes de Bogotá menores de 30.   

    // Crear índice compuesto
    db.asistentes.createIndex({ ciudad: 1, edad: 1 });

    // Consultar asistentes de Bogotá menores de 30
    db.asistentes.find(
    { 
        ciudad: "Bogotá",
        edad: { $lt: 30 }
    },
    { nombre: 1, edad: 1, generos_favoritos: 1 }
    ).sort({ edad: 1 }); // Ordenados por edad ascendente

![](capturas/12.png)
