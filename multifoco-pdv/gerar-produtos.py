"""
Gera produtos.js a partir da planilha "TABELA DE PRODUTOS.xlsx".

Use este script sempre que o fornecedor enviar uma tabela de preços
atualizada. Ele lê a planilha, mantém só os campos que o app usa
(Descrição, EAN, Código, Indústria, Preço Final + ST) e regrava produtos.js.

Uso:
    python3 gerar-produtos.py

Requer a biblioteca openpyxl (pip3 install openpyxl).
"""
import json
import sys

import openpyxl

ARQUIVO_ENTRADA = "TABELA DE PRODUTOS.xlsx"
ARQUIVO_SAIDA = "produtos.js"


def main():
    try:
        wb = openpyxl.load_workbook(ARQUIVO_ENTRADA, data_only=True)
    except FileNotFoundError:
        sys.exit(
            f'Não encontrei "{ARQUIVO_ENTRADA}" nesta pasta. '
            "Coloque a planilha atualizada aqui do lado deste script e rode de novo."
        )

    ws = wb["rpt_TabelaPreco"]
    rows = list(ws.iter_rows(min_row=3, values_only=True))

    products = []
    for r in rows:
        desc, codigo, ean, industria, price = r[1], r[2], r[3], r[4], r[10]
        if not ean or not desc:
            continue
        products.append({
            "ean": str(ean).strip(),
            "codigo": str(codigo).strip() if codigo else "",
            "name": str(desc).strip(),
            "lab": (industria or "").strip(),
            "price": round(float(price), 2) if price is not None else 0.0,
        })

    with open(ARQUIVO_SAIDA, "w", encoding="utf-8") as f:
        f.write("/* Gerado a partir de TABELA DE PRODUTOS.xlsx — campos: EAN, Código, Descrição, Indústria, Preço Final + ST */\n")
        f.write("const PRODUCTS = ")
        f.write(json.dumps(products, ensure_ascii=False, indent=2))
        f.write(";\n")

    print(f"OK: {len(products)} produtos gravados em {ARQUIVO_SAIDA}")


if __name__ == "__main__":
    main()
