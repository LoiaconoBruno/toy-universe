# Un universo de juguete

**Por qué unos nodos con presión negativa empujarían la expansión en lugar de frenarla.** Preprint de Bruno Loiacono, estudiante de Física (Universidad de Buenos Aires).

La idea imaginaba «nodos» ultradensos con presión negativa que frenarían la expansión del universo. En relatividad general la presión también gravita, y cualquier componente con w < −1/3 acelera la expansión en lugar de frenarla. El paper lo muestra con un modelo de Friedmann chequeado contra soluciones analíticas. También discute el equilibrio inestable de Einstein y las propuestas de gravastars y de agujeros negros acoplados a la expansión.

- 📄 **[PDF](paper/paper.pdf)**
- 🌐 **[Versión web](https://loiaconobruno.github.io/toy-universe/)**

> Preprint, documento de trabajo sin revisión por pares.

## Cómo se genera

`paper/paper.tex` es la única fuente. En cada push, GitHub Actions compila el PDF con TeX Live y arma la versión web (`index.html`). Para regenerar a mano las figuras, chequear las referencias o rearmar la página:

```bash
node paper/figuras/generar.js     # figuras y todas las cifras de la sección 4
python3 paper/verificar_bib.py    # cada referencia contra Crossref, Open Library o su URL
python3 paper/web.py              # index.html a partir del .tex
```

## Cómo citarlo

```bibtex
@misc{loiacono2026nodos,
  author       = {Loiacono, Bruno},
  title        = {Un universo de juguete: por qué unos nodos con presión negativa empujarían la expansión en lugar de frenarla},
  year         = {2026},
  howpublished = {Preprint, documento de trabajo sin revisión por pares},
  url          = {https://github.com/LoiaconoBruno/toy-universe}
}
```

## Licencia

El texto, las figuras y el PDF están bajo [CC BY 4.0](LICENSE-CC-BY-4.0.txt). Los scripts que generan las figuras y la página están bajo MIT. El detalle está en [LICENSE](LICENSE).
