import mongoose from "mongoose";
//base de datos relacionada con los vehiculos a medias de el atributo: Placa. Cuando se seleccione una placa de un vehiculo se cargara los cambios de tal vehiculo.
const CambiosSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true
        //Cambio, Arreglo.
    },
    parte: {
        type: String,
        required: true
    },
    detalles: {
        type: String,
        required: true
        //ej: Se encontro una pieza del auto en mal estado, se cambio por uno nuevo.
    },
    encargado: {
        type: String,
        required: true
        //Nombre de quien hizo el cambio o arreglo.
    },
    placa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehiculo",
        required: true
    }
}, 
{
    timestamps: true  //Guarda tiempo de creacion/Modificacion
});

export default mongoose.model("Cambios", CambiosSchema);