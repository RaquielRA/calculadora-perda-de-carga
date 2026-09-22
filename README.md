# Calculadora de Comprimento Equivalente em Tubulações Hidráulicas

Software aberto desenvolvido como atividade prática e memorial de cálculo para a disciplina de **Fenômenos de Transporte**, com foco em Hidráulica e Instalações Hidrossanitárias Prediais.

---

## 📌 Visão Geral do Projeto

A perda de carga localizada (ou singular) ocorre devido às perturbações no escoamento provocadas por componentes hidráulicos (joelhos, curvas, tês, válvulas, registros e reduções). 

O **Método dos Comprimentos Equivalentes** simplifica o cálculo desse fenômeno atribuindo a cada singularidade um comprimento virtual de tubo reto de mesmo diâmetro ($L_{eq}$) que geraria a mesma perda de energia por atrito.

### 📐 Equação Fundamental

$$L_{\text{total equivalente}} = L_{\text{real}} + \sum_{i=1}^{n} (N_i \cdot L_{eq, i})$$

Onde:
* $L_{\text{real}}$: Comprimento retilíneo do conduto em metros;
* $N_i$: Quantidade de unidades do acessório hidráulico $i$;
* $L_{eq, i}$: Comprimento equivalente unitário tabelado do acessório $i$ no diâmetro nominal adotado.

---

## 🚀 Funcionalidades

- **Seleção Dinâmica de Diâmetro:** Conversão direta entre medidas em polegadas ($1/4''$ a $14''$) e Diâmetros Nominais métricos (DN 8 a DN 350 mm).
- **Banco de Dados Técnico Integrado:** Baseado na planilha normativa técnica oficial (`1 Perda de Carga Localizada.xlsx`), contemplando conexões em **PVC**, **Metal** e **Aço**.
- **Cálculo em Tempo Real:** Atualização automática e instantânea de subtotais e somatórios ao modificar diâmetros ou quantidades.
- **Validação de Exercício Modelo:** Botão para carregar instantaneamente o caso de estudo de prova/aula:
  - 1 Entrada Normal / Saída de canalização em PVC $3/4''$ ($0{,}90\text{ m}$)
  - 5 Joelhos $90^\circ$ em PVC $3/4''$ ($5 \times 1{,}20 = 6{,}00\text{ m}$)
  - 2 Registros de Gaveta em Metal $3/4''$ ($2 \times 0{,}10 = 0{,}20\text{ m}$)
  - Trecho de tubo reto ($10{,}70\text{ m}$)
  - **Comprimento Equivalente Total:** $\mathbf{17{,}80\text{ m}}$
- **Emissão de Memorial / Impressão A4:** Exportação limpa formatada via CSS `@media print` pronta para anexar em relatórios técnicos.

---

## 🛠️ Arquitetura e Organização do Código

O projeto segue os princípios de **Clean Code** e separação de responsabilidades:

```text
├── index.html              # Estrutura semântica e interface do usuário
├── css/
│   └── styles.css          # Estilos customizados e regras de impressão A4
├── js/
│   ├── hydraulic-data.js   # Banco de dados de singularidades e diâmetros
│   ├── calculator.js       # Motor de cálculo puro (Física / Engenharia)
│   └── app.js              # Controlador de interface e manipulação do DOM
└── README.md               # Documentação técnica e acadêmica