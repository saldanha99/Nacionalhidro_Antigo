"use strict";

const INDICE_UNICO_ORDEM_SERVICO = "idx_ordem_servicos_codigo_numero";

const obterCodigoErro = (error) =>
  error?.code || error?.originalError?.code || error?.nativeError?.code;

const obterNumeroErro = (error) =>
  error?.errno || error?.originalError?.errno || error?.nativeError?.errno;

const ehErroOrdemDuplicada = (error) =>
  obterCodigoErro(error) === "ER_DUP_ENTRY" || obterNumeroErro(error) === 1062;

const ehErroIndiceExistente = (error) =>
  obterCodigoErro(error) === "ER_DUP_KEYNAME" || obterNumeroErro(error) === 1061;

const linhasResultadoRaw = (result) =>
  Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

const garantirIndiceUnicoOrdemServico = async (strapi) => {
  const db = strapi.db.connection;

  const duplicadas = linhasResultadoRaw(
    await db.raw(`
      SELECT codigo, numero, COUNT(*) AS quantidade
      FROM ordem_servicos
      WHERE codigo IS NOT NULL AND numero IS NOT NULL
      GROUP BY codigo, numero
      HAVING COUNT(*) > 1
      LIMIT 1
    `)
  );

  if (duplicadas?.length) {
    const duplicada = duplicadas[0];
    throw new Error(
      `[OrdemServico] Não foi possível ativar a proteção contra duplicidade: ` +
      `a OS ${duplicada.codigo}/${duplicada.numero} possui ${duplicada.quantidade} registros.`
    );
  }

  const indices = linhasResultadoRaw(
    await db.raw(
      `
        SELECT 1
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = 'ordem_servicos'
          AND index_name = ?
        LIMIT 1
      `,
      [INDICE_UNICO_ORDEM_SERVICO]
    )
  );

  if (indices?.length) return;

  try {
    await db.raw(
      `ALTER TABLE ordem_servicos ` +
      `ADD UNIQUE INDEX ${INDICE_UNICO_ORDEM_SERVICO} (codigo, numero)`
    );
    strapi.log.info(
      "[OrdemServico] Proteção única por Código/Número ativada."
    );
  } catch (error) {
    // Duas instâncias podem iniciar juntas e tentar criar o mesmo índice.
    if (!ehErroIndiceExistente(error)) throw error;
  }
};

module.exports = {
  ehErroOrdemDuplicada,
  garantirIndiceUnicoOrdemServico,
};
