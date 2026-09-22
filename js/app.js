/**
 * Controlador de Interface (UI / DOM Events)
 */

document.addEventListener('DOMContentLoaded', () => {
  const calc = new HydraulicCalculator();

  // Elementos do DOM
  const selectDiameter = document.getElementById('select-diameter');
  const labelActiveDiameter = document.getElementById('label-active-diameter');
  const selectMaterial = document.getElementById('select-material');
  const selectComponent = document.getElementById('select-component');
  const inputQty = document.getElementById('input-qty');
  const previewUnitLeq = document.getElementById('preview-unit-leq');
  const formAddAccessory = document.getElementById('form-add-accessory');
  const formAddPipe = document.getElementById('form-add-pipe');
  const inputPipeLength = document.getElementById('input-pipe-length');
  const tableItemsBody = document.getElementById('table-items-body');
  const tableEmptyState = document.getElementById('table-empty-state');
  const tableTotalLeq = document.getElementById('table-total-leq');
  const cardAccLeq = document.getElementById('card-acc-leq');
  const cardPipeLength = document.getElementById('card-pipe-length');
  const cardTotalLeq = document.getElementById('card-total-leq');
  const btnClearAll = document.getElementById('btn-clear-all');
  const btnLoadExercise = document.getElementById('btn-load-exercise');
  const btnPrint = document.getElementById('btn-print');
  const printDate = document.getElementById('print-date');

  // 1. Inicializar Diâmetros
  DIAMETERS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.value;
    opt.textContent = d.label;
    if (d.value === '3/4"') opt.selected = true;
    selectDiameter.appendChild(opt);
  });

  // 2. Atualizar lista de acessórios conforme o material selecionado
  function populateComponents() {
    const selectedMat = selectMaterial.value;
    selectComponent.innerHTML = '';

    const filtered = ACCESSORIES_DB.filter(acc => acc.material === selectedMat);
    filtered.forEach(acc => {
      const opt = document.createElement('option');
      opt.value = acc.id;
      opt.textContent = acc.nome;
      selectComponent.appendChild(opt);
    });

    updateUnitPreview();
  }

  // 3. Atualizar preview do Leq Unitário
  function updateUnitPreview() {
    const accId = selectComponent.value;
    const unitLeq = calc.getUnitLeq(accId, selectDiameter.value);
    previewUnitLeq.textContent = `${unitLeq.toFixed(2)} m`;
  }

  // 4. Renderizar Tabela e Totais
  function render() {
    tableItemsBody.innerHTML = '';

    if (calc.items.length === 0) {
      tableEmptyState.classList.remove('hidden');
    } else {
      tableEmptyState.classList.add('hidden');

      calc.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';

        tr.innerHTML = `
          <td class="py-2.5 px-4 font-mono text-slate-400 text-xs">${index + 1}</td>
          <td class="py-2.5 px-4 font-semibold text-slate-800">${item.name}</td>
          <td class="py-2.5 px-4">
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
              item.material === 'PVC' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              item.material === 'Metal' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              item.material === 'Aço' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              'bg-slate-100 text-slate-600 border border-slate-200'
            }">${item.material}</span>
          </td>
          <td class="py-2.5 px-4 text-center font-bold text-slate-700">${item.quantity}</td>
          <td class="py-2.5 px-4 text-right text-slate-600 font-mono">${item.unitLeq.toFixed(2)}</td>
          <td class="py-2.5 px-4 text-right font-bold text-slate-900 font-mono">${item.subtotalLeq.toFixed(2)}</td>
          <td class="py-2.5 px-4 text-center action-col">
            <button class="btn-delete p-1 text-slate-400 hover:text-rose-600 transition" data-id="${item.id}">
              <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
            </button>
          </td>
        `;

        tableItemsBody.appendChild(tr);
      });
    }

    const totals = calc.getTotals();
    cardAccLeq.textContent = `${totals.accessoriesLeq.toFixed(2)} m`;
    cardPipeLength.textContent = `${totals.pipeLength.toFixed(2)} m`;
    cardTotalLeq.textContent = `${totals.totalLeq.toFixed(2)} m`;
    tableTotalLeq.textContent = `${totals.totalLeq.toFixed(2)} m`;

    labelActiveDiameter.textContent = selectDiameter.options[selectDiameter.selectedIndex].text;

    // Recarregar ícones do Lucide
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Event Listeners
  selectDiameter.addEventListener('change', (e) => {
    calc.setDiameter(e.target.value);
    updateUnitPreview();
    render();
  });

  selectMaterial.addEventListener('change', populateComponents);
  selectComponent.addEventListener('change', updateUnitPreview);

  formAddAccessory.addEventListener('submit', (e) => {
    e.preventDefault();
    const accId = selectComponent.value;
    const qty = Math.max(1, parseInt(inputQty.value, 10) || 1);

    calc.addAccessory(accId, qty);
    inputQty.value = 1;
    render();
  });

  formAddPipe.addEventListener('submit', (e) => {
    e.preventDefault();
    const len = parseFloat(inputPipeLength.value);
    if (!isNaN(len) && len > 0) {
      calc.addPipe(len);
      inputPipeLength.value = '';
      render();
    }
  });

  tableItemsBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-delete');
    if (btn) {
      const id = parseFloat(btn.dataset.id);
      calc.removeItem(id);
      render();
    }
  });

  btnClearAll.addEventListener('click', () => {
    if (calc.items.length > 0 && confirm('Deseja realmente limpar toda a lista?')) {
      calc.clear();
      render();
    }
  });

  btnLoadExercise.addEventListener('click', () => {
    calc.loadClassroomExercise();
    selectDiameter.value = '3/4"';
    updateUnitPreview();
    render();
  });

  btnPrint.addEventListener('click', () => {
    if (printDate) {
      printDate.textContent = `Emissão: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;
    }
    window.print();
  });

  // Inicialização
  populateComponents();
  calc.loadClassroomExercise(); // Já inicia com o exercício de aula carregado para conferência
  render();
});