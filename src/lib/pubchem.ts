import type { MoleculeData } from '../types';

const PUBCHEM_API = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

export async function searchMolecule(query: string): Promise<MoleculeData> {
  try {
    const isFormula = /^[A-Z][a-z]?\d*/.test(query) && !query.includes(' ');
    const searchType = isFormula ? 'formula' : 'name';

    const cidResponse = await fetch(
      `${PUBCHEM_API}/compound/${searchType}/${encodeURIComponent(query)}/cids/JSON`
    );
    if (!cidResponse.ok) throw new Error('Molécula no encontrada');

    const cidData = await cidResponse.json();
    const cid = cidData.IdentifierList?.CID?.[0];
    if (!cid) throw new Error('Molécula no encontrada');

    const propsResponse = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
    );
    const propsData = await propsResponse.json();
    const props = propsData.PropertyTable?.Properties?.[0];

    if (!props) throw new Error('No se pudieron obtener las propiedades');

    const sdfResponse = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`
    );
    const sdf = await sdfResponse.text();

    const atomCount = countAtoms(props.MolecularFormula || '');

    return {
      cid,
      molecularFormula: props.MolecularFormula || 'N/A',
      molecularWeight: Number(props.MolecularWeight) || 0,
      iupacName: props.IUPACName || 'N/A',
      atomCount,
      sdf,
    };
  } catch (err) {
    throw new Error((err as Error).message || 'Error al buscar la molécula');
  }
}

function countAtoms(formula: string): number {
  const matches = formula.match(/[A-Z][a-z]?\d*/g) || [];
  return matches.reduce((count, element) => {
    const num = element.match(/\d+$/);
    return count + (num ? parseInt(num[0]) : 1);
  }, 0);
}
