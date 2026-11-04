# Un universo de juguete: paper de uso y guía de la idea

## Resumen

Este documento acompaña a **Toy Universe**, un modelo de juguete de Friedmann interactivo construido para resolver la contradicción central de una idea: zonas ultradensas con **presión negativa** (los "nodos"), ¿frenan la expansión del universo o la empujan? La respuesta de la relatividad general es contraintuitiva: en cosmología la presión también gravita, y una presión lo bastante negativa **empuja**. La idea original quería que los nodos contrarrestaran la expansión con presión negativa; la física dice que harían lo contrario.

La primera parte es un paper de uso: escenarios, controles, un ejemplo resuelto con los números que da la herramienta y sus límites. La segunda es una guía de la idea, que recorre la cosmología relativista desde el universo estático de Einstein (1917) y las soluciones de Friedmann (1922) y Lemaître (1927), pasando por la inestabilidad que señaló Eddington (1930), el descubrimiento de la expansión acelerada por Riess, Perlmutter y Schmidt (1998), el problema de la constante cosmológica según Zel'dovich y Weinberg, hasta propuestas recientes en las que objetos compactos con interior de presión negativa, como las gravastars de Mazur y Mottola o los agujeros negros "acoplados cosmológicamente" de Farrah y colaboradores (2023), serían la fuente de la energía oscura. Termina con las dos versiones posibles de la idea, A (los nodos empujan) y B (los nodos frenan), y qué haría falta para que cada una funcione.

## Parte I. Paper de uso

### 1. Qué es la herramienta

Toy Universe es una página estática sin dependencias que se abre desde la [demo en vivo](https://loiaconobruno.github.io/toy-universe/) o con doble clic en `index.html`. Resuelve numéricamente las ecuaciones de Friedmann para un universo homogéneo con cinco ingredientes: materia, radiación, constante cosmológica, "nodos" (una componente con ecuación de estado w elegible) y curvatura. Muestra:

- **Escenarios:** botones que cargan configuraciones predefinidas.
- **Controles:** deslizadores para cada parámetro.
- **Resultado:** si los nodos empujan o frenan, si la expansión se acelera hoy, la edad del universo y su destino.
- **Tamaño del universo en el tiempo:** la curva a(t) desde el big bang hasta el futuro, con el tiempo en miles de millones de años desde hoy. En cualquier escenario distinto del de hoy, se superpone en línea punteada la curva de ΛCDM para comparar.
- **La ecuación que decide:** un panel fijo con la segunda ecuación de Friedmann, la explicación de por qué la presión negativa empuja y la equivalencia con la propuesta de Farrah y colaboradores.

La física está en `src/cosmos.js`, sin acceso al DOM. Los tests se corren con `npm test` (Node 18 o más nuevo).

### 2. Instalación

```bash
git clone https://github.com/LoiaconoBruno/toy-universe.git
cd toy-universe
npm test
```

Después se abre `index.html` con doble clic.

### 3. Unidades

La herramienta usa unidades cosmológicas naturales:

- El tiempo se mide en unidades de 1/H₀, la inversa de la constante de Hubble. Con H₀ = 70 km/s/Mpc, 1/H₀ ≈ 13,97 mil millones de años. Para mostrar edades en años, la página multiplica por ese valor.
- Las densidades se miden en unidades donde 8πG/3 = 1 y el ritmo de expansión actual es 1. En esas unidades, la densidad de cada componente hoy es su **parámetro de densidad** Ω, el número que usan los cosmólogos: Ωm = 0,3 quiere decir que la materia aporta el 30 % de la densidad crítica.
- El tamaño del universo se mide con el factor de escala a, que vale 1 hoy. a = 0,5 quiere decir que las distancias entre galaxias eran la mitad que ahora.

### 4. Escenarios

| Escenario | Ωm | Ωr | ΩΛ | Ωnodos | w | k | Empujón |
|---|---|---|---|---|---|---|---|
| Universo de hoy (ΛCDM) | 0,3 | 0 | 0,7 | 0 | −1 | 0 | 0 |
| A: los nodos empujan | 0,3 | 0 | 0 | 0,7 | −1 | 0 | 0 |
| B: los nodos frenan | 0,3 | 0 | 0 | 0,7 | 1/3 | 0 | 0 |
| Einstein 1917: universo estático | 2/3 | 0 | 1/3 | 0 | −1 | 1 | 0,001 |

### 5. Controles

| Control | Rango | Qué representa |
|---|---|---|
| Materia (Ωm) | 0 a 3 | Materia ordinaria y oscura; presión despreciable (w = 0) |
| Radiación (Ωr) | 0 a 0,5 | Fotones y neutrinos relativistas (w = 1/3) |
| Constante cosmológica (ΩΛ) | 0 a 2 | Energía del vacío (w = −1) |
| Nodos (Ωn) | 0 a 2 | La componente de la idea |
| Ecuación de estado de los nodos (w) | −1,5 a 1 | Cociente entre presión y densidad de energía, p = w ρc² |
| Curvatura k | −1 a 3 | Positiva: universo cerrado; negativa: abierto; cero: plano |
| Empujón inicial extra | −0,01 a 0,01 | Velocidad que se suma a la de Friedmann; sirve para perturbar el universo estático |

### 6. Resultados

- **Los nodos:** "empujan", "frenan" o "neutro", según el signo de 1 + 3w.
- **¿La expansión se acelera hoy?:** "Sí" si el parámetro de desaceleración q₀ es negativo, "No" si es positivo y "Casi quieto" si q₀ es prácticamente cero (el universo estático). El texto debajo muestra el valor de q₀.
- **Edad del universo:** el tiempo desde a = 0 (big bang) hasta hoy, en miles de millones de años. En el universo casi estático dice "No aplica"; si la integración hacia atrás no llega al big bang en el tiempo disponible, dice "Más de 280 mil millones de años".
- **Destino:** "Sigue expandiéndose", "Recolapsa" o "Se queda quieto".
- Si la combinación de parámetros da un ritmo de expansión imaginario (Σρ < k), la página avisa que ese universo no puede existir.

### 7. Ejemplo resuelto

**ΛCDM.** Al abrir, el universo tiene 30 % de materia y 70 % de constante cosmológica, sin curvatura.

1. El parámetro de desaceleración es q₀ = Σ Ωᵢ(1 + 3wᵢ)/2 = 0,3 · 1/2 + 0,7 · (1 − 3)/2 = 0,15 − 0,70 = **−0,55**. Es negativo: la expansión **se acelera**.
2. Integrando hacia atrás hasta a = 0, la edad es 0,964/H₀ ≈ **13,5 mil millones de años**, muy cerca del valor medido por el satélite Planck (13,8 con H₀ = 67,4).

**Escenario A.** Los nodos con w = −1 reemplazan a la constante cosmológica. Como ρ ∝ a^(−3(1+w)) = a⁰, su densidad no cambia con la expansión, igual que Λ. El resultado es **idéntico**: q₀ = −0,55 y 13,5 mil millones de años. Los nodos **empujan**.

**w = −0,2.** Con el deslizador de w en −0,2, 1 + 3w = 0,4 > 0. Los nodos ahora **frenan**: q₀ = 0,15 + 0,7 · 0,4/2 = **0,29**. La expansión ya no se acelera y la curva se separa de la de ΛCDM.

**Escenario B.** Con w = 1/3 (como la radiación), q₀ = 0,15 + 0,7 · 2/2 = **0,85** y la edad baja a 0,528/H₀ ≈ **7,4 mil millones de años**. Es menos que la edad de las estrellas más viejas conocidas (unos 12 a 13 mil millones de años para los cúmulos globulares más antiguos): un universo así no podría contenerlas.

**Einstein 1917.** Con 2/3 de materia, 1/3 de constante cosmológica y curvatura k = 1, el ritmo de Friedmann es ȧ² = 2/3 + 1/3 − 1 = 0: el universo está quieto. El escenario agrega un empujón de 0,001. El destino es **"Sigue expandiéndose"**: la curva se queda casi quieta un buen rato y después se escapa. Con el empujón en 0, **"Se queda quieto"**. Con −0,001, **"Recolapsa"**. El equilibrio existe, pero cualquier perturbación lo rompe.

### 8. Cómo leer los resultados

- El dato decisivo de cada componente es **1 + 3w**: si es positivo, la componente frena; si es negativo, empuja. El límite es w = −1/3.
- La materia (w = 0) y la radiación (w = 1/3) siempre frenan. La constante cosmológica (w = −1) siempre empuja.
- La edad del universo depende de cuánto frenó la expansión en el pasado: un universo que frenó mucho llegó rápido a su ritmo actual y es más joven.
- La curvatura no empuja ni frena directamente en la segunda ecuación de Friedmann; entra en la primera, fijando la velocidad inicial.

#### 8.1 Preguntas frecuentes

**¿Por qué los nodos con w = −1 dan exactamente lo mismo que Λ?** Porque, en un modelo homogéneo, una componente queda completamente caracterizada por su densidad hoy y su w. Dos componentes con el mismo Ω y el mismo w son indistinguibles en estas ecuaciones. Si los nodos tienen w = −1, son una constante cosmológica.

**¿Qué pasa con w menor que −1?** La densidad de los nodos **crece** con la expansión: ρ ∝ a^(−3(1+w)) con exponente positivo. Esa componente se llama **energía fantasma**. Robert Caldwell, Marc Kamionkowski y Nevin Weinberg mostraron en 2003 que puede llevar a un "Big Rip": un tiempo finito en el futuro en el que la expansión desgarra galaxias, estrellas y átomos. La herramienta permite explorar w hasta −1,5, pero solo integra hasta 4/H₀ en el futuro.

**¿Por qué el escenario de Einstein dice "No aplica" en la edad?** Porque, empezando casi quieto en a = 1, el universo estático no tiene un big bang cercano: hacia atrás se queda casi quieto durante muchísimo tiempo. La integración llegaría a un a muy chico después de unas 7/H₀ (casi cien mil millones de años), pero ese número depende por completo del tamaño del empujón y no tiene el significado de una edad, así que la página no lo muestra.

**¿Los nodos tienen que ser un fluido?** En la herramienta, sí. En la idea, los nodos serían objetos localizados. Tratar objetos como un fluido es una aproximación estándar en cosmología cuando están distribuidos de manera bastante uniforme a gran escala (así se tratan las galaxias en la "materia"). La sección 15 discute cuándo deja de valer.

#### 8.2 Recorrido guiado

1. **El límite de −1/3.** En el escenario A, bajá w desde −1 hacia 0 de a poco, mirando el recuadro "Los nodos". *¿En qué valor cambia de "Empujan" a "Frenan"?* En −1/3. Mirá también q₀ en el texto de abajo: no cruza el cero en −1/3 sino en w ≈ −0,48, porque la materia también frena y los nodos tienen que compensarla: entre −0,48 y −1/3 los nodos empujan, pero no alcanza para que el universo entero acelere.
2. **La edad.** Con el mismo escenario, anotá la edad para w = −1, −0,5, 0 y 1/3. *¿Por qué baja?* Porque un universo que frenó más en el pasado se expandía más rápido antes y llegó antes a su tamaño actual.
3. **La curvatura.** Volvé a ΛCDM y subí k a 0,5. *¿Qué pasa con la edad y con el destino?* La edad sube a unos 20 mil millones de años: con menos velocidad inicial (ȧ₀² = Σρ − k = 0,5), el universo tardó más en llegar a su tamaño actual. Ahora probá k = 1,5: la página avisa que ese universo no puede existir, porque Σρ = 1 < k.
4. **Recolapso.** Sacá la constante cosmológica (ΩΛ = 0), poné materia en 3 y curvatura en 2. *¿Qué destino informa?* Recolapsa: un universo cerrado con mucha materia y sin nada que empuje vuelve a contraerse.
5. **Einstein.** En el escenario de 1917, poné el empujón en 0,0005, 0 y −0,0005. *¿Cuánto tarda en escaparse o en recolapsar?* Cuanto más chico el empujón, más tiempo se queda casi quieto, pero tarde o temprano se va.
6. **Fantasma.** Volvé al escenario A y bajá w a −1,5. *¿Cómo cambia la curva hacia el futuro respecto de ΛCDM?* Crece más rápido: la densidad de los nodos aumenta con la expansión.

### 9. Limitaciones

- Universo homogéneo: los nodos se tratan como un fluido más, no como objetos localizados.
- No ajusta datos reales (supernovas, fondo cósmico, oscilaciones acústicas de bariones). Los escenarios son ilustrativos.
- La retroalimentación que haría estable el equilibrio está modelada solo a través de w; un mecanismo dinámico queda pendiente.
- w es constante en el tiempo.

## Parte II. Guía de la idea

### 10. La idea y su contradicción

La idea original imaginaba un universo con "nodos": zonas ultradensas, con algo parecido a una curvatura invertida y presión negativa, que contrarrestarían la expansión del universo. La intuición detrás es razonable a primera vista: si algo "tira hacia adentro" (presión negativa es una tensión, como la de una banda elástica estirada), debería frenar la expansión.

La relatividad general dice lo contrario. En la cosmología de Einstein, la fuente de la gravedad no es solo la densidad de energía sino la combinación ρ + 3p/c². Una presión negativa lo bastante grande hace que esa combinación sea negativa, y entonces la gravedad se vuelve **repulsiva**: acelera la expansión. Eso es exactamente lo que hace la energía oscura. Los nodos de la idea, si tienen presión negativa, no frenarían el universo sino que lo empujarían.

Esta guía explica por qué, de dónde sale la ecuación, qué dijeron sobre esto Einstein, Friedmann, Lemaître, Eddington y los descubridores de la aceleración cósmica, y qué propuestas recientes se parecen a los nodos.

### 11. El universo de Einstein, 1917

#### 11.1 Un universo que no se mueve

En 1917, dos años después de formular la relatividad general, Einstein la aplicó al universo entero en *Kosmologische Betrachtungen zur allgemeinen Relativitätstheorie* (*Sitzungsberichte der Preussischen Akademie der Wissenschaften*, 142–152). En esa época se creía que el universo era estático: las estrellas de la Vía Láctea no mostraban ningún movimiento global, y la existencia de otras galaxias todavía se discutía.

Einstein encontró que sus ecuaciones no admitían un universo estático lleno de materia: la gravedad lo haría colapsar. Para evitarlo, agregó un término, la **constante cosmológica** Λ, que actúa como una repulsión uniforme. Con el valor justo de Λ, la repulsión equilibra la atracción de la materia y el universo queda quieto. Además, ese universo es **cerrado**: tiene curvatura espacial positiva, como la superficie de una esfera pero en tres dimensiones, y volumen finito.

#### 11.2 Las condiciones del equilibrio

En las unidades de la herramienta (8πG/3 = 1), las dos ecuaciones de Friedmann son

$$ (ȧ/a)² = Σ ρᵢ − k/a² $$

$$ ä/a = −(1/2) Σ ρᵢ (1 + 3wᵢ) $$

Para que el universo esté quieto en a = 1, hace falta ä = 0 y ȧ = 0. Con materia (w = 0) y constante cosmológica (w = −1):

- ä = 0 exige ρm · 1 + ρΛ · (−2) = 0, es decir, ρm = 2ρΛ.
- ȧ = 0 exige ρm + ρΛ = k.

Con k = 1, sale ρm = 2/3 y ρΛ = 1/3: los valores del escenario "Einstein 1917".

#### 11.3 Eddington y la inestabilidad

En 1930, Arthur Eddington publicó *On the instability of Einstein's spherical world* (*Monthly Notices of the Royal Astronomical Society*, 90, 668–678). Mostró que el equilibrio de Einstein es inestable, como un lápiz parado sobre la punta. Si el universo se expande un poco, la densidad de materia baja (ρm ∝ a⁻³) mientras que la de Λ no cambia; la repulsión gana y la expansión se acelera. Si se contrae un poco, la materia se concentra, la atracción gana y el colapso se acelera.

La herramienta lo muestra con el empujón: 0,001 hacia afuera y el universo termina escapando; 0,001 hacia adentro y recolapsa. Solo con exactamente cero se queda quieto. En la naturaleza, siempre hay perturbaciones: las fluctuaciones de densidad que formaron las galaxias habrían bastado para sacar al universo de Einstein de su equilibrio.

Esta inestabilidad es importante para la versión B de la idea: si los nodos pretenden mantener el universo en equilibrio, tienen que hacer algo que la constante cosmológica de Einstein no hace, es decir, **reaccionar** a las perturbaciones. Volveremos sobre esto en la sección 17.

### 12. Friedmann, Lemaître y el universo que se expande

#### 12.1 Friedmann, 1922

Aleksandr Friedmann, matemático y meteorólogo de Petrogrado, publicó en 1922 *Über die Krümmung des Raumes* (*Zeitschrift für Physik*, 10, 377–386), donde encontró las soluciones generales de las ecuaciones de Einstein para un universo homogéneo e isótropo. A diferencia de Einstein, no exigió que fuera estático. Las soluciones describen universos que se expanden, se contraen o oscilan, según su contenido y su curvatura. En 1924 extendió el análisis a universos de curvatura negativa (*Zeitschrift für Physik*, 21, 326–332). Einstein primero creyó que había un error en el trabajo de Friedmann; después admitió que las soluciones eran correctas. Friedmann murió en 1925, a los 37 años, sin ver la confirmación.

#### 12.2 Lemaître, 1927

Georges Lemaître, sacerdote y físico belga, llegó a las mismas ecuaciones en 1927 de manera independiente (*Annales de la Société Scientifique de Bruxelles*, 47, 49–59). Pero dio un paso más: las conectó con las observaciones. Usando las velocidades de alejamiento de galaxias medidas por Vesto Slipher y las distancias estimadas por Edwin Hubble, Lemaître dedujo que las galaxias se alejan a una velocidad proporcional a su distancia, y estimó el coeficiente. En 1931 propuso que el universo había empezado como un "átomo primitivo", la primera versión de lo que después se llamaría el big bang.

Hubble publicó en 1929 la relación velocidad-distancia con sus propios datos (*Proceedings of the National Academy of Sciences*, 15, 168–173). En 2018, la Unión Astronómica Internacional recomendó llamarla **ley de Hubble-Lemaître**.

#### 12.3 La ecuación del fluido

Las dos ecuaciones de Friedmann se complementan con la conservación de la energía en un universo que se expande:

$$ ρ̇ + 3 (ȧ/a)(ρ + p/c²) = 0 $$

Para una componente con p = wρc² y w constante, la solución es

$$ ρ ∝ a^(−3(1 + w)) $$

Esa es la ley de escala que implementa la herramienta para cada componente:

| Componente | w | ρ ∝ | Intuición |
|---|---|---|---|
| Materia | 0 | a⁻³ | La misma cantidad de partículas en un volumen que crece como a³ |
| Radiación | 1/3 | a⁻⁴ | Además, cada fotón pierde energía al estirarse su longitud de onda |
| Curvatura (como si fuera fluido) | −1/3 | a⁻² | El término k/a² |
| Constante cosmológica | −1 | a⁰ | La energía del vacío no se diluye |
| Energía fantasma | < −1 | crece con a | Más energía cuanto más se expande |

### 13. Por qué la presión gravita

#### 13.1 La segunda ecuación de Friedmann

La pieza central de la herramienta, y de la respuesta a la idea, es la ecuación de aceleración:

$$ ä/a = −(4πG/3) Σ (ρᵢ + 3pᵢ/c²) $$

En la gravedad de Newton, la fuente de la atracción es solo la densidad de masa. En la relatividad general, la fuente es el tensor de energía-momento completo, que incluye la presión. Para un fluido en reposo, la combinación que entra en la aceleración es ρ + 3p/c²: la densidad cuenta una vez y la presión tres veces (una por cada dirección del espacio).

En las condiciones de la vida diaria, la presión es despreciable frente a ρc²: la presión atmosférica es 10⁵ Pa, mientras que la densidad de energía del aire es del orden de 10¹⁷ J/m³. Por eso no notamos que la presión gravita. En cosmología, con radiación o con energía del vacío, la presión es comparable a la densidad y no se puede ignorar.

#### 13.2 El signo

Con p = wρc², la combinación es ρ(1 + 3w). Si w > −1/3, es positiva y la componente atrae: frena la expansión. Si w < −1/3, es negativa y la componente repele: la acelera. La función `efecto(w)` del código hace exactamente esa comparación.

Una presión negativa es una tensión: algo que "tira hacia adentro". La intuición de la idea era que una tensión debería frenar la expansión. Y localmente es cierto: un globo con tensión en su superficie tiende a contraerse. Pero en un universo homogéneo, la tensión está en todas partes por igual, así que no hay diferencias de presión que empujen nada hacia ningún lado. Lo único que queda es el efecto gravitatorio de la presión, y ese efecto, con signo negativo, es repulsivo.

Edward Kolb y Michael Turner explican esta sutileza en *The Early Universe* (1990), y Barbara Ryden la presenta de forma muy clara en *Introduction to Cosmology* (2.ª ed., 2017), con el argumento termodinámico: cuando un volumen con presión negativa se expande, su energía **aumenta** (se hace trabajo sobre él), lo que es coherente con que la densidad de energía del vacío se mantenga constante mientras el volumen crece.

#### 13.3 Las condiciones de energía

Los relativistas formalizan estas restricciones con las **condiciones de energía**. La **condición de energía fuerte** pide ρ + 3p/c² ≥ 0 (además de ρ + p/c² ≥ 0): que la materia siempre atraiga. Stephen Hawking y Roger Penrose la usaron en los años sesenta para sus teoremas de singularidad, que muestran que, si se cumple, el universo tuvo que empezar en una singularidad. Amal Kumar Raychaudhuri había derivado en 1955 (*Physical Review*, 98, 1123–1126) la ecuación que muestra por qué: si ρ + 3p/c² > 0, los haces de geodésicas se enfocan.

La energía oscura viola la condición fuerte. También la viola el campo que habría causado la **inflación** en el universo temprano, propuesta por Alexei Starobinsky (1980) y Alan Guth (*Physical Review D*, 23, 347–356, 1981): una etapa de expansión acelerada causada por un campo con w ≈ −1. Los nodos de la idea, con presión negativa, también la violarían. Por eso empujarían.

### 14. La aceleración cósmica

#### 14.1 Las supernovas, 1998

Durante buena parte del siglo XX se supuso que Λ = 0 y que la expansión se frenaba. La pregunta era cuánto. Dos equipos se propusieron medirlo usando supernovas de tipo Ia, explosiones de enanas blancas que tienen un brillo máximo casi uniforme y sirven como "candelas estándar". Comparando su brillo con su corrimiento al rojo, se puede reconstruir la historia de la expansión.

En 1998, el High-z Supernova Search Team, liderado por Brian Schmidt y con Adam Riess como primer autor (*Astronomical Journal*, 116, 1009–1038), y en 1999 el Supernova Cosmology Project, liderado por Saul Perlmutter (*Astrophysical Journal*, 517, 565–586), encontraron lo contrario de lo esperado: las supernovas lejanas eran más débiles de lo que deberían en un universo que frena. La expansión **se acelera**. Los tres recibieron el Premio Nobel de Física en 2011.

#### 14.2 El modelo ΛCDM

Combinando las supernovas con el fondo cósmico de microondas y la distribución de galaxias, surgió el modelo cosmológico estándar, **ΛCDM**: un universo plano con aproximadamente 5 % de materia ordinaria, 26 % de materia oscura fría y 69 % de energía oscura con w ≈ −1. Los resultados del satélite Planck publicados en 2020 (*Astronomy & Astrophysics*, 641, A6) dan Ωm ≈ 0,315 y una edad de 13,8 mil millones de años. El escenario "Universo de hoy" de la herramienta es una versión redondeada de ese modelo.

#### 14.3 DESI y la posibilidad de una w que cambia

En 2024 y 2025, la colaboración DESI (Dark Energy Spectroscopic Instrument) publicó mediciones de las oscilaciones acústicas de bariones con millones de galaxias. Combinadas con supernovas y el fondo cósmico, sugieren, con una significancia todavía discutida, que la energía oscura podría no ser exactamente una constante cosmológica sino una componente con w que cambia con el tiempo. Si se confirma, la energía oscura sería algo dinámico, y la puerta para modelos como los nodos (objetos cuya contribución cambia con la historia del universo) quedaría más abierta. La herramienta usa w constante; agregar una w variable está entre sus próximos pasos.

#### 14.4 Las eras del universo, en el modelo de la herramienta

Como cada componente se diluye a un ritmo distinto, el universo pasa por etapas dominadas por una u otra. En el escenario de hoy de la herramienta (30 % materia, 70 % Λ, sin radiación):

- **La aceleración empezó** cuando el aporte de la materia a la segunda ecuación, Ωm a⁻³, se volvió menor que el de Λ con su factor −2: 0,3 a⁻³ = 1,4, es decir, a ≈ 0,60 (corrimiento al rojo z ≈ 0,67). Integrando con el código, eso fue hace unos **6,1 mil millones de años**: antes, la expansión frenaba; después, se acelera. El Sistema Solar se formó hace 4,6 mil millones de años, ya en la era acelerada.
- **La densidad de Λ superó a la de la materia** cuando 0,3 a⁻³ = 0,7, en a ≈ 0,75 (z ≈ 0,33), hace unos **3,7 mil millones de años**. La aceleración empezó antes de que Λ dominara la densidad porque la presión de Λ cuenta tres veces.
- **Hacia el futuro**, Λ domina cada vez más y la expansión tiende a una exponencial: a ∝ e^(√ΩΛ · H₀ t). En 4/H₀ (unos 56 mil millones de años) el universo es unas 30 veces más grande que hoy.

Si se agrega radiación, aparece además una era temprana dominada por ella. En el universo real, la igualdad entre radiación y materia ocurrió a z ≈ 3400, unos 50 000 años después del big bang, y el fondo cósmico de microondas se liberó a z ≈ 1100, unos 380 000 años después. Arno Penzias y Robert Wilson detectaron ese fondo en 1965 (*Astrophysical Journal*, 142, 419–421), con una antena que no buscaba nada cosmológico; Robert Dicke, James Peebles y colaboradores lo habían predicho en un artículo del mismo número.

#### 14.5 La curvatura, medida

La herramienta permite elegir la curvatura k. En el universo real, se midió. Las fluctuaciones del fondo cósmico tienen un tamaño angular característico que depende de la geometría del espacio: en un universo cerrado, los triángulos grandes tienen ángulos que suman más de 180° y las fluctuaciones se ven más grandes; en uno abierto, más chicas. Los globos estratosféricos BOOMERanG (de Bernardis et al., *Nature*, 404, 955–959, 2000) y MAXIMA, y después los satélites WMAP y Planck, encontraron que el universo es plano con una precisión mejor que el 1 %. Por eso el escenario ΛCDM de la herramienta tiene k = 0 y Ωm + ΩΛ = 1.

La planitud no es un detalle: si los nodos de la idea tuvieran que mantener un equilibrio a la Einstein, harían falta k > 0 y un universo cerrado, en tensión con estas mediciones.

### 15. El problema de la constante cosmológica

Si la energía oscura es la energía del vacío, ¿cuánto debería valer? La mecánica cuántica dice que el vacío no está vacío: cada campo tiene fluctuaciones de punto cero, con energía. Yakov Zel'dovich señaló en 1968 (*Soviet Physics Uspekhi*, 11, 381–393) que esa energía actúa exactamente como una constante cosmológica, con w = −1. El problema es el valor. Una estimación ingenua, sumando fluctuaciones hasta la escala de Planck, da una densidad unos 120 órdenes de magnitud mayor que la observada. Steven Weinberg llamó a esto "el peor fracaso de una predicción teórica en la historia de la física" y lo analizó en *The cosmological constant problem* (*Reviews of Modern Physics*, 61, 1–23, 1989). Sean Carroll escribió una revisión accesible en 2001 (*Living Reviews in Relativity*, 4, 1).

Este problema es el que motiva buscar fuentes alternativas de la energía oscura, incluidas propuestas en las que objetos astrofísicos concretos, como los nodos de la idea, harían ese papel.

### 16. Objetos con interior de vacío: gravastars y agujeros negros acoplados

#### 16.1 De Sitter adentro

Una región llena de energía del vacío (w = −1) se describe, en relatividad general, con el espacio de **de Sitter**, que Willem de Sitter encontró en 1917 (*Monthly Notices of the Royal Astronomical Society*, 78, 3–28). Erast Gliner propuso en 1966 (*Soviet Physics JETP*, 22, 378–382) que la materia, a densidades extremas, podría comportarse como un vacío con w = −1. De ahí salió una línea de investigación sobre objetos compactos cuyo interior es de Sitter: agujeros negros "regulares", sin singularidad central, como el de James Bardeen (1968) o el de Irina Dymnikova (1992).

#### 16.2 Gravastars

Pawel Mazur y Emil Mottola propusieron en 2001 (publicado en *Proceedings of the National Academy of Sciences*, 101, 9545–9550, 2004) las **gravastars** (estrellas de condensado gravitatorio de vacío): objetos que, vistos desde afuera, son indistinguibles de un agujero negro, pero cuyo interior es una región de de Sitter, separada del exterior por una capa delgada de materia muy rígida. No hay horizonte de eventos ni singularidad.

Una gravastar es lo más parecido en la literatura a un "nodo" de la idea: una zona ultradensa con presión negativa en su interior. Pero, como objeto aislado, su presión negativa interna no tiene efecto cosmológico: desde afuera, gravita como cualquier masa. Para que muchos de ellos actúen como energía oscura, haría falta un mecanismo adicional.

#### 16.3 El acoplamiento cosmológico

Ese mecanismo es lo que propusieron Kevin Croker y Joel Weiner en 2019 (*Astrophysical Journal*, 882, 19) y lo que Duncan Farrah y colaboradores (*Astrophysical Journal Letters*, 944, L31, 2023) intentaron detectar en datos. La idea es que, si el interior de los agujeros negros es de vacío (w = −1), su masa podría crecer con la expansión del universo como

$$ M ∝ a^k $$

con k = 3 en el caso extremo. La densidad cosmológica de una población de esos objetos iría entonces como a^(k−3). Comparando con ρ ∝ a^(−3(1+w)):

$$ w = −k / 3 $$

Con k = 3, w = −1: los agujeros negros, en conjunto, se comportarían exactamente como una constante cosmológica. Farrah y colaboradores analizaron las masas de agujeros negros supermasivos en galaxias elípticas a distintos corrimientos al rojo y encontraron que crecen más de lo que explicaría la acreción, de manera compatible con k ≈ 3. Concluyeron que los agujeros negros podrían ser la fuente astrofísica de la energía oscura.

La herramienta incluye esta equivalencia: elegir w para los nodos es lo mismo que elegir k. Con w = −1 (escenario A) se reproduce la propuesta de Farrah en su versión extrema.

#### 16.4 Las críticas

La propuesta fue muy discutida. René Andrae y Kareem El-Badry (*Astronomy & Astrophysics*, 673, L10, 2023) usaron sistemas binarios con agujeros negros de masa estelar observados por el satélite Gaia y argumentaron que, si las masas crecieran como a³, esos sistemas no podrían tener las órbitas observadas. Otros autores cuestionaron la interpretación teórica del acoplamiento y la selección de las muestras. A la fecha, la hipótesis no forma parte del consenso. Pero es un ejemplo valioso para la idea: muestra que "objetos ultradensos con presión negativa que afectan la expansión" es una propuesta que científicos profesionales tomaron en serio, y que su efecto, si existe, es **empujar** (versión A), no frenar.

### 17. Las dos versiones de la idea

La herramienta obliga a elegir. Con lo visto, se pueden formular las dos versiones con precisión.

#### 17.1 Versión A: los nodos empujan

Los nodos son objetos compactos con interior de vacío (gravastars, agujeros negros regulares) cuya contribución a la densidad cosmológica se comporta como w ≈ −1. Son la causa de la expansión acelerada. Es la versión de Croker, Weiner y Farrah.

Ventajas: es consistente con la relatividad general y con la aceleración observada; ofrece una explicación astrofísica para la energía oscura y evita el problema de los 120 órdenes de magnitud. Desventajas: requiere un mecanismo de acoplamiento que no está establecido, y las pruebas con binarias de Gaia lo ponen en tensión.

Para una obra de ciencia ficción dura, la versión A tiene una consecuencia narrativa interesante: la expansión del universo dependería de la población de agujeros negros, así que fenómenos que los crean o los destruyen tendrían efectos cosmológicos.

#### 17.2 Versión B: los nodos frenan

Los nodos tienen presión positiva o nula y suman atracción. Contrarrestan la expansión. Pero entonces la idea pierde su ingrediente central (la presión negativa) y, además, choca con dos problemas. Primero, un universo dominado por algo con w > −1/3 no se acelera, contra lo observado. Segundo, la edad: con w = 1/3, la herramienta da 7,4 mil millones de años, menos que las estrellas más viejas (Howard Bond y colaboradores estimaron en 2013 para la estrella HD 140283 una edad de 14,5 ± 0,8 mil millones de años, compatible con la edad del universo solo en el extremo de su incerteza; los cúmulos globulares más antiguos tienen entre 12 y 13).

#### 17.3 Una versión C: el equilibrio

La idea original sugería algo más sutil: que los nodos mantuvieran el universo en equilibrio, ni expandiéndose ni contrayéndose, con **retroalimentación**. Eso se parece al universo de Einstein, con la diferencia de que el equilibrio debería ser **estable**. Para eso, los nodos tendrían que reaccionar a las perturbaciones: si el universo se expande un poco, deberían generar más atracción; si se contrae, más repulsión. Una w constante no hace eso. Haría falta una w que dependa del estado del universo, por ejemplo, de su ritmo de expansión o de su densidad. Ese es el próximo paso que el proyecto deja planteado: "una retroalimentación explícita". Existen modelos en la literatura con universos estáticos estables en teorías modificadas (por ejemplo, algunos escenarios de universo "emergente" propuestos por George Ellis y Roy Maartens en 2004, *Classical and Quantum Gravity*, 21, 223–232), pero no dentro de la relatividad general con fluidos simples.

#### 17.4 Cómo podría verse la retroalimentación

La versión C necesita nodos cuya ecuación de estado reaccione al estado del universo. Un modelo de juguete posible, que la herramienta todavía no implementa, sería hacer que w dependa del factor de escala alrededor de un tamaño de equilibrio a*:

$$ w(a) = −1/3 + β · (a − a*) $$

con β > 0. Si el universo está más grande que a*, w sube por encima de −1/3 y los nodos frenan; si está más chico, w baja y empujan. Es una retroalimentación negativa, como la de un termostato. Con materia y nodos de ese tipo, la segunda ecuación de Friedmann alrededor de a* se parece a la de un oscilador: el universo oscilaría alrededor del equilibrio en vez de escaparse, como en el caso de Eddington.

El problema es que una w que depende de a no es gratis. La ecuación del fluido, ρ̇ + 3H(1 + w)ρ = 0, sigue valiendo, pero la densidad ya no es una potencia simple de a y hay que integrarla junto con a(t). Más importante: hay que explicar qué **física** hace que la presión de unos objetos dependa del tamaño del universo. En la propuesta de Croker y Weiner, el acoplamiento sale de cómo se promedian los interiores de los objetos compactos en un espacio-tiempo en expansión; en un modelo de retroalimentación, haría falta algo parecido. Sin ese mecanismo, la w(a) de arriba es una descripción, no una explicación.

Aun así, agregarla a la herramienta tendría valor: mostraría qué forma de retroalimentación hace falta para estabilizar el universo, cuán fuerte tiene que ser (el valor mínimo de β) y qué edades y aceleraciones produce. Esas son preguntas concretas que convierten la idea en un problema resoluble. Es uno de los próximos pasos que el proyecto deja anotados, junto con agregar una w que cambie con el tiempo como sugieren los resultados de DESI.

Un antecedente en la literatura es la familia de modelos de "quintaesencia", introducida por Bharat Ratra y James Peebles en 1988 (*Physical Review D*, 37, 3406–3427) y por Robert Caldwell, Rahul Dave y Paul Steinhardt en 1998 (*Physical Review Letters*, 80, 1582–1585): la energía oscura como un campo escalar que evoluciona, con una w que cambia con el tiempo de manera determinada por su potencial. La quintaesencia no busca un equilibrio estático, pero muestra cómo se escribe una w dinámica de manera consistente con la relatividad general.

#### 17.5 Una lista de control para escribir la idea

La idea original contemplaba escribirla como ciencia ficción dura o como esbozo teórico. En cualquiera de los dos casos, estas son las preguntas que un lector con formación en física va a hacer, y que conviene responder en el texto:

1. **¿Qué w tienen los nodos?** Si es menor que −1/3, empujan. Decirlo explícitamente evita la contradicción de la idea original.
2. **¿Cómo se distribuyen?** Si son pocos y muy separados, el tratamiento como fluido falla y el universo deja de ser homogéneo a gran escala, en contra de lo observado.
3. **¿De dónde sale su energía?** Si su densidad no se diluye (w = −1) o crece (w < −1), alguien tiene que explicar por qué. En la propuesta de Croker y Weiner, la respuesta es el acoplamiento con la expansión.
4. **¿Qué pasa con su exterior?** Visto desde afuera, un nodo aislado gravita como una masa positiva. Su efecto cosmológico solo aparece si hay un mecanismo de acoplamiento.
5. **¿Es compatible con las edades?** La edad del universo tiene que superar la de las estrellas más viejas. La herramienta la calcula para cada w.
6. **¿Es estable?** Si la historia pide un equilibrio, hay que explicar la retroalimentación que lo estabiliza; si no, Eddington ya mostró que se rompe.
7. **¿Qué se observaría?** Una propuesta seria predice algo medible: un w distinto de −1, una relación entre la población de agujeros negros y la expansión, o una señal en las ondas gravitacionales.

### 18. Edad, aceleración y destino: cómo se calculan

#### 18.1 La integración numérica

La herramienta integra la segunda ecuación de Friedmann,

$$ ä = −(a/2) Σ ρᵢ (1 + 3wᵢ) a^(−3(1+wᵢ)) $$

con el método de Runge-Kutta de orden 4, que Carl Runge (1895) y Wilhelm Kutta (1901) desarrollaron para ecuaciones diferenciales ordinarias y que sigue siendo el caballo de batalla de la integración numérica. Las condiciones iniciales son a = 1 y ȧ dado por la primera ecuación de Friedmann (más el empujón). Se integra hacia atrás hasta a → 0 (big bang) para obtener la edad, y hacia adelante hasta 4/H₀ o hasta un recolapso.

#### 18.2 El parámetro de desaceleración

El parámetro de desaceleración, que se usaba desde los años sesenta cuando se esperaba que la expansión frenara (de ahí el signo), se define como

$$ q = −ä a / ȧ² $$

Hoy, con ȧ = 1 y a = 1, queda q₀ = (1/2) Σ Ωᵢ (1 + 3wᵢ). La función `desaceleracion` lo calcula. Para ΛCDM con Ωm = 0,3, q₀ = −0,55.

#### 18.3 La edad

Para un universo de solo materia y plano (el modelo de Einstein-de Sitter, 1932), la edad es exactamente 2/(3H₀) ≈ 9,3 mil millones de años, y q₀ = 1/2. Uno de los tests de la herramienta lo verifica. Ese valor fue un problema en los años noventa: era menor que las edades estimadas de las estrellas más viejas. La constante cosmológica lo resolvió: una expansión que se acelera hoy frenó menos en el pasado, y el universo es más viejo.

### 19. Cómo se mide lo que la herramienta supone

La herramienta da por conocidos tres números: la constante de Hubble (70 km/s/Mpc), la proporción de materia (30 %) y la de energía oscura (70 %). Cada uno es el resultado de décadas de mediciones, y uno de ellos está hoy en discusión.

#### 19.1 Candelas estándar que no lo eran del todo

Las supernovas de tipo Ia, que revelaron la aceleración (sección 14), no tienen todas el mismo brillo máximo: varían en un factor de dos o tres. Lo que las hizo útiles fue un descubrimiento de Mark Phillips en 1993 (*Astrophysical Journal Letters*, 413, L105–L108): las supernovas más brillantes se apagan más lentamente. Midiendo cuánto tarda en decaer el brillo, se puede corregir el brillo máximo y convertir cada supernova en una **candela estandarizable**, con una precisión de alrededor del 7 % en la distancia. Sin la relación de Phillips, los equipos de Riess, Schmidt y Perlmutter no habrían podido detectar la aceleración.

#### 19.2 Una regla en el cielo

La segunda medición clave es una regla, no una candela. En el universo temprano, el plasma de fotones y bariones vibraba con ondas de sonido. Cuando el universo se volvió transparente, unos 380 000 años después del big bang, esas ondas quedaron congeladas, dejando una distancia preferida entre concentraciones de materia: unos 150 megapársecs en el universo actual. Esa distancia, la escala de las **oscilaciones acústicas de bariones** (BAO), se detectó por primera vez en 2005 en la distribución de galaxias, casi simultáneamente por Daniel Eisenstein y colaboradores con el relevamiento SDSS (*Astrophysical Journal*, 633(2), 560–574) y por Shaun Cole y colaboradores con el relevamiento 2dFGRS (*Monthly Notices of the Royal Astronomical Society*, 362(2), 505–534). Midiendo el tamaño aparente de esa regla a distintas distancias se reconstruye la historia de la expansión, de manera independiente de las supernovas. Es lo que hace DESI (sección 14.3) con millones de galaxias.

#### 19.3 La tensión de Hubble

Hay dos maneras de medir la constante de Hubble. La **local** usa una escalera de distancias: cefeidas en galaxias cercanas calibran supernovas, y las supernovas miden la expansión. El equipo SH0ES, liderado por Adam Riess, obtuvo en 2022 un valor de 73,0 ± 1,0 km/s/Mpc (*Astrophysical Journal Letters*, 934, L7). La **temprana** usa el fondo cósmico de microondas y el modelo ΛCDM para inferir cuánto debería valer hoy: Planck obtuvo 67,4 ± 0,5. La diferencia, de unas cinco desviaciones estándar, es la **tensión de Hubble**, uno de los problemas abiertos más discutidos de la cosmología. Puede deberse a errores sistemáticos en alguna de las mediciones o a física que ΛCDM no incluye; entre las propuestas hay, justamente, formas de energía oscura distintas de una constante cosmológica.

La herramienta usa H₀ = 70, un valor intermedio. La elección importa para las edades: como la edad escala con 1/H₀, la edad del universo ΛCDM de la herramienta (0,964/H₀) sería de unos 14,0 mil millones de años con H₀ = 67,4, de 13,5 con 70 y de 12,9 con 73. La tensión de Hubble es, en parte, una tensión sobre la edad del universo, y por lo tanto sobre qué universos son compatibles con las estrellas más viejas (sección 17.2).

### 20. Los destinos posibles del universo

La herramienta informa un "destino" (sigue expandiéndose, recolapsa, se queda quieto) dentro de un horizonte de 4/H₀. Con w como parámetro libre, los destinos posibles son más variados, y la herramienta permite ver uno muy extremo.

#### 20.1 El gran congelamiento

En ΛCDM, la expansión se acelera para siempre y tiende a una exponencial. Las galaxias que no están ligadas gravitatoriamente a la nuestra se alejan cada vez más rápido y, en algunos cientos de miles de millones de años, salen de nuestro horizonte observable. Las estrellas se apagan, los restos se enfrían y el universo tiende a un estado frío, oscuro y casi vacío: el **gran congelamiento**, o muerte térmica. Fred Adams y Gregory Laughlin describieron esta cronología del futuro lejano en *Reviews of Modern Physics* (69(2), 337–372, 1997).

#### 20.2 El gran colapso

Si la materia (o algo con w > −1/3) dominara y el universo fuera cerrado, la expansión se frenaría, se detendría y se invertiría: el **gran colapso**. La herramienta lo muestra con mucha materia y curvatura positiva (sección 8.2, paso 4). Con las mediciones actuales (energía oscura dominante, universo plano), este destino está descartado salvo que la energía oscura cambie de signo en el futuro.

#### 20.3 El gran desgarro

Con energía fantasma (w < −1), la densidad de la energía oscura **crece** con la expansión, y el ritmo de expansión diverge en un tiempo finito. Robert Caldwell, Marc Kamionkowski y Nevin Weinberg calcularon en 2003 (sección 8.1) que el tiempo que falta hasta ese **gran desgarro** es aproximadamente

$$ t_desgarro − t_0 ≈ (2/3) · |1 + w|⁻¹ · H₀⁻¹ · (1 − Ωm)^(−1/2) $$

Con w = −1,5 y Ωm = 0,3, eso da unos 1,59/H₀, unos 22 mil millones de años. Antes del final, la expansión acelerada vencería sucesivamente a todo lo que está ligado: primero los cúmulos de galaxias, después la Vía Láctea, el Sistema Solar, la Tierra y, en los últimos instantes, los átomos.

La herramienta permite verlo: en el escenario A con w = −1,5, la curva del tamaño del universo se dispara y la integración se detiene, por el tope numérico, cerca de t = 1,55/H₀, muy cerca del tiempo que da la fórmula. Con w = −1,2, el desgarro llegaría a unos 4/H₀ (56 mil millones de años), y la integración se detiene en 3,86/H₀. Es un buen ejemplo de cómo un modelo de juguete reproduce un resultado publicado.

Los datos actuales son compatibles con w = −1 y con valores levemente distintos, en las dos direcciones. Si DESI y sus sucesores confirmaran una energía oscura que evoluciona, la pregunta por el destino del universo volvería a estar abierta. Para la idea de los nodos, eso significa que la versión A, en la que los nodos son la energía oscura, tiene consecuencias que van mucho más allá de la expansión actual: la naturaleza de los nodos decidiría el final de todo.

### 21. Del modelo al código

| Concepto | Función en `src/cosmos.js` | Qué produce |
|---|---|---|
| Lista de componentes con su w | `componentes(p)` (interna) | Materia, radiación, Λ, nodos |
| Segunda ecuación de Friedmann | `aceleracion(a, p)` | ä en cada paso |
| Densidad total en a | `densidadTotal(a, p)` | Para la primera ecuación |
| Primera ecuación de Friedmann | `velocidadInicial(p)` | ȧ₀, o `null` si Σρ < k |
| Parámetro de desaceleración | `desaceleracion(a, v, p)` | q₀ |
| Runge-Kutta 4 | `integrar(p, opciones)` | La curva a(t) |
| Resumen | `resumen(p)` | Acelera, edad, destino |
| Empuja o frena | `efecto(w)` | Signo de 1 + 3w |

Los tests (`test/cosmos.test.js`) verifican: que ΛCDM da q₀ = −0,55 y edad 0,964/H₀; que solo materia da edad 2/3 y q₀ = 1/2; que nodos con w = −1 se comportan igual que Λ; que presión negativa empuja y positiva frena con el límite en w = −1/3; que el universo de Einstein sin empujón se queda quieto y con empujón se escapa; que un universo cerrado con mucha materia recolapsa, y que las densidades imposibles se detectan.

```js
const C = require("./src/cosmos.js");
const r = C.resumen(C.ESCENARIOS.hoy);
r.q0;                         // −0,55
r.edad * C.H0_GYR;            // ≈ 13,5 mil millones de años
C.efecto(-0.2);               // "frena"
```

### 22. Ejercicios

1. Con solo materia y Λ, plano, ¿para qué Ωm la expansión hoy no se acelera ni frena (q₀ = 0)? Comprobalo con los deslizadores.
2. Calculá a mano la edad de un universo plano de solo radiación. (Pista: a ∝ t^(1/2).)
3. ¿A qué factor de escala la densidad de materia igualaba a la de Λ en ΛCDM? ¿Y cuándo empezó la aceleración? (Resolvé 0,3 a⁻³ = 2 · 0,7.)
4. Con nodos de w = −1,2 y Ω = 0,7, ¿qué cambia en la curva respecto de ΛCDM? ¿Por qué?
5. En el escenario de Einstein, medí con la curva cuánto tarda el universo en "escaparse" con empujones de 0,001 y 0,0001. ¿Cómo depende del tamaño del empujón?
6. Si los nodos tuvieran k = 1,5 en M ∝ a^k, ¿qué w tendrían? ¿Empujarían o frenarían?
7. Escribí en un párrafo la versión A de la idea como premisa de un cuento de ciencia ficción dura, respetando la física de la sección 13.

### 23. Glosario

- **Factor de escala a:** cuánto se estiraron las distancias cósmicas respecto de hoy.
- **Constante de Hubble H₀:** ritmo de expansión actual; 1/H₀ es la escala de tiempo cosmológica.
- **Parámetro de densidad Ω:** densidad de una componente dividida por la densidad crítica.
- **Ecuación de estado w:** cociente entre presión y densidad de energía.
- **Parámetro de desaceleración q:** −ä a/ȧ²; negativo si la expansión se acelera.
- **Constante cosmológica Λ:** término de las ecuaciones de Einstein equivalente a una energía del vacío con w = −1.
- **Energía oscura:** la componente responsable de la aceleración observada.
- **Energía fantasma:** una componente con w < −1, cuya densidad crece con la expansión.
- **Condición de energía fuerte:** ρ + 3p/c² ≥ 0; la energía oscura la viola.
- **Gravastar:** objeto compacto hipotético con interior de vacío y sin horizonte.
- **Acoplamiento cosmológico:** hipótesis de que la masa de los agujeros negros crece con la expansión.

### 24. Conclusión

La pregunta de la idea, si unos nodos ultradensos con presión negativa frenan o empujan la expansión, tiene una respuesta clara en la relatividad general: **empujan**. La presión gravita, y una presión más negativa que −1/3 de la densidad de energía convierte a la gravedad en repulsión. Es la razón de la aceleración cósmica que descubrieron Riess, Perlmutter y Schmidt, y es lo que haría cualquier componente con w < −1/3, sean nodos, campos o agujeros negros acoplados a la expansión.

La herramienta permite ver esto con números y explorar las alternativas: un universo que frena con nodos de presión positiva (más joven que sus estrellas), y el equilibrio de Einstein, que existe pero es inestable, como mostró Eddington. Para que la idea funcione en su versión más ambiciosa, un equilibrio estable, haría falta una retroalimentación que la relatividad general con fluidos simples no tiene. Elegir entre la versión A, que tiene antecedentes serios en Croker, Weiner y Farrah, y la B o la C, que necesitan física nueva, es el paso siguiente.

## Referencias

- Adams, F. C., & Laughlin, G. (1997). A dying universe: The long-term fate and evolution of astrophysical objects. *Reviews of Modern Physics*, 69(2), 337–372. https://doi.org/10.1103/RevModPhys.69.337
- Aghanim, N., et al. (Planck Collaboration). (2020). Planck 2018 results. VI. Cosmological parameters. *Astronomy & Astrophysics*, 641, A6. https://doi.org/10.1051/0004-6361/201833910
- Andrae, R., & El-Badry, K. (2023). Constraints on the cosmological coupling of black holes from Gaia. *Astronomy & Astrophysics*, 673, L10. https://doi.org/10.1051/0004-6361/202346350
- de Bernardis, P., et al. (2000). A flat Universe from high-resolution maps of the cosmic microwave background radiation. *Nature*, 404, 955–959. https://doi.org/10.1038/35010035
- Bond, H. E., Nelan, E. P., VandenBerg, D. A., Schaefer, G. H., & Harmer, D. (2013). HD 140283: A star in the solar neighborhood that formed shortly after the Big Bang. *Astrophysical Journal Letters*, 765(1), L12. https://doi.org/10.1088/2041-8205/765/1/L12
- Caldwell, R. R., Dave, R., & Steinhardt, P. J. (1998). Cosmological imprint of an energy component with general equation of state. *Physical Review Letters*, 80(8), 1582–1585. https://doi.org/10.1103/PhysRevLett.80.1582
- Caldwell, R. R., Kamionkowski, M., & Weinberg, N. N. (2003). Phantom energy: Dark energy with w < −1 causes a cosmic doomsday. *Physical Review Letters*, 91(7), 071301. https://doi.org/10.1103/PhysRevLett.91.071301
- Carroll, S. M. (2001). The cosmological constant. *Living Reviews in Relativity*, 4, 1. https://doi.org/10.12942/lrr-2001-1
- Cole, S., et al. (2005). The 2dF Galaxy Redshift Survey: Power-spectrum analysis of the final data set and cosmological implications. *Monthly Notices of the Royal Astronomical Society*, 362(2), 505–534. https://doi.org/10.1111/j.1365-2966.2005.09318.x
- Croker, K. S., & Weiner, J. L. (2019). Implications of symmetry and pressure in Friedmann cosmology. I. Formalism. *Astrophysical Journal*, 882(1), 19. https://doi.org/10.3847/1538-4357/ab32da
- Eddington, A. S. (1930). On the instability of Einstein's spherical world. *Monthly Notices of the Royal Astronomical Society*, 90, 668–678. https://doi.org/10.1093/mnras/90.7.668
- Einstein, A. (1917). Kosmologische Betrachtungen zur allgemeinen Relativitätstheorie. *Sitzungsberichte der Königlich Preußischen Akademie der Wissenschaften*, 142–152.
- Eisenstein, D. J., et al. (2005). Detection of the baryon acoustic peak in the large-scale correlation function of SDSS luminous red galaxies. *Astrophysical Journal*, 633(2), 560–574. https://doi.org/10.1086/466512
- Ellis, G. F. R., & Maartens, R. (2004). The emergent universe: Inflationary cosmology with no singularity. *Classical and Quantum Gravity*, 21(1), 223–232. https://doi.org/10.1088/0264-9381/21/1/015
- Farrah, D., et al. (2023). Observational evidence for cosmological coupling of black holes and its implications for an astrophysical source of dark energy. *Astrophysical Journal Letters*, 944(2), L31. https://doi.org/10.3847/2041-8213/acb704
- Friedmann, A. (1922). Über die Krümmung des Raumes. *Zeitschrift für Physik*, 10, 377–386. https://doi.org/10.1007/BF01332580
- Friedmann, A. (1924). Über die Möglichkeit einer Welt mit konstanter negativer Krümmung des Raumes. *Zeitschrift für Physik*, 21, 326–332. https://doi.org/10.1007/BF01328280
- Gliner, É. B. (1966). Algebraic properties of the energy-momentum tensor and vacuum-like states of matter. *Soviet Physics JETP*, 22(2), 378–382.
- Guth, A. H. (1981). Inflationary universe: A possible solution to the horizon and flatness problems. *Physical Review D*, 23(2), 347–356. https://doi.org/10.1103/PhysRevD.23.347
- Hawking, S. W., & Ellis, G. F. R. (1973). *The Large Scale Structure of Space-Time*. Cambridge University Press. ISBN 978-0-521-09906-6.
- Hubble, E. (1929). A relation between distance and radial velocity among extra-galactic nebulae. *Proceedings of the National Academy of Sciences*, 15(3), 168–173. https://doi.org/10.1073/pnas.15.3.168
- Kolb, E. W., & Turner, M. S. (1990). *The Early Universe*. Addison-Wesley. ISBN 978-0-201-11604-5.
- Kutta, W. (1901). Beitrag zur näherungsweisen Integration totaler Differentialgleichungen. *Zeitschrift für Mathematik und Physik*, 46, 435–453.
- Lemaître, G. (1927). Un univers homogène de masse constante et de rayon croissant rendant compte de la vitesse radiale des nébuleuses extra-galactiques. *Annales de la Société Scientifique de Bruxelles*, A47, 49–59.
- Mazur, P. O., & Mottola, E. (2004). Gravitational vacuum condensate stars. *Proceedings of the National Academy of Sciences*, 101(26), 9545–9550. https://doi.org/10.1073/pnas.0402717101
- Penzias, A. A., & Wilson, R. W. (1965). A measurement of excess antenna temperature at 4080 Mc/s. *Astrophysical Journal*, 142, 419–421. https://doi.org/10.1086/148307
- Perlmutter, S., et al. (1999). Measurements of Ω and Λ from 42 high-redshift supernovae. *Astrophysical Journal*, 517(2), 565–586. https://doi.org/10.1086/307221
- Phillips, M. M. (1993). The absolute magnitudes of Type Ia supernovae. *Astrophysical Journal Letters*, 413, L105–L108. https://doi.org/10.1086/186970
- Ratra, B., & Peebles, P. J. E. (1988). Cosmological consequences of a rolling homogeneous scalar field. *Physical Review D*, 37(12), 3406–3427. https://doi.org/10.1103/PhysRevD.37.3406
- Raychaudhuri, A. (1955). Relativistic cosmology. I. *Physical Review*, 98(4), 1123–1126. https://doi.org/10.1103/PhysRev.98.1123
- Riess, A. G., et al. (1998). Observational evidence from supernovae for an accelerating universe and a cosmological constant. *Astronomical Journal*, 116(3), 1009–1038. https://doi.org/10.1086/300499
- Riess, A. G., et al. (2022). A comprehensive measurement of the local value of the Hubble constant with 1 km s⁻¹ Mpc⁻¹ uncertainty from the Hubble Space Telescope and the SH0ES team. *Astrophysical Journal Letters*, 934(1), L7. https://doi.org/10.3847/2041-8213/ac5c5b
- Runge, C. (1895). Über die numerische Auflösung von Differentialgleichungen. *Mathematische Annalen*, 46, 167–178. https://doi.org/10.1007/BF01446807
- Ryden, B. (2017). *Introduction to Cosmology* (2.ª ed.). Cambridge University Press. ISBN 978-1-107-15483-4.
- de Sitter, W. (1917). On Einstein's theory of gravitation and its astronomical consequences. Third paper. *Monthly Notices of the Royal Astronomical Society*, 78, 3–28. https://doi.org/10.1093/mnras/78.1.3
- Starobinsky, A. A. (1980). A new type of isotropic cosmological models without singularity. *Physics Letters B*, 91(1), 99–102. https://doi.org/10.1016/0370-2693(80)90670-X
- Weinberg, S. (1989). The cosmological constant problem. *Reviews of Modern Physics*, 61(1), 1–23. https://doi.org/10.1103/RevModPhys.61.1
- Zel'dovich, Y. B. (1968). The cosmological constant and the theory of elementary particles. *Soviet Physics Uspekhi*, 11(3), 381–393. https://doi.org/10.1070/PU1968v011n03ABEH003927
