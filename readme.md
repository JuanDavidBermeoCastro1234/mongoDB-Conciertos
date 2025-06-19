    db.bandas.find({nombre:{$regex: "^[Aa]"}})
![Primer comando](capturas/1.png)

    db.asistentes.find({nombre:{$regex:"Gómez"}})

![](capturas/2.png)

    db.asistentes.find({generos_favoritos:{$regex:"Rock"}})

![](capturas/3.png)

    db.presentaciones.aggregate([{$group:{_id:"$escenario", totalPresentaciones:{$sum:1}}}])

![](capturas/4.png)


    db.presentaciones.aggregate([{$group:{_id:"$banda",promedio:{$avg:"$duracion_minutos"}}}])
![](capturas/5.png)


    db.system.js.insertOne({_id:"ciudad",value:new Code ("function(valor){ var a = db.escenarios.find({ciudad:valor},{nombre:1});return a;}")});

![](capturas/6.png)
