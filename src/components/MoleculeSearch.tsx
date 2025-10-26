    import { useState } from 'react';
    import { Search, Loader2 } from 'lucide-react';
    import { searchMolecule } from '../lib/pubchem';
    import type { MoleculeData } from '../types';

    interface MoleculeSearchProps {
    onMoleculeFound: (molecule: MoleculeData) => void;
    }

    export default function MoleculeSearch({ onMoleculeFound }: MoleculeSearchProps) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');

        try {
        const molecule = await searchMolecule(query);
        onMoleculeFound(molecule);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Buscar Molécula</h2>

        <form onSubmit={handleSearch} className="space-y-4">
            <div>
            <label htmlFor="molecule-search" className="block text-sm font-medium text-slate-700 mb-2">
                Nombre o Fórmula Química
            </label>
            <div className="relative">
                <input
                id="molecule-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ej: ethanol, glucose, H2O"
                className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={loading}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            </div>

            {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
            )}

            <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
            {loading ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Buscando...
                </>
            ) : (
                <>
                <Search className="w-5 h-5" />
                Buscar
                </>
            )}
            </button>
        </form>
        </div>
    );
    }
