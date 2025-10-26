    import { ExternalLink, Atom } from 'lucide-react';
    import type { MoleculeData } from '../types';

    interface MoleculeInfoProps {
    molecule: MoleculeData | null;
    }

    export default function MoleculeInfo({ molecule }: MoleculeInfoProps) {
    if (!molecule) {
        return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex items-center justify-center">
            <div className="text-center text-slate-400">
            <Atom className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Busca una molécula para ver sus propiedades</p>
            </div>
        </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Propiedades Químicas</h2>

        <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start justify-between">
                <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                    Fórmula Molecular
                </p>
                <p className="text-2xl font-bold text-slate-800">{molecule.molecularFormula}</p>
                </div>
                <Atom className="w-8 h-8 text-blue-500 opacity-70" />
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs font-medium text-slate-600 mb-1">Peso Molecular</p>
                <p className="text-lg font-semibold text-slate-800">
                {molecule.molecularWeight.toFixed(2)} g/mol
                </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs font-medium text-slate-600 mb-1">Número de Átomos</p>
                <p className="text-lg font-semibold text-slate-800">{molecule.atomCount}</p>
            </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-1">Nombre IUPAC</p>
            <p className="text-sm text-slate-800 break-words">{molecule.iupacName}</p>
            </div>

            <a
            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${molecule.cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-3 transition-colors group"
            >
            <span className="text-sm font-medium">Ver en PubChem (CID: {molecule.cid})</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
        </div>
        </div>
    );
    }