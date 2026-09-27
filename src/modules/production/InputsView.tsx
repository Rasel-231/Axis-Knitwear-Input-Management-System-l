'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setInputStatus } from '../../core/store/slices/productionSlice';
import { PageHeader } from '../../components/ui/PageHeader';
import { ProductionFilters } from './components/ProductionFilters';
import { ProductionInputList } from './components/ProductionInputList';
import { selectFilteredInputs } from './selectors';
import { EMPTY_FILTERS, IProductionFilters, InputStatus, Role } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_META } from '../../core/lib/roleMeta';

export default function InputsView() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const meta = ROLE_META[(user?.role ?? Role.USER) as Role];
  const [filters, setFilters] = useState<IProductionFilters>({ ...EMPTY_FILTERS });

  const rows = useAppSelector((state) => selectFilteredInputs(state, filters));

  return (
    <div>
      <PageHeader
        title="Production input"
        description="Every rib, cutting, sewing and inspection record — searchable by style, cutting, color and buyer."
        actions={
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {meta.label}
          </span>
        }
      />

      <div className="flex flex-col gap-4">
        <ProductionFilters filters={filters} onChange={setFilters} resultCount={rows.length} />
        <ProductionInputList
          rows={rows}
          onSetStatus={(id, status: InputStatus) => dispatch(setInputStatus({ id, status }))}
        />
      </div>
    </div>
  );
}
