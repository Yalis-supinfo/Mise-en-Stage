import '../assets/styles/classe.scss';
import sortSVG from '../assets/img/carbon_chevron-sort.svg';

const Classe = ({ classe, hide, prefId }) => {
    return (
        <>
        <tr className={`classe ${hide ? "hidden" : ""}`}>
            <th scope="row" className='index'>{prefId}</th>
            <td className='row'>{classe.ID}</td>
            <td className='row'>{classe.ECOLE}</td>
            <td className='row'>{classe.NIVEAU}</td>
            <td className='row'>
                <button>
                    <img src={sortSVG} alt="sort" height={40} width={40}/>
                </button>
            </td>
        </tr>
        <tr className='odd'></tr>
        </>
    )
}

export default Classe;