/**
 * Motor de Cálculo Puro (Clean Architecture)
 * Desacoplado da interface visual para execução de testes e cálculos.
 */

class HydraulicCalculator {
  constructor() {
    this.currentDiameter = '3/4"';
    this.items = [];
  }

  setDiameter(diameter) {
    this.currentDiameter = diameter;
    this.recalculateAll();
  }

  getUnitLeq(accessoryId, diameter = this.currentDiameter) {
    const acc = ACCESSORIES_DB.find(item => item.id === Number(accessoryId));
    if (!acc || !acc.valores[diameter]) return 0.0;
    return acc.valores[diameter];
  }

  addAccessory(accessoryId, quantity = 1) {
    const acc = ACCESSORIES_DB.find(item => item.id === Number(accessoryId));
    if (!acc) return null;

    const unitLeq = this.getUnitLeq(accessoryId);
    const subtotal = Number((unitLeq * quantity).toFixed(3));

    const item = {
      id: Date.now() + Math.random(),
      type: 'accessory',
      accessoryId: acc.id,
      name: acc.nome,
      material: acc.material,
      quantity: Number(quantity),
      unitLeq: unitLeq,
      subtotalLeq: subtotal
    };

    this.items.push(item);
    return item;
  }

  addPipe(length) {
    const pipeLength = Math.max(0, Number(length));
    const item = {
      id: Date.now() + Math.random(),
      type: 'pipe',
      name: 'Trecho Reto de Tubulação',
      material: 'Linear',
      quantity: 1,
      unitLeq: pipeLength,
      subtotalLeq: pipeLength
    };

    this.items.push(item);
    return item;
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  clear() {
    this.items = [];
  }

  recalculateAll() {
    this.items.forEach(item => {
      if (item.type === 'accessory') {
        item.unitLeq = this.getUnitLeq(item.accessoryId);
        item.subtotalLeq = Number((item.unitLeq * item.quantity).toFixed(3));
      }
    });
  }

  getTotals() {
    let accessoriesLeq = 0;
    let pipeLength = 0;

    this.items.forEach(item => {
      if (item.type === 'accessory') {
        accessoriesLeq += item.subtotalLeq;
      } else if (item.type === 'pipe') {
        pipeLength += item.subtotalLeq;
      }
    });

    const total = accessoriesLeq + pipeLength;

    return {
      accessoriesLeq: Number(accessoriesLeq.toFixed(2)),
      pipeLength: Number(pipeLength.toFixed(2)),
      totalLeq: Number(total.toFixed(2))
    };
  }

  /**
   * Carrega o problema de validação prático da disciplina (Aula / P2):
   * Tubulação 3/4":
   * 1 Entrada Normal (Saída de canalização PVC 3/4"): 0.9 m
   * 5 Joelhos 90° (PVC 3/4"): 5 x 1.2 = 6.0 m
   * 2 Registros de Gaveta (Metal 3/4"): 2 x 0.1 = 0.2 m
   * Tubo reto: 10.7 m
   * Total esperado: 17.80 m
   */
  loadClassroomExercise() {
    this.clear();
    this.setDiameter('3/4"');

    this.addAccessory(42, 1); // Saída/Entrada de canalização PVC
    this.addAccessory(0, 5);  // Joelho 90° PVC
    this.addAccessory(52, 2); // Registro de gaveta Metal
    this.addPipe(10.7);       // Tubulação reta
  }
}