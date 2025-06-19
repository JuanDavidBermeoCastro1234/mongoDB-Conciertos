db.bandas.find({nombre:{$regex: "^[Aa]"}})

db.asistentes.find({nombre:{$regex:"Gómez"}})

db.asistentes.find({generos_favoritos:{$regex:"Rock"}})

db.presentaciones.aggregate([{$group:{_id:"$escenario", totalPresentaciones:{$sum:1}}}])

db.presentaciones.aggregate([{$group:{_id:"$banda",promedio:{$avg:"$duracion_minutos"}}}])

db.system.js.insertOne({_id:"ciudad",value:new Code ("function(valor){ var a = db.escenarios.find({ciudad:valor},{nombre:1});return a;}")});