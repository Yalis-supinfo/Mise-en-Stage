import { useEffect, useRef, useState } from "react";
import Classe from "../components/classe";
import classesData from "../data/mise_en_stage.json";
import "../assets/styles/main.scss";

const groupes = {
    DEBUT: "DEBUT",
    FIN: "FIN"
}

const Main = () => {
    const [pref, setPref] = useState([]);
    const [groupe, setGroupe] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selected, setSelected] = useState([]);
    const [groupeForm, setGroupeForm] = useState({
        nombre: "",
        groupe: groupes.DEBUT
    });

    const refInputNombre = useRef(null);

    // rechargement de la page on prend les préférences dans le localStorage
    useEffect(() => {
        const storedPref = localStorage.getItem('pref');
        if (storedPref) {
            setPref(JSON.parse(storedPref));
        }

        const storedGroupe = localStorage.getItem('groupe');
        if (storedGroupe) {
            setGroupe(groupes[storedGroupe]);
        }
    }, []);


    // si pref est vide on prend les préférences par défaut
    useEffect(() => {
        if (pref.length === 0) {
            const newPref = classesData.map(classe => {
                return classe.ID
            });
            setPref(newPref);
        }
    }, [pref.length])

    // sauvegarde des préférences dans le localStorage
    useEffect(() => {
        localStorage.setItem('pref', JSON.stringify(pref));

        const newClasses = pref.map(ID => {
            return classesData.filter(classe => classe.ID === ID);
        }).flat();

        setClasses(newClasses);
    }, [pref])


    // si groupe est défini on le sauvegarde dans le localStorage
    useEffect(() => {
        if (groupe) {
            localStorage.setItem('groupe', groupe);
        }
    }, [groupe])

    useEffect(() => {
        if (selected) {
            localStorage.setItem('selected', JSON.stringify(selected));
        }
    }, [selected])
    

    const handlePref = (classe) => {}

    const handleGroupe = (e) => {
        if (e.target.id === "debut") {
            setGroupe(groupes.DEBUT);
        } else {
            setGroupe(groupes.FIN);
        }
    }

    const handleSelectedForm = (e) => {
        const newSelectedForm = {...groupeForm};

        if (e.target.name === "nombre") {
            newSelectedForm.nombre = parseInt(e.target.value);
        }

        if (e.target.id === "debutSelect") {
            newSelectedForm.groupe = groupes.DEBUT;
        }

        if (e.target.id === "finSelect") {
            newSelectedForm.groupe = groupes.FIN;
        }

        setGroupeForm(newSelectedForm);
        refInputNombre.current.focus();
    }

    const handleSelected = () => {
        if(disableSelected()) {
            return;
        }

        const newGroupe = {
            nombre: groupeForm.nombre,
            groupe: groupeForm.groupe,
            binome: selected.filter(select => select.nombre === groupeForm.nombre)[0] ? 2 : 1
        }

        if (newGroupe.binome === 2) {
            const newSelected = selected.map(select => {
                if (select.nombre === groupeForm.nombre) {
                    select = newGroupe;
                }
                return select;
            });

            setSelected(newSelected);
        }else {
            setSelected([...selected, newGroupe]);
        }

        setGroupeForm({
            nombre: "",
            groupe: groupeForm.groupe
        });

        refInputNombre.current.focus();
    }


    // renvoie true si on ne peut pas ajouter le groupe sélectionné
    const disableSelected = () => {
        const listSelected = selected.filter(select => select.nombre === groupeForm.nombre);
        if (listSelected.length === 1 && listSelected[0].binome < 2 && groupeForm.groupe === listSelected[0].groupe) {
            return false;
        }

        return (
            !groupeForm.nombre || 
            groupeForm.nombre < 0 || 
            classes.filter(classe => classe.ID === groupeForm.nombre).length === 0 ||
            listSelected.length > 0
        );
    }

    const hideClasse = (classe) => { 
        const listSelected = selected.filter(select => select.nombre === classe.ID);
        return listSelected.length === 1 && (listSelected[0].binome === 2 || groupe !== listSelected[0].groupe)
    }

    return (
        <div className="main">
            <header>
                <div>
                    <h2>Tu es :</h2>
                    <div className="inputGroupRadio">
                        <label htmlFor="debut">Début</label>
                        <input type="radio" name="debut" radioGroup="groupe" id="debut" checked={groupe === groupes.DEBUT} onChange={handleGroupe} />
                        <label htmlFor="fin">Fin</label>
                        <input type="radio" name="fin" radioGroup="groupe" id="fin" checked={groupe === groupes.FIN} onChange={handleGroupe} />
                    </div>
                </div>

                <button onClick={
                    () => {
                        setPref([]);
                        setSelected([]);
                    }
                }>
                    Tout effacer
                </button>
            </header>

            <main>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={5}><h1>Mes Préférences</h1></th>
                        </tr>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Num</th>
                            <th scope="col">Ecole</th>
                            <th scope="col">Niveau</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classe, index) => (
                            <Classe classe={classe} hide={hideClasse(classe)} prefId={index + 1} key={index} />
                        ))}
                    </tbody>
                </table>

                <div className="selected">
                    <div className="inputGroupSelected">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="number" name="nombre" id="nombre" value={groupeForm.nombre} onChange={handleSelectedForm} ref={refInputNombre} />
                        
                        <div>
                            <label htmlFor="debutSelect">Début</label>
                            <input type="radio" name="debutSelect" radioGroup="groupeSelect" id="debutSelect" checked={groupeForm.groupe === groupes.DEBUT} onChange={handleSelectedForm} />
                            
                            <label htmlFor="finSelect">Fin</label>
                            <input type="radio" name="finSelect" radioGroup="groupeSelect" id="finSelect" checked={groupeForm.groupe === groupes.FIN} onChange={handleSelectedForm} />
                        </div>

                        <button onClick={handleSelected} disabled={disableSelected()}>Ajouter</button>
                    </div>

                    <ul>
                        {selected.map((select, index) => (
                            <li key={index}>
                                <span>{select.nombre}</span>
                                <span>{select.groupe}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Main;