const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const outPath = path.join(__dirname, "Estudio_LLM_Transformer_50_paginas.pdf");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 50, bottom: 28, left: 54, right: 54 },
  info: {
    Title: "Estudio LLM: Attention Is All You Need explicado",
    Author: "Codex",
    Subject: "Guia pedagogica en espanol del paper Attention Is All You Need",
  },
});

doc.pipe(fs.createWriteStream(outPath));

const pageW = doc.page.width;
const pageH = doc.page.height;
const margin = 54;
const contentW = pageW - margin * 2;
const ink = "#182026";
const muted = "#5e6973";
const accent = "#0e6f76";
const orange = "#c96b2c";
const green = "#2f855a";
const purple = "#6b46c1";
const line = "#d7dee4";
const soft = "#eef6f7";
const soft2 = "#f5f2ea";
const mono = "Courier";

function safe(text) {
  return String(text)
    .replace(/[áàäâ]/g, "a")
    .replace(/[ÁÀÄÂ]/g, "A")
    .replace(/[éèëê]/g, "e")
    .replace(/[ÉÈËÊ]/g, "E")
    .replace(/[íìïî]/g, "i")
    .replace(/[ÍÌÏÎ]/g, "I")
    .replace(/[óòöô]/g, "o")
    .replace(/[ÓÒÖÔ]/g, "O")
    .replace(/[úùüû]/g, "u")
    .replace(/[ÚÙÜÛ]/g, "U")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/¿/g, "")
    .replace(/¡/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/≈/g, "~")
    .replace(/×/g, "x")
    .replace(/·/g, "*")
    .replace(/√/g, "sqrt");
}

function footer(n) {
  doc.font("Helvetica").fontSize(8).fillColor("#7a858f");
  doc.text("Estudio LLM - Transformer explicado para primero de Informatica", margin, pageH - 44, {
    width: contentW / 2,
    height: 12,
  });
  doc.text(String(n).padStart(2, "0"), margin, pageH - 44, { width: contentW, align: "right", height: 12 });
}

function h1(text, subtitle) {
  doc.fillColor(ink).font("Helvetica-Bold").fontSize(23).text(safe(text), margin, 52, {
    width: contentW,
    lineGap: 2,
  });
  if (subtitle) {
    doc.moveDown(0.25);
    doc.font("Helvetica").fontSize(10.5).fillColor(muted).text(safe(subtitle), {
      width: contentW,
      lineGap: 2,
    });
  }
  doc.moveTo(margin, 116).lineTo(pageW - margin, 116).strokeColor(line).lineWidth(1).stroke();
}

function para(text, opts = {}) {
  doc.font(opts.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(opts.size || 10.3)
    .fillColor(opts.color || ink)
    .text(safe(text), opts.x || margin, opts.y, {
      width: opts.width || contentW,
      height: opts.height,
      align: opts.align || "left",
      lineGap: opts.lineGap == null ? 3.2 : opts.lineGap,
    });
}

function bullet(items, x = margin, y = doc.y, w = contentW) {
  doc.y = y;
  items.forEach((item) => {
    const yy = doc.y + 2;
    doc.circle(x + 4, yy + 4, 2).fillColor(accent).fill();
    para(item, { x: x + 16, y: yy, width: w - 16, size: 9.8, lineGap: 2.5 });
    doc.moveDown(0.35);
  });
}

function box(x, y, w, h, title, body, color = accent, fill = "#ffffff") {
  doc.roundedRect(x, y, w, h, 7).fillAndStroke(fill, "#c8d3da");
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(color).text(safe(title), x + 12, y + 10, {
    width: w - 24,
  });
  doc.font("Helvetica").fontSize(8.8).fillColor(ink).text(safe(body), x + 12, y + 29, {
    width: w - 24,
    lineGap: 2,
  });
}

function arrow(x1, y1, x2, y2, color = "#46515a") {
  doc.moveTo(x1, y1).lineTo(x2, y2).strokeColor(color).lineWidth(1.2).stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  doc.polygon(
    [x2, y2],
    [x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6)],
    [x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6)]
  ).fillColor(color).fill();
}

function codeBlock(lines, x, y, w, h) {
  doc.roundedRect(x, y, w, h, 6).fillAndStroke("#17212a", "#17212a");
  doc.font(mono).fontSize(8.5).fillColor("#e7f0f4");
  lines.forEach((l, i) => doc.text(safe(l), x + 12, y + 12 + i * 15, { width: w - 24 }));
}

function table(x, y, cols, rows, widths) {
  let cy = y;
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#ffffff");
  doc.rect(x, cy, widths.reduce((a, b) => a + b, 0), 24).fill(accent);
  let cx = x;
  cols.forEach((c, i) => {
    doc.text(safe(c), cx + 6, cy + 7, { width: widths[i] - 12 });
    cx += widths[i];
  });
  cy += 24;
  doc.font("Helvetica").fontSize(8).fillColor(ink);
  rows.forEach((r, ri) => {
    cx = x;
    doc.rect(x, cy, widths.reduce((a, b) => a + b, 0), 26).fill(ri % 2 ? "#ffffff" : "#f2f7f7");
    r.forEach((c, i) => {
      doc.fillColor(ink).text(safe(c), cx + 6, cy + 8, { width: widths[i] - 12 });
      cx += widths[i];
    });
    cy += 26;
  });
  doc.rect(x, y, widths.reduce((a, b) => a + b, 0), 24 + rows.length * 26).strokeColor("#c8d3da").stroke();
}

function transformerDiagram(x, y, w, h) {
  const colW = (w - 34) / 2;
  box(x, y, colW, h, "Encoder x N", "Lee la frase completa. Cada capa mezcla contexto con self-attention y despues transforma cada posicion con una red feed-forward.", accent, "#f1fbfb");
  box(x + colW + 34, y, colW, h, "Decoder x N", "Genera la salida paso a paso. Usa mascara causal, consulta al encoder y produce probabilidades para el siguiente token.", orange, "#fff6ef");
  const sx = x + 22;
  const sy = y + 68;
  ["Embedding", "Posicion", "Self-attention", "Feed-forward"].forEach((t, i) => {
    box(sx, sy + i * 56, colW - 44, 38, t, i < 2 ? "Convierte tokens en vectores con orden." : "Subcapa + residual + normalizacion.", i < 2 ? green : accent);
    if (i < 3) arrow(sx + (colW - 44) / 2, sy + i * 56 + 38, sx + (colW - 44) / 2, sy + (i + 1) * 56);
  });
  const dx = x + colW + 56;
  ["Salida previa", "Masked self-attn", "Cross-attn", "Feed-forward", "Softmax"].forEach((t, i) => {
    box(dx, sy + i * 45, colW - 44, 31, t, i === 2 ? "Mira la memoria del encoder." : "Paso de decodificacion.", i === 2 ? purple : orange);
    if (i < 4) arrow(dx + (colW - 44) / 2, sy + i * 45 + 31, dx + (colW - 44) / 2, sy + (i + 1) * 45);
  });
  arrow(sx + colW - 44, sy + 128, dx, sy + 111, purple);
}

function attentionDiagram(x, y, w) {
  const r = 34;
  [["Q", accent], ["K", orange], ["V", green]].forEach(([label, color], i) => {
    doc.circle(x + i * 92 + r, y + r, r).fillAndStroke("#ffffff", color);
    doc.font("Helvetica-Bold").fontSize(18).fillColor(color).text(label, x + i * 92 + r - 8, y + r - 10);
  });
  arrow(x + 80, y + r, x + 122, y + r, "#78838b");
  arrow(x + 172, y + r, x + 214, y + r, "#78838b");
  box(x + 302, y + 3, w - 302, 62, "Puntuacion", "score = (Q * K) / sqrt(dk). Softmax convierte puntuaciones en pesos que suman 1.", purple, "#f7f3ff");
  arrow(x + 270, y + r, x + 302, y + r, "#78838b");
  box(x + 118, y + 92, w - 236, 58, "Mezcla ponderada", "La salida es una suma de valores V. Si una palabra importa mas para la pregunta Q, su valor pesa mas.", green, "#f0fbf5");
  arrow(x + 400, y + 65, x + 370, y + 92, green);
}

function positionalPlot(x, y, w, h) {
  doc.rect(x, y, w, h).fillAndStroke("#ffffff", "#ccd6dd");
  doc.moveTo(x + 30, y + h - 25).lineTo(x + w - 15, y + h - 25).strokeColor("#82909a").stroke();
  doc.moveTo(x + 30, y + 15).lineTo(x + 30, y + h - 25).stroke();
  function curve(color, freq, phase) {
    doc.moveTo(x + 30, y + h / 2);
    for (let i = 0; i < w - 48; i++) {
      const xx = x + 30 + i;
      const yy = y + h / 2 + Math.sin(i / freq + phase) * (h / 2 - 34);
      if (i === 0) doc.moveTo(xx, yy); else doc.lineTo(xx, yy);
    }
    doc.strokeColor(color).lineWidth(1.5).stroke();
  }
  curve(accent, 12, 0);
  curve(orange, 24, 0.8);
  curve(purple, 46, 1.6);
  doc.font("Helvetica").fontSize(8).fillColor(muted).text("posicion del token", x + w / 2 - 35, y + h - 17);
  doc.text("valor", x + 6, y + 18);
}

function attentionHeatmap(x, y, tokens, links) {
  const cell = 19;
  doc.font("Helvetica").fontSize(7).fillColor(muted);
  tokens.forEach((t, i) => {
    doc.save().rotate(-45, { origin: [x + 52 + i * cell, y + 40] });
    doc.text(safe(t), x + 52 + i * cell, y + 40, { width: 50 });
    doc.restore();
    doc.text(safe(t), x + 2, y + 58 + i * cell, { width: 48 });
  });
  for (let r = 0; r < tokens.length; r++) {
    for (let c = 0; c < tokens.length; c++) {
      let v = 0.08;
      links.forEach(([a, b, weight]) => {
        if (r === a && c === b) v = weight;
      });
      const color = `rgba(14,111,118,${v})`;
      doc.rect(x + 52 + c * cell, y + 56 + r * cell, cell - 1, cell - 1).fill(color);
    }
  }
  doc.rect(x + 52, y + 56, tokens.length * cell, tokens.length * cell).strokeColor("#9db1b8").stroke();
}

const pages = [
  {
    t: "De que va este documento",
    s: "Una guia divulgativa de 50 paginas basada en Vaswani et al. (2017), Attention Is All You Need.",
    p: [
      "Este material expande el paper fundacional del Transformer para un alumno de primero de Informatica o una persona junior que ya programa, pero todavia no tiene por que dominar algebra lineal, aprendizaje profundo o procesamiento del lenguaje natural.",
      "La idea central del paper es sorprendentemente simple: para transformar una secuencia en otra, por ejemplo una frase en ingles en una frase en aleman, no hace falta procesar la frase estrictamente de izquierda a derecha. Podemos dejar que cada token mire a los demas tokens y decida cuales son relevantes. Esa operacion se llama atencion.",
      "A partir de esa intuicion se construye una arquitectura completa: embeddings, codificacion posicional, self-attention, multi-head attention, bloques feed-forward, conexiones residuales, normalizacion, enmascarado y entrenamiento con grandes corpus.",
    ],
    b: ["Objetivo: entender el modelo con intuiciones, no memorizar formulas.", "Las figuras del paper se explican y se recrean de forma pedagogica.", "El foco esta en saber leer el paper original despues de estudiar esta guia."],
  },
  {
    t: "Antes del Transformer",
    s: "El contexto historico: RNN, LSTM, GRU y CNN para secuencias.",
    p: [
      "Antes de 2017, el camino habitual para trabajar con texto era usar modelos recurrentes. Una RNN lee una secuencia paso a paso: primero token 1, luego token 2, luego token 3. En cada paso mantiene un estado interno que resume lo leido.",
      "Las LSTM y GRU mejoraron a las RNN porque podian conservar informacion durante mas pasos, pero seguian teniendo un limite practico: la computacion era secuencial. Si quieres leer la palabra 100, normalmente has pasado por las 99 anteriores.",
      "Las CNN aplicadas a texto permitian paralelizar mejor, pero conectaban palabras lejanas a traves de varias capas. El Transformer propone otra cosa: que cualquier posicion pueda consultar directamente a cualquier otra posicion dentro de una misma capa.",
    ],
    b: ["Problema de las RNN: poca paralelizacion.", "Problema de dependencias largas: informacion importante se diluye.", "Apuesta del Transformer: atencion directa entre posiciones."],
  },
  {
    t: "La intuicion de la atencion",
    s: "Atender es seleccionar informacion relevante segun una pregunta.",
    p: [
      "Imagina que lees: 'El gato no entro en la caja porque era demasiado grande'. Para interpretar 'era demasiado grande', necesitas decidir a que se refiere. La palabra actual no vive sola: depende de otras partes de la frase.",
      "La atencion formaliza esta pregunta: para una posicion concreta, que otras posiciones deberian influir en su representacion? En vez de usar una regla fija, el modelo aprende pesos. Una palabra puede mirar mucho a otra, poco a otra y nada a varias.",
      "Eso convierte cada token en una representacion contextual: la palabra 'banco' no tendra el mismo vector en 'banco del parque' que en 'banco central'.",
    ],
    diagram: "attention",
  },
  {
    t: "Secuencia a secuencia",
    s: "El paper estudia traduccion automatica, pero la idea generaliza.",
    p: [
      "El problema original se llama transduccion de secuencias: recibes una secuencia de entrada y produces una secuencia de salida. Traduccion, resumen, respuesta a preguntas y generacion de codigo pueden verse asi.",
      "En el paper, el encoder lee toda la frase fuente. El decoder genera la frase destino token a token. La diferencia clave es que ambos usan atencion como mecanismo principal.",
      "Los LLM modernos no siempre usan encoder y decoder completos. Muchos son solo decoders causales. Aun asi, el corazon tecnico que heredan del paper es la self-attention multi-cabeza apilada muchas veces.",
    ],
    b: ["Encoder: construye memoria de la entrada.", "Decoder: genera salida consultando contexto disponible.", "LLM actual: normalmente decoder-only, pero con el mismo ADN de atencion."],
  },
  {
    t: "Tokens y embeddings",
    s: "Los modelos no leen palabras; leen numeros.",
    p: [
      "Un ordenador no entiende texto directamente. Primero se divide el texto en tokens. Un token puede ser una palabra, parte de una palabra, un signo o un fragmento frecuente. Despues cada token se convierte en un vector numerico llamado embedding.",
      "Un embedding no es una definicion de diccionario. Es una posicion en un espacio de muchas dimensiones. Tokens que aparecen en contextos parecidos tienden a tener vectores relacionados.",
      "El Transformer trabaja con vectores de dimension d_model. En el modelo base del paper, d_model = 512. Eso significa que cada posicion de la frase se representa con 512 numeros antes de entrar en las capas principales.",
    ],
    b: ["Tokenizacion: texto -> piezas.", "Embedding: pieza -> vector.", "Contextualizacion: vector inicial -> vector que depende de la frase."],
  },
  {
    t: "Por que hace falta posicion",
    s: "La atencion sola no sabe si una palabra aparece antes o despues.",
    p: [
      "Si solo mezclamos tokens mediante atencion, el modelo ve un conjunto de vectores, pero no necesariamente el orden. Sin orden, 'perro muerde hombre' y 'hombre muerde perro' se parecen demasiado.",
      "Como el Transformer original no usa recurrencia ni convolucion, necesita inyectar informacion de posicion. El paper usa codificaciones sinusoidales: ondas seno y coseno de distintas frecuencias que se suman al embedding.",
      "La intuicion es elegante: cada posicion recibe una firma numerica. Las distancias relativas entre posiciones tambien quedan representadas de forma suave, lo que ayuda a generalizar a longitudes no vistas exactamente igual durante entrenamiento.",
    ],
    diagram: "position",
  },
  {
    t: "Vista general de la arquitectura",
    s: "El Transformer original tiene encoder y decoder apilados.",
    p: [
      "La Figura 1 del paper muestra dos torres. A la izquierda, el encoder. A la derecha, el decoder. Cada torre repite varias capas identicas. En el modelo base, N = 6.",
      "Cada capa no es una unica operacion. Es una pequena cadena de subcapas: atencion, suma residual, normalizacion y red feed-forward. El decoder incluye ademas una atencion encoder-decoder que consulta la salida del encoder.",
      "Pensar en bloques repetidos ayuda: el primer bloque detecta relaciones sencillas; los siguientes refinan representaciones cada vez mas abstractas.",
    ],
    diagram: "transformer",
  },
  {
    t: "Encoder: leer con contexto",
    s: "Cada token del input se actualiza mirando al resto del input.",
    p: [
      "En una capa de encoder, todos los tokens pueden atender a todos los tokens de la entrada. Esto se llama self-attention porque la secuencia se mira a si misma.",
      "La salida de la atencion pasa por una red feed-forward aplicada posicion por posicion. Es decir, el modelo primero mezcla informacion entre tokens y despues transforma cada token de forma local.",
      "La representacion final del encoder funciona como una memoria rica de la frase original. El decoder la usara para decidir que generar.",
    ],
    b: ["Entrada: embeddings + posicion.", "Self-attention: mezcla informacion global.", "Feed-forward: procesa cada posicion con la misma red."],
  },
  {
    t: "Decoder: generar sin hacer trampas",
    s: "Al entrenar, el decoder no puede mirar tokens futuros.",
    p: [
      "El decoder genera una salida de izquierda a derecha. Cuando predice el token 5, no deberia usar el token 6 de la respuesta real. Si lo hiciera, aprenderia copiando el futuro.",
      "Para evitarlo se usa masked self-attention. La mascara bloquea posiciones futuras, de modo que cada posicion solo atiende a tokens ya generados o anteriores.",
      "Despues, una subcapa de cross-attention permite consultar la memoria del encoder. Asi el decoder combina lo que ya ha escrito con lo que sabe de la entrada.",
    ],
    b: ["Mascara causal: impide mirar al futuro.", "Cross-attention: conecta salida parcial con entrada.", "Softmax final: convierte vector en distribucion sobre vocabulario."],
  },
  {
    t: "Queries, Keys y Values",
    s: "Tres nombres raros para una idea de busqueda.",
    p: [
      "En atencion, cada token produce tres vectores: Query, Key y Value. Una Query representa lo que una posicion esta buscando. Una Key representa lo que cada posicion ofrece como etiqueta de busqueda. Un Value es la informacion que se copiara o mezclara si esa posicion resulta relevante.",
      "La Query se compara con todas las Keys. Si encajan, el peso de atencion sera alto. Luego esos pesos se usan para combinar los Values.",
      "Una analogia: en una biblioteca, tu pregunta es la Query; las fichas de los libros son Keys; el contenido de los libros son Values.",
    ],
    diagram: "attention",
  },
  {
    t: "Producto escalar escalado",
    s: "La formula compacta del mecanismo de atencion.",
    p: [
      "El paper define la atencion como Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V. Parece intimidante, pero cada parte tiene una funcion sencilla.",
      "QK^T calcula similitudes entre preguntas y claves. Dividir por sqrt(d_k) evita que los numeros crezcan demasiado cuando la dimension es grande. Softmax convierte esas similitudes en pesos positivos que suman 1. Multiplicar por V combina la informacion.",
      "El resultado no es una posicion elegida de forma dura, sino una mezcla diferenciable. Eso permite entrenar todo el sistema con backpropagation.",
    ],
    formula: true,
  },
  {
    t: "Que hace softmax",
    s: "Transforma puntuaciones en probabilidades utilizables.",
    p: [
      "Softmax recibe una lista de numeros cualquiera y devuelve una lista de valores entre 0 y 1 que suman 1. Si una puntuacion es mucho mayor que las otras, recibira casi todo el peso.",
      "En atencion, eso significa que el modelo puede concentrarse en una palabra concreta o repartir atencion entre varias. No hay una regla fija: se aprende con los datos.",
      "Este detalle es importante para explicar por que las visualizaciones de atencion parecen mapas de calor. Cada fila suele representar que mira un token; las columnas muestran cuanto mira a cada posible fuente.",
    ],
    heatmap: true,
  },
  {
    t: "Multi-head attention",
    s: "Varias atenciones en paralelo ven relaciones distintas.",
    p: [
      "Una sola atencion puede mezclar informacion, pero podria promediar relaciones incompatibles. Multi-head attention divide el trabajo en varias cabezas. Cada cabeza aprende proyecciones diferentes de Q, K y V.",
      "En el Transformer base hay 8 cabezas. Como d_model = 512, cada cabeza usa dimensiones de 64 para Q, K y V. Despues se concatenan las salidas y se proyectan de nuevo.",
      "La intuicion: una cabeza puede fijarse en concordancia gramatical, otra en dependencias largas, otra en signos de puntuacion, otra en palabras cercanas. No se programa asi; emerge si ayuda a reducir el error.",
    ],
    b: ["Paralelismo conceptual: varias formas de mirar.", "Paralelismo computacional: se calcula eficientemente en matrices.", "Salida final: concat(head1, ..., head_h) W^O."],
  },
  {
    t: "Por que varias cabezas no son solo lujo",
    s: "Separar subespacios evita que una media borre informacion.",
    p: [
      "Supongamos que una frase tiene dos relaciones importantes: sujeto-verbo y pronombre-antecedente. Si una unica cabeza intenta capturar ambas, puede terminar con pesos mezclados poco claros.",
      "Las cabezas permiten representar patrones diferentes simultaneamente. Luego una proyeccion lineal decide como recombinarlos.",
      "En la practica, no todas las cabezas son igual de interpretables ni igual de utiles. Algunas pueden ser redundantes. Pero el mecanismo hizo posible escalar arquitecturas muy expresivas sin volver a la recurrencia.",
    ],
    b: ["Cabeza = vista parcial aprendida.", "Subespacio = representacion reducida.", "Concatenacion = reunimos las vistas."],
  },
  {
    t: "Feed-forward por posicion",
    s: "Despues de mezclar tokens, toca transformar cada token.",
    p: [
      "Cada capa incluye una red feed-forward aplicada de forma independiente a cada posicion. En el paper es una MLP de dos capas: primero expande la dimension de 512 a 2048, aplica una no linealidad y despues vuelve a 512.",
      "Aunque se aplica igual en todas las posiciones, cada posicion ya contiene contexto gracias a la atencion. Por eso la red local puede refinar informacion contextual.",
      "Piensa en dos fases por capa: comunicacion entre tokens y procesamiento interno de cada token.",
    ],
    b: ["Atencion: quien habla con quien.", "Feed-forward: que calculo hago con lo recibido.", "Pesos compartidos: la misma red se aplica a todas las posiciones."],
  },
  {
    t: "Conexiones residuales",
    s: "Una autopista para que la informacion y el gradiente no se pierdan.",
    p: [
      "Una conexion residual suma la entrada de una subcapa a su salida: x + Sublayer(x). Esto permite que una capa aprenda una correccion en lugar de reconstruir todo desde cero.",
      "En redes profundas, las residuales ayudan a entrenar porque el gradiente tiene caminos mas directos. Si una subcapa no aporta, el modelo puede aproximarse a dejarla pasar.",
      "El Transformer usa residuales alrededor de la atencion y alrededor del feed-forward. Despues aplica normalizacion de capa.",
    ],
    b: ["Sin residual: cada bloque debe rehacer la representacion.", "Con residual: cada bloque puede modificarla incrementalmente.", "Esto facilita apilar muchas capas."],
  },
  {
    t: "Layer normalization",
    s: "Mantener las activaciones en una escala razonable.",
    p: [
      "La normalizacion de capa ajusta los valores de una representacion para que tengan una escala mas estable. No cambia el objetivo del modelo, pero hace el entrenamiento mas controlable.",
      "En el paper original, la formula aparece como LayerNorm(x + Sublayer(x)). Muchas implementaciones modernas usan variantes pre-norm, pero la idea sigue siendo estabilizar redes profundas.",
      "Para un junior, la idea practica es: cuando apilas muchas operaciones, las magnitudes pueden desordenarse; normalizar reduce ese problema.",
    ],
    b: ["Residual: conserva informacion.", "Normalizacion: estabiliza escala.", "Juntas hacen que el bloque sea entrenable."],
  },
  {
    t: "Dropout y regularizacion",
    s: "Evitar que el modelo memorice demasiado.",
    p: [
      "Dropout apaga aleatoriamente algunas activaciones durante entrenamiento. Eso obliga al modelo a no depender de una unica ruta fragil.",
      "El paper usa dropout en varias partes, incluyendo atencion y feed-forward. Tambien usa label smoothing, una tecnica que evita que el modelo se vuelva excesivamente seguro de la clase correcta.",
      "La regularizacion es especialmente importante cuando el modelo tiene muchos parametros y el conjunto de datos no es infinito.",
    ],
    b: ["Dropout: ruido controlado durante entrenamiento.", "Label smoothing: etiquetas menos absolutas.", "Objetivo: generalizar mejor."],
  },
  {
    t: "Complejidad computacional",
    s: "La atencion cambia el coste y la paralelizacion.",
    p: [
      "El paper compara self-attention, recurrencia y convoluciones. La self-attention conecta todas las posiciones en una sola capa y permite operaciones paralelas, pero su coste crece con n^2 respecto a la longitud de secuencia.",
      "Para frases de traduccion normales, n suele ser menor que la dimension de representacion, asi que el coste era asumible. Para contextos muy largos, el coste cuadratico se vuelve un problema real.",
      "Esta tension explica muchas investigaciones posteriores: atencion eficiente, ventanas locales, sparse attention, memoria externa y modelos capaces de manejar contextos enormes.",
    ],
    complexity: true,
  },
  {
    t: "Longitud de camino",
    s: "Cuantos pasos necesita la informacion para viajar.",
    p: [
      "Si una palabra al principio de la frase afecta a una palabra al final, como viaja esa informacion? En una RNN debe pasar por muchos estados intermedios. En self-attention puede conectarse directamente en una sola capa.",
      "El paper llama a esto maximum path length. Cuanto mas corto es el camino, mas facil puede ser aprender dependencias largas.",
      "Esta es una de las razones conceptuales por las que el Transformer fue tan potente: no solo paraleliza; tambien acerca posiciones lejanas.",
    ],
    b: ["RNN: camino O(n).", "Convolucion: camino depende del kernel y la profundidad.", "Self-attention: camino O(1) dentro de una capa completa."],
  },
  {
    t: "Entrenamiento en traduccion",
    s: "El paper demuestra el modelo en WMT 2014.",
    p: [
      "Los autores evaluaron en traduccion ingles-aleman e ingles-frances. El Transformer base ya alcanzo resultados muy competitivos, y el Transformer big mejoro el estado del arte con menor coste de entrenamiento que varios sistemas anteriores.",
      "BLEU es la metrica principal reportada. No mide comprension humana perfecta, pero sirve para comparar sistemas de traduccion automaticos bajo un protocolo comun.",
      "Lo importante historicamente no fue solo ganar en BLEU, sino mostrar que una arquitectura sin recurrencia ni convolucion podia entrenar rapido y rendir mejor.",
    ],
    b: ["Tarea: traduccion automatica.", "Metrica: BLEU.", "Mensaje del resultado: la atencion basta para secuencias complejas."],
  },
  {
    t: "Base y Big",
    s: "Dos tamanos para ver como escala la arquitectura.",
    p: [
      "El paper presenta un Transformer base y un Transformer big. El big aumenta dimensiones, parametros y capacidad, junto con ajustes de regularizacion.",
      "Esta comparacion anticipa una idea que despues dominaria los LLM: al aumentar capacidad, datos y computo, el rendimiento suele mejorar de forma predecible durante bastante rango.",
      "Eso no significa que escalar lo arregle todo. Pero el Transformer resulto ser una base excepcional para escalar.",
    ],
    b: ["Base: mas pequeno, eficiente, demostrativo.", "Big: mas capacidad y mejor BLEU.", "LLM modernos: muchisimas mas capas, parametros y datos."],
  },
  {
    t: "Ablation study",
    s: "Cambiar piezas para ver que importa.",
    p: [
      "La Tabla 3 del paper modifica hiperparametros: numero de cabezas, dimension, tamano del feed-forward, dropout y otras elecciones. Eso ayuda a separar intuicion de evidencia.",
      "Un ablation study responde: si quito o cambio esta parte, que pasa? En investigacion es clave porque un modelo puede funcionar por razones distintas a las que creemos.",
      "Para estudiar LLM, conviene aprender a leer estas tablas como experimentos controlados, no solo como una lista de numeros.",
    ],
    b: ["Variable independiente: lo que cambio.", "Metrica: lo que observo.", "Conclusion: que pieza parece relevante."],
  },
  {
    t: "Generalizacion a parsing",
    s: "El Transformer no solo traduce.",
    p: [
      "El paper tambien prueba parsing de constituyentes en ingles. Esta tarea analiza la estructura gramatical de una frase.",
      "El resultado muestra que la arquitectura puede capturar informacion sintactica util. No es una prueba de comprension humana, pero si una senal de que las representaciones aprendidas tienen estructura linguistica.",
      "Las visualizaciones de atencion del apendice refuerzan esta lectura: algunas cabezas parecen seguir relaciones gramaticales o dependencias largas.",
    ],
    b: ["Parsing: estructura de la frase.", "Atencion: puede alinearse con relaciones linguisticas.", "Cuidado: interpretabilidad visual no siempre prueba causalidad."],
  },
  {
    t: "Visualizar atencion",
    s: "Mapas que muestran donde mira cada token.",
    p: [
      "Las Figuras 3, 4 y 5 del paper muestran patrones de atencion. En algunos casos, una cabeza conecta palabras lejanas que pertenecen a una misma dependencia.",
      "Estas visualizaciones son utiles pedagogicamente, porque convierten matrices en imagenes. Pero no hay que sobreinterpretarlas: que una cabeza mire a una palabra no significa necesariamente que esa sea toda la razon de una prediccion.",
      "Aun con esa cautela, los mapas ayudan a entender la diferencia entre atencion local y relaciones a larga distancia.",
    ],
    heatmap: true,
  },
  {
    t: "Del Transformer a los LLM",
    s: "Que parte del paper vive dentro de ChatGPT, Claude, Gemini o Llama.",
    p: [
      "Los LLM modernos heredan el bloque Transformer, especialmente en formato decoder-only para prediccion del siguiente token. En vez de traducir una frase completa, aprenden a continuar texto.",
      "El principio de entrenamiento es simple: dado un contexto, predecir el siguiente token. Repetido a escala masiva, obliga al modelo a aprender patrones de lenguaje, hechos, estilos, codigo y razonamiento aproximado.",
      "El salto historico fue combinar arquitectura escalable, muchos datos, mucho computo y tecnicas de alineamiento posteriores.",
    ],
    b: ["Paper: encoder-decoder para traduccion.", "LLM: normalmente decoder causal para continuacion.", "Nucleo comun: self-attention multi-cabeza apilada."],
  },
  {
    t: "Prediccion del siguiente token",
    s: "La tarea sencilla que produce capacidades complejas.",
    p: [
      "En un modelo de lenguaje causal, el objetivo es predecir el proximo token. Si el texto dice 'La capital de Francia es', el modelo debe asignar alta probabilidad a 'Paris'.",
      "Durante entrenamiento, esto ocurre billones de veces con contextos muy diversos. El modelo aprende regularidades estadisticas profundas, no mediante reglas escritas a mano.",
      "La generacion se obtiene repitiendo el proceso: predecir, elegir un token, anadirlo al contexto, volver a predecir.",
    ],
    code: ["contexto = tokens(texto)", "while no_fin:", "  logits = modelo(contexto)", "  siguiente = muestrear(softmax(logits))", "  contexto.append(siguiente)"],
  },
  {
    t: "Ventana de contexto",
    s: "La memoria inmediata del modelo.",
    p: [
      "La self-attention opera sobre los tokens disponibles en la ventana de contexto. Si algo no esta en esa ventana o no esta en los parametros aprendidos, el modelo no puede usarlo directamente.",
      "En Transformers clasicos, el coste de atencion crece cuadraticamente con el numero de tokens. Por eso aumentar contexto ha requerido optimizaciones de arquitectura, memoria y hardware.",
      "Para un usuario, la ventana de contexto se siente como la cantidad de conversacion o documentos que el modelo puede considerar a la vez.",
    ],
    b: ["Mas contexto: mas informacion disponible.", "Coste: mas memoria y computo.", "RAG: tecnica para traer informacion relevante al contexto."],
  },
  {
    t: "Parametros y conocimiento",
    s: "Donde queda lo aprendido despues del entrenamiento.",
    p: [
      "Los parametros son numeros ajustados durante entrenamiento. No guardan frases como una base de datos simple; codifican patrones distribuidos en muchas matrices.",
      "Cuando decimos que un LLM 'sabe' algo, normalmente significa que sus parametros inducen alta probabilidad para respuestas coherentes sobre ese tema. Eso puede fallar, estar desactualizado o mezclar patrones.",
      "Por eso conviene distinguir memoria paramatrica, contexto proporcionado por el usuario y herramientas externas.",
    ],
    b: ["Parametros: conocimiento aprendido estadisticamente.", "Contexto: informacion dada en la conversacion.", "Herramientas: calculadoras, buscadores, bases de datos, codigo."],
  },
  {
    t: "Por que alucinan",
    s: "Un modelo de lenguaje optimiza plausibilidad, no verdad por si sola.",
    p: [
      "La arquitectura Transformer permite modelar dependencias complejas, pero el objetivo basico de lenguaje es predecir tokens probables. Un texto puede ser probable y aun asi falso.",
      "Los sistemas modernos reducen este problema con alineamiento, recuperacion de informacion, herramientas, verificacion y mejores datos. Pero la tendencia a completar con plausibilidad sigue siendo un riesgo.",
      "Entender el paper ayuda a quitar magia: el modelo calcula distribuciones sobre tokens usando representaciones aprendidas. No consulta automaticamente una fuente de verdad a menos que se le conecte una.",
    ],
    b: ["Plausible no equivale a verdadero.", "Contexto bueno reduce errores.", "Verificacion externa sigue siendo necesaria en tareas criticas."],
  },
  {
    t: "RAG en relacion con atencion",
    s: "Traer documentos al contexto para que el modelo atienda a ellos.",
    p: [
      "RAG significa Retrieval-Augmented Generation. Primero se busca informacion relevante en una base documental. Despues esa informacion se inserta en el prompt para que el LLM la use al generar.",
      "La conexion con el Transformer es directa: una vez los fragmentos estan en el contexto, la self-attention puede relacionar la pregunta con las frases recuperadas.",
      "RAG no cambia necesariamente los parametros del modelo. Cambia la informacion disponible en la ventana de contexto.",
    ],
    b: ["Retrieval: encontrar fragmentos.", "Augmentation: ponerlos en el prompt.", "Generation: responder atendiendo a pregunta y evidencia."],
  },
  {
    t: "Fine-tuning y alineamiento",
    s: "Entrenar despues del preentrenamiento para adaptar conducta.",
    p: [
      "Preentrenar un modelo grande desde cero es caro. Fine-tuning ajusta un modelo ya entrenado con datos mas especificos. Puede servir para formato, dominio, estilo o tareas concretas.",
      "Alineamiento es un termino amplio para hacer que el modelo responda de forma mas util, segura y acorde con preferencias humanas. Incluye instruction tuning, aprendizaje con preferencias y tecnicas relacionadas.",
      "Estas etapas no reemplazan el bloque Transformer: lo especializan.",
    ],
    b: ["Pretraining: aprende lenguaje general.", "Fine-tuning: adapta a ejemplos concretos.", "Alineamiento: ajusta comportamiento esperado."],
  },
  {
    t: "Matrices: la notacion minima",
    s: "Leer formulas del paper sin miedo.",
    p: [
      "Cuando el paper escribe Q, K y V en mayusculas, se refiere a matrices que contienen muchos vectores a la vez. Cada fila puede corresponder a una posicion de la secuencia.",
      "QK^T produce una matriz de compatibilidades: cada fila pregunta desde una posicion y cada columna representa una clave candidata.",
      "Multiplicar por V al final convierte esos pesos en nuevas representaciones. La notacion compacta permite calcular todo en paralelo, que es una de las grandes ventajas practicas del Transformer.",
    ],
    formula: true,
  },
  {
    t: "Ejemplo pequeno de atencion",
    s: "Una frase de cuatro tokens.",
    p: [
      "Supongamos la frase: 'yo como manzanas rojas'. Para representar 'rojas', el modelo puede atender mucho a 'manzanas', algo a 'como' y poco a 'yo'.",
      "La salida para 'rojas' sera una mezcla de valores. Esa mezcla informa de que el adjetivo describe al sustantivo correcto.",
      "En capas posteriores, la relacion puede volverse mas abstracta: numero, funcion gramatical, significado o rol dentro de la tarea.",
    ],
    heatmap: true,
  },
  {
    t: "Mascara causal visual",
    s: "Una matriz triangular para bloquear el futuro.",
    p: [
      "En un decoder causal, la posicion i solo puede mirar posiciones <= i. La matriz de atencion permitida queda triangular.",
      "Durante entrenamiento se conocen todos los tokens reales, pero la mascara mantiene el problema honesto. En inferencia, simplemente no existen tokens futuros todavia.",
      "Este detalle es clave para entender por que los LLM generan de izquierda a derecha y por que a veces no pueden revisar internamente una respuesta ya emitida salvo que generen texto adicional.",
    ],
    mask: true,
  },
  {
    t: "La salida: logits y vocabulario",
    s: "Del vector final a la palabra siguiente.",
    p: [
      "Al final del decoder, cada posicion tiene un vector. Una capa lineal lo transforma en logits, un numero por cada token del vocabulario.",
      "Softmax convierte logits en probabilidades. Decodificar consiste en elegir token: el mas probable, uno muestreado con temperatura, top-k, top-p u otra estrategia.",
      "Por eso dos ejecuciones pueden dar respuestas distintas aunque el modelo sea el mismo: la estrategia de muestreo cambia el camino de generacion.",
    ],
    b: ["Logits: puntuaciones sin normalizar.", "Softmax: probabilidades.", "Sampling: decision concreta de salida."],
  },
  {
    t: "Por que el Transformer fue tan influyente",
    s: "No fue una pieza aislada; fue una arquitectura escalable.",
    p: [
      "El Transformer combino varias propiedades muy valiosas: paralelizacion, dependencias largas, bloques apilables, entrenamiento estable y buen rendimiento empirico.",
      "Su diseno encajaba bien con GPUs y TPUs porque usa muchas multiplicaciones de matrices grandes. Eso hizo que aumentar tamano fuera practico comparado con arquitecturas secuenciales.",
      "Despues llegaron BERT, GPT, T5 y muchas variantes. Cada una cambio el objetivo o la forma de usar el bloque, pero el mecanismo base permanecio reconocible.",
    ],
    b: ["Arquitectura simple en bloques.", "Buen aprovechamiento de hardware.", "Capacidad de escalar con datos y parametros."],
  },
  {
    t: "BERT, GPT y T5",
    s: "Tres ramas famosas nacidas del mismo tronco.",
    p: [
      "BERT usa un enfoque encoder-only y se entreno con objetivos pensados para representaciones bidireccionales. Fue muy influyente en clasificacion y comprension.",
      "GPT usa decoder-only causal: predice el siguiente token. Esta familia mostro que escalar modelos generativos produce capacidades muy generales.",
      "T5 reinterpreta muchas tareas como texto a texto y usa encoder-decoder. Es una continuacion natural del planteamiento secuencia a secuencia del paper original.",
    ],
    b: ["BERT: comprender/representar.", "GPT: continuar/generar.", "T5: texto-a-texto encoder-decoder."],
  },
  {
    t: "Limitaciones de self-attention",
    s: "Ninguna herramienta es gratis.",
    p: [
      "La self-attention completa compara cada token con cada token. Si duplicas la longitud, el numero de pares se cuadruplica. Esto afecta memoria y tiempo.",
      "Ademas, mas contexto no garantiza mejor uso del contexto. El modelo debe aprender a recuperar lo relevante entre mucho ruido.",
      "Por eso hay lineas de investigacion en atencion local, atencion dispersa, compresion de memoria, recuperacion externa y arquitecturas hibridas.",
    ],
    b: ["Coste cuadratico.", "Dificultad para usar contexto largo.", "Necesidad de ingenieria de memoria y datos."],
  },
  {
    t: "Interpretabilidad con cuidado",
    s: "Mirar pesos de atencion ayuda, pero no basta.",
    p: [
      "Las visualizaciones del paper son intuitivas: vemos lineas o mapas que conectan palabras. Eso puede revelar patrones interesantes.",
      "Sin embargo, una prediccion depende de muchas capas, cabezas, feed-forward, normalizaciones y parametros. Un mapa de atencion no es una explicacion completa.",
      "La actitud correcta es usar visualizaciones como pistas pedagogicas y de depuracion, no como prueba definitiva de razonamiento.",
    ],
    b: ["Util: ver patrones.", "Limitado: no explica todo el calculo.", "Mejor: combinar con experimentos y ablations."],
  },
  {
    t: "Como leer el paper original",
    s: "Una ruta recomendada para no atascarse.",
    p: [
      "Primero lee Abstract e Introduction para captar el problema. Despues mira la Figura 1 y entiende el flujo encoder-decoder. Luego estudia la seccion 3.2 de atencion.",
      "No intentes dominar todas las referencias al principio. Vuelve a las tablas cuando ya entiendas que comparan.",
      "Finalmente, revisa las visualizaciones del apendice como recompensa conceptual: veras que algunas cabezas aprenden relaciones que se parecen a estructuras linguisticas.",
    ],
    b: ["Paso 1: problema y motivacion.", "Paso 2: arquitectura.", "Paso 3: atencion y formulas.", "Paso 4: resultados y ablations."],
  },
  {
    t: "Glosario esencial",
    s: "Terminos que conviene tener a mano.",
    p: [
      "Token: unidad discreta de texto. Embedding: vector numerico asociado a un token. Contexto: conjunto de tokens disponibles para el modelo.",
      "Attention head: una instancia paralela de atencion. Layer: bloque repetido del modelo. Logits: puntuaciones antes de softmax.",
      "Loss: medida de error que se minimiza durante entrenamiento. Backpropagation: algoritmo para calcular como ajustar parametros.",
    ],
    b: ["Self-attention: una secuencia se atiende a si misma.", "Cross-attention: una secuencia consulta otra.", "Causal mask: bloqueo de tokens futuros."],
  },
  {
    t: "Errores comunes al estudiar Transformers",
    s: "Atajos mentales que conviene evitar.",
    p: [
      "Error 1: creer que atencion es lo mismo que explicacion. Es una parte del calculo, no una interpretacion completa.",
      "Error 2: pensar que los LLM tienen una base de datos interna literal. Tienen parametros que producen distribuciones de tokens.",
      "Error 3: olvidar la posicion. Sin codificacion posicional o mecanismo equivalente, el orden de la secuencia no queda representado adecuadamente.",
    ],
    b: ["Atencion ayuda, pero no lo explica todo.", "Parametros no son filas SQL.", "Orden y mascara causal son detalles decisivos."],
  },
  {
    t: "Mini ejercicio 1",
    s: "Detectar dependencias en una frase.",
    p: [
      "Frase: 'Maria dejo el libro sobre la mesa porque estaba cansada'. Pregunta: a que token deberia atender mucho la palabra 'cansada' para resolver el sujeto implicito?",
      "Un humano probablemente conecta 'cansada' con 'Maria'. Un modelo podria aprender un patron parecido si reduce el error en muchos ejemplos similares.",
      "Este ejercicio no requiere calculos. Solo busca entrenar la intuicion de que algunas relaciones importantes son largas y no siempre vecinas.",
    ],
    b: ["Marca palabras candidatas.", "Distingue cercania de relevancia.", "Piensa que cabezas distintas podrian mirar a cosas distintas."],
  },
  {
    t: "Mini ejercicio 2",
    s: "Construir una mascara causal.",
    p: [
      "Para tokens [A, B, C, D], dibuja una matriz 4x4. La fila B puede mirar A y B, pero no C ni D. La fila D puede mirar todos los anteriores y a si misma.",
      "El resultado es triangular inferior. Esta matriz se suma a las puntuaciones de atencion antes de softmax, usando valores muy negativos en posiciones prohibidas.",
      "Asi, softmax asigna probabilidad practicamente cero a los tokens futuros.",
    ],
    mask: true,
  },
  {
    t: "Mini ejercicio 3",
    s: "Explicar multi-head con una analogia.",
    p: [
      "Piensa en un equipo revisando una frase. Una persona mira gramatica, otra referencias, otra puntuacion, otra palabras tecnicas. Cada una produce observaciones parciales.",
      "Multi-head attention no es literalmente un equipo humano, pero la analogia sirve: varias proyecciones aprenden a capturar patrones distintos y luego se combinan.",
      "Intenta explicar esto sin formulas. Si puedes hacerlo, ya tienes la intuicion principal.",
    ],
    b: ["Una cabeza no es una neurona; es una atencion completa.", "Cada cabeza opera en un subespacio.", "La salida se concatena y se mezcla de nuevo."],
  },
  {
    t: "Mini ejercicio 4",
    s: "Relacionar paper y producto moderno.",
    p: [
      "Cuando escribes un prompt largo a un LLM, el modelo convierte todo en tokens, suma informacion de posicion y aplica muchas capas de self-attention causal.",
      "Cada nuevo token generado vuelve a entrar como parte del contexto. La respuesta completa es una cadena de decisiones locales condicionadas por todo lo anterior.",
      "El ejercicio: identifica que partes vienen directamente de la arquitectura Transformer y que partes pertenecen a sistemas modernos externos, como herramientas, RAG o politicas de seguridad.",
    ],
    b: ["Transformer: calculo neural base.", "Sistema: prompt, herramientas, memoria, recuperacion, interfaz.", "No confundir arquitectura con producto."],
  },
  {
    t: "Resumen conceptual",
    s: "La version de una pagina.",
    p: [
      "El Transformer reemplaza la recurrencia por atencion. Cada token puede mirar a otros tokens y construir una representacion contextual. Eso permite paralelizar entrenamiento y capturar dependencias largas.",
      "La arquitectura original usa encoder y decoder. El encoder lee; el decoder genera. Sus bloques combinan multi-head attention, feed-forward, residuales, normalizacion y posicion.",
      "Los LLM modernos escalan esta idea, a menudo con decoders causales enormes entrenados para predecir el siguiente token. La magia aparente nace de una pila grande de operaciones matematicas bastante sistematicas.",
    ],
    b: ["Idea clave: informacion relevante mediante atencion.", "Ventaja clave: paralelizacion y caminos cortos.", "Legado clave: base de los LLM contemporaneos."],
  },
  {
    t: "Mapa mental final",
    s: "Conecta las piezas principales antes de volver al paper.",
    p: [
      "Si entiendes tokens, embeddings, posicion, Q/K/V, softmax, multi-head, mascara causal y bloques apilados, ya puedes leer gran parte del paper original con autonomia.",
      "Lo que queda despues es profundizar: algebra lineal, entrenamiento, optimizacion, hardware, escalado y evaluacion.",
      "El mejor siguiente paso es implementar una self-attention pequena en codigo y comprobar las dimensiones de cada matriz.",
    ],
    map: true,
  },
  {
    t: "Referencias y atribucion",
    s: "Fuente principal y uso de figuras recreadas.",
    p: [
      "Fuente principal: Vaswani, A. et al. (2017). Attention Is All You Need. arXiv:1706.03762v7. El propio PDF indica permiso de Google para reproducir tablas y figuras con atribucion en usos academicos o divulgativos.",
      "Este documento no sustituye al paper: lo acompana. Las figuras incluidas aqui son recreaciones pedagogicas y esquemas simplificados basados en los conceptos del articulo.",
      "Recomendacion: tras estudiar esta guia, vuelve al PDF original y lee especialmente las secciones 3.1 a 3.5 y las tablas 1 a 4.",
    ],
    b: ["Paper original: arquitectura Transformer.", "Guia: explicacion divulgativa en espanol.", "Uso sugerido: clase introductoria, lectura guiada o repaso junior."],
  },
];

function renderPage(page, i) {
  if (i > 0) doc.addPage();
  footer(i + 1);
  h1(page.t, page.s);
  const bodyTop = 138;
  const paraH = 72;
  page.p.slice(0, 3).forEach((p, idx) => {
    para(p, { y: bodyTop + idx * paraH, size: 9.6, lineGap: 2.5, height: paraH - 6 });
  });
  if (page.b) {
    const by = 360;
    const bh = Math.min(164, 38 + page.b.length * 27);
    box(margin, by, contentW, bh, "Ideas clave", "", accent, soft);
    bullet(page.b, margin + 14, by + 32, contentW - 28);
  }
  if (page.diagram === "attention") attentionDiagram(margin, 415, contentW);
  if (page.diagram === "position") positionalPlot(margin + 18, 390, contentW - 36, 210);
  if (page.diagram === "transformer") transformerDiagram(margin, 305, contentW, 322);
  if (page.formula) {
    codeBlock([
      "Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V",
      "",
      "1. Q K^T: similitud entre preguntas y claves",
      "2. / sqrt(d_k): escala para estabilizar",
      "3. softmax: pesos que suman 1",
      "4. * V: mezcla de informacion"
    ], margin + 20, 410, contentW - 40, 120);
  }
  if (page.heatmap) {
    attentionHeatmap(margin + 18, 370, ["yo", "como", "manzanas", "rojas", "hoy", "."], [[3, 2, 0.85], [1, 0, 0.38], [2, 1, 0.45], [4, 1, 0.28]]);
    para("Ejemplo de mapa de atencion: las celdas mas oscuras indican mayor peso.", { x: margin + 18, y: 555, width: contentW - 36, size: 9, color: muted });
  }
  if (page.complexity) {
    table(margin + 8, 390, ["Tipo", "Coste/capa", "Secuencial", "Camino"], [
      ["Self-attention", "O(n^2 d)", "O(1)", "O(1)"],
      ["Recurrente", "O(n d^2)", "O(n)", "O(n)"],
      ["Convolucional", "O(k n d^2)", "O(1)", "O(log_k n)"],
      ["Self-attn local", "O(r n d)", "O(1)", "O(n/r)"],
    ], [130, 120, 110, 110]);
  }
  if (page.code) codeBlock(page.code, margin + 28, 410, contentW - 56, 115);
  if (page.mask) {
    const x = margin + 95, y = 390, cell = 44;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(muted);
    ["A", "B", "C", "D"].forEach((t, idx) => {
      doc.text(t, x + 58 + idx * cell, y + 10);
      doc.text(t, x + 20, y + 49 + idx * cell);
    });
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        doc.rect(x + 50 + c * cell, y + 42 + r * cell, cell - 2, cell - 2).fill(c <= r ? "#d7f0e2" : "#f3d7d7");
        doc.font("Helvetica-Bold").fontSize(14).fillColor(c <= r ? green : "#9b2c2c").text(c <= r ? "OK" : "X", x + 60 + c * cell, y + 54 + r * cell);
      }
    }
  }
  if (page.map) {
    const nodes = [
      ["Tokens", margin + 20, 395, green],
      ["Embeddings", margin + 155, 395, green],
      ["Posicion", margin + 300, 395, orange],
      ["Self-attention", margin + 85, 485, accent],
      ["Multi-head", margin + 260, 485, purple],
      ["Bloques apilados", margin + 180, 575, ink],
    ];
    nodes.forEach(([label, x, y, color]) => box(x, y, 118, 45, label, "", color, "#ffffff"));
    arrow(margin + 138, 418, margin + 155, 418);
    arrow(margin + 273, 418, margin + 300, 418);
    arrow(margin + 210, 440, margin + 150, 485);
    arrow(margin + 360, 440, margin + 320, 485);
    arrow(margin + 145, 530, margin + 205, 575);
    arrow(margin + 320, 530, margin + 275, 575);
  }
}

pages.forEach(renderPage);
doc.end();

doc.on("finish", () => {
  console.log(outPath);
});
