import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import MaterialTableList from './components/MaterialTableList';
import AddMaterialDialog from './components/AddMaterialDialog';
import { getMaterials, getSuppliers } from '@/services/api';

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMaterials = async () => {
    try {
      const [matRes, supRes] = await Promise.all([
        getMaterials(),
        getSuppliers(),
      ]);
      setMaterials(matRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filtered = materials.filter((m) =>
    m.materialName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-background w-full flex flex-col overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="shrink-0 mb-5">
        <h1 className="text-xl lg:text-2xl font-bold">Material Management</h1>
        <p className="text-sm text-muted-foreground hidden sm:block">
          Add and manage material records
        </p>
      </div>
      <div className="shrink-0 flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <Field className="w-full sm:max-w-sm lg:max-w-md">
          <ButtonGroup className="w-full">
            <Input
              placeholder="Type to search..."
              className="w-full bg-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </ButtonGroup>
        </Field>
        <AddMaterialDialog suppliers={suppliers} onSuccess={fetchMaterials} />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-border shadow-sm">
        <MaterialTableList
          materials={filtered}
          suppliers={suppliers}
          loading={loading}
          onSuccess={fetchMaterials}
        />
      </div>
    </div>
  );
};

export default MaterialPage;
