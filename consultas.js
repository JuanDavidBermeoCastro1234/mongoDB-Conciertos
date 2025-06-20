db.bandas.find({nombre:{$regex: "^[Aa]"}})

db.asistentes.find({nombre:{$regex:"Gómez"}})

db.asistentes.find({generos_favoritos:{$regex:"Rock"}})

db.presentaciones.aggregate([{$group:{_id:"$escenario", totalPresentaciones:{$sum:1}}}])

db.presentaciones.aggregate([{$group:{_id:"$banda",promedio:{$avg:"$duracion_minutos"}}}])

db.system.js.insertOne({_id:"ciudad",value:new Code ("function(valor){ var a = db.escenarios.find({ciudad:valor},{nombre:1});return a;}")});

db.system.js.insertOne({_id:'genero',value:new Code ("function(valor){const a = db.bandas.find({genero:valor},{nombre:1});return a;}")});

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