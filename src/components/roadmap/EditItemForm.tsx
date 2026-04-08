'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import type {
  RoadmapCardItem,
  MoscowPriority,
  RoadmapStatus,
  ImpactLevel,
  EffortLevel,
} from '@/types/roadmap';

const DEPARTMENTS = ['Vendas', 'Financeiro', 'Operações', 'Atendimento', 'Marketing', 'Tech'];

interface EditItemFormProps {
  item: RoadmapCardItem;
  onClose: () => void;
}

export function EditItemForm({ item, onClose }: EditItemFormProps) {
  const updateItem = useRoadmapStore((s) => s.updateItem);
  const deleteItem = useRoadmapStore((s) => s.deleteItem);

  const [titulo, setTitulo] = useState(item.titulo);
  const [descricao, setDescricao] = useState(item.descricao ?? '');
  const [prioridade, setPrioridade] = useState<MoscowPriority>(item.prioridade);
  const [impacto, setImpacto] = useState<ImpactLevel>(item.impacto);
  const [esforco, setEsforco] = useState<EffortLevel>(item.esforco);
  const [status, setStatus] = useState<RoadmapStatus>(item.status);
  const [departamento, setDepartamento] = useState(item.departamento);
  const [squad, setSquad] = useState(item.squad ?? '');
  const [dataInicio, setDataInicio] = useState(item.data_inicio ?? '');
  const [dataFim, setDataFim] = useState(item.data_fim ?? '');
  const [tagsInput, setTagsInput] = useState((item.tags ?? []).join(', '));
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!titulo.trim()) return;

      setSubmitting(true);
      await updateItem(item.id, {
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        prioridade,
        impacto,
        esforco,
        status,
        departamento,
        squad: squad.trim() || undefined,
        data_inicio: dataInicio || undefined,
        data_fim: dataFim || undefined,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setSubmitting(false);
      onClose();
    },
    [titulo, descricao, prioridade, impacto, esforco, status, departamento, squad, dataInicio, dataFim, tagsInput, updateItem, item.id, onClose],
  );

  const handleDelete = useCallback(async () => {
    await deleteItem(item.id);
    onClose();
  }, [deleteItem, item.id, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg mx-4 glass rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Editar Item</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
              Título *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Prioridade
              </label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as MoscowPriority)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
              >
                <option value="must" className="bg-[#111]">Must Have</option>
                <option value="should" className="bg-[#111]">Should Have</option>
                <option value="could" className="bg-[#111]">Could Have</option>
                <option value="wont" className="bg-[#111]">Won&apos;t Have</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoadmapStatus)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
              >
                <option value="planned" className="bg-[#111]">Planejado</option>
                <option value="in_progress" className="bg-[#111]">Em Progresso</option>
                <option value="done" className="bg-[#111]">Concluído</option>
              </select>
            </div>
          </div>

          {/* Impact + Effort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Impacto
              </label>
              <select
                value={impacto}
                onChange={(e) => setImpacto(e.target.value as ImpactLevel)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
              >
                <option value="high" className="bg-[#111]">Alto</option>
                <option value="medium" className="bg-[#111]">Médio</option>
                <option value="low" className="bg-[#111]">Baixo</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Esforço
              </label>
              <select
                value={esforco}
                onChange={(e) => setEsforco(e.target.value as EffortLevel)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
              >
                <option value="high" className="bg-[#111]">Alto</option>
                <option value="medium" className="bg-[#111]">Médio</option>
                <option value="low" className="bg-[#111]">Baixo</option>
              </select>
            </div>
          </div>

          {/* Department + Squad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Departamento
              </label>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="bg-[#111]">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Squad
              </label>
              <input
                type="text"
                value={squad}
                onChange={(e) => setSquad(e.target.value)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Data Início
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
                Data Fim
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-white focus:border-[rgba(255,255,255,0.2)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          {/* Delete */}
          <div>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Confirmar exclusão?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md px-2.5 py-1 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 transition-colors"
                >
                  Sim, excluir
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-md px-2.5 py-1 text-[11px] text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} />
                Excluir
              </button>
            )}
          </div>

          {/* Save / Cancel */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!titulo.trim() || submitting}
              className="rounded-lg px-4 py-2 text-xs font-medium text-white transition-all duration-150 disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
